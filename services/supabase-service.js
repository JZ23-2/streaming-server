import fs from 'fs'
import { supabase } from './supabaseClient.js'

async function uploadThumbnail(path) {
  const fileBuffer = fs.readFileSync(filePath)

  const { data, error } = await supabase.storage
    .from('thumbnail')
    .upload('thumbnails/', fileBuffer, {
      contentType: 'image/png',
    })

  if (error) console.error(error)
  else console.log('File uploaded:', data)
}

function captureThumbnail(streamKey, userId) {
  return new Promise((resolve, reject) => {
    const output = `/tmp/${streamKey}.jpg`; // temp storage
    
    const ffmpegCmd = `ffmpeg -y -i "rtmp://localhost/live/${streamKey}" -ss 00:00:01 -vframes 1 -vf "scale=320:-1" ${output}`;
    
    exec(ffmpegCmd, async (err) => {
      if (err) {
        console.error("FFmpeg error:", err);
        return reject(err);
      }

      // upload via FormData
      const formData = new FormData();
      formData.append("thumbnail", fs.createReadStream(output));

      try {
        const uploadRes = await fetch(`${process.env.BACKEND_URL}/api/v1/streams/${userId}/thumbnail`, {
          method: "POST",
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error("Upload failed");
        }

        console.log("Thumbnail uploaded for stream:", streamKey);
        resolve(true);
      } catch (e) {
        reject(e);
      } finally {
        fs.unlinkSync(output); // cleanup
      }
    });
  });
}