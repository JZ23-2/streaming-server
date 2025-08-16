import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { supabase } from "../configs/supabaseConfig.js";
import {
  getUserByStreamingKey,
  getAllFollowers,
} from "../services/userService.js";

export const streamMap = new Map();

export function registerNmsListeners(nms, baseDir) {
  nms.on("prePublish", async (id, StreamPath) => {
    console.log(`[NodeEvent prePublish] id=${id} path=${StreamPath}`);
    const streamKey = StreamPath.split("/").pop();

    const userResponse = await getUserByStreamingKey(streamKey);
    if (!userResponse.ok) {
      nms.getSession(id).reject();
      return;
    }

    streamMap.set(userResponse.ok.principal_id, userResponse.ok.streaming_key);

    const followersResponse = await getAllFollowers(
      userResponse.ok.principal_id
    );
    const payload = {
      streamerId: userResponse.ok.principal_id,
      followers: followersResponse.ok,
    };

    await fetch(
      `${process.env.BACKEND_URL}/api/v1/global-sockets/start-stream`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
  });

  nms.on("donePublish", async (id, StreamPath) => {
    console.log(`[NodeEvent donePublish] id=${id} path=${StreamPath}`);
    const streamKey = StreamPath.split("/").pop();
    const streamerId = [...streamMap.entries()].find(
      ([id, key]) => key === streamKey
    )?.[0];
    if (!streamerId) return;

    const streamDir = path.join(baseDir, "media", "live", streamKey);
    const playlistPath = path.join(streamDir, "index.m3u8");
    if (!fs.existsSync(playlistPath)) return;

    const outputFile = path.join(streamDir, `${streamKey}.mp4`);

    exec(
      `ffmpeg -i "${playlistPath}" -c copy "${outputFile}"`,
      async (error) => {
        if (error) {
          console.error("FFmpeg conversion error:", error);
          return;
        }

        console.log(`FFmpeg conversion complete: ${outputFile}`);
        const fileBuffer = fs.readFileSync(outputFile);

        const { data, error: uploadError } = await supabase.storage
          .from("stream_history")
          .upload(`${streamerId}/${streamKey}.mp4`, fileBuffer, {
            contentType: "video/mp4",
            upsert: true,
          });

        if (uploadError) console.error("Upload failed:", uploadError);
        else console.log("Uploaded MP4:", data);

        fs.rmSync(streamDir, { recursive: true, force: true });
      }
    );
  });
}
