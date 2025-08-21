import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { supabase } from "../configs/supabaseConfig.js";
import {
  getUserByStreamingKey,
  getAllFollowers,
} from "../services/userService.js";
import fetch from "node-fetch";
import { CreateStreamHistoryDto } from "../dtos/createHistoryDto.js";
import { createStreamHistory } from "../services/streamHistoryService.js";
import { createStream, stopStream } from "../services/stream-service.js";
import { getThumbnail } from "../services/ffmpeg-service.js";
import FormData from "form-data";

export const streamMap = new Map();

export function registerNmsListeners(nms, baseDir) {
  nms.on("prePublish", async (id, StreamPath, args) => {
    console.log(`[NodeEvent on prePublish] id=${id} StreamPath=${StreamPath}`);

    const streamKey = StreamPath.split("/").pop();
    const userResponse = await getUserByStreamingKey(streamKey);
    if (!userResponse?.ok) {
      const session = nms.getSession(id);
      session.reject();
      return;
    }
    streamMap.set(userResponse.ok.principal_id, streamKey);

    const thumbnailPath = await getThumbnail(streamKey);
    console.log("thumnail path: ", thumbnailPath);
    const form = new FormData();
    form.append("thumbnail", fs.createReadStream(thumbnailPath), {
      filename: `${streamKey}.jpg`,
      contentType: "image/jpeg",
    });
    form.append("hostPrincipalId", userResponse.ok.principal_id);

    const createStreamResponse = await createStream(form);

    console.log(createStreamResponse);

    const followersResponse = await getAllFollowers(
      userResponse.ok.principal_id
    );
    const payload = {
      streamerId: userResponse.ok.principal_id,
      followers: followersResponse.ok.map((f) => f.principal_id),
    };

    const notifyResponse = await fetch(
      `${process.env.BACKEND_URL}/api/v1/global-sockets/start-stream`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload, (key, value) =>
          typeof value === "bigint" ? JSON.rawJSON(value.toString()) : value
        ),
      }
    );

    if (!notifyResponse.ok) {
      console.error(
        `Failed to notify backend for streamer ${userResponse.ok.principal_id}`
      );
    } else {
      console.log(
        `Successfully notified backend for streamer ${userResponse.ok.principal_id}`
      );
    }

    // const { email, room } = streamKeyService.getStreamKeyInfo(streamKey);
    // console.log(`Stream started by ${email} in room ${room}`);
  });

  nms.on("donePublish", async (id, StreamPath, args) => {
    console.log(`[NodeEvent donePublish] id=${id} StreamPath=${StreamPath}`);

    const streamKey = StreamPath.split("/").pop();
    const userResponse = await getUserByStreamingKey(streamKey);
    if (!userResponse?.ok) {
      const session = nms.getSession(id);
      session.reject();
      return;
    }

    const streamerId = userResponse.ok.principal_id;
    if (!streamerId) {
      console.warn("Streamer not found in streamMap, skipping upload");
      return;
    }

    const streamDir = path.join(baseDir, "media", "live", streamKey);
    const playlistPath = path.join(streamDir, "index.m3u8");
    if (!fs.existsSync(playlistPath)) {
      console.warn("Playlist file not found, skipping upload");
      return;
    }

    const outputFile = path.join(streamDir, `${streamKey}.mp4`);
    const response = await stopStream(userResponse.ok.principal_id);

    exec(
      `ffmpeg -i "${playlistPath}" -c copy "${outputFile}"`,
      async (error) => {
        try {
          if (error) {
            console.error("FFmpeg conversion error:", error);
            throw error;
          }

          console.log(`FFmpeg conversion complete: ${outputFile}`);
          const fileBuffer = fs.readFileSync(outputFile);
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

          const { error: uploadError } = await supabase.storage
            .from("stream_history")
            .upload(`${streamerId}/${streamKey}_${timestamp}.mp4`, fileBuffer, {
              contentType: "video/mp4",
              upsert: true,
            });

          if (uploadError) {
            console.error("Upload failed:", uploadError);
            throw uploadError;
          }

          const { data: publicUrlData } = supabase.storage
            .from("stream_history")
            .getPublicUrl(`${streamerId}/${streamKey}_${timestamp}.mp4`);

          const result = await createStreamHistory({
            streamId: response.streamId,
            hostPrincipalID: streamerId,
            videoUrl: publicUrlData.publicUrl,
          });
          if (result.message !== "stream history success") {
            throw new Error("failed saving stream");
          }
        } catch (error) {
        } finally {
          fs.rmSync(streamDir, { recursive: true, force: true });
          streamMap.delete(streamerId);
        }
      }
    );
  });
}
