import { exec } from "child_process";

export function getThumbnail(streamKey) {
  return new Promise((resolve, reject) => {
    const output = `/tmp/${streamKey}.jpg`;
    const ffmpegCmd = `ffmpeg -y -i "rtmp://localhost/live/${streamKey}" -ss 00:00:01 -vframes 1 -vf "scale=320:-1" ${output}`;

    exec(ffmpegCmd, (err) => {
      if (err) {
        console.error("FFmpeg error:", err);
        return reject(err);
      }
      resolve(output);
    });
  });
}