import NodeMediaServer from "node-media-server";

const nmsConfig = {
  http: {
    port: 8000,
    allow_origin: "*",
    mediaroot: "./media",
    host: "0.0.0.0",
  },
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 10,
    ping_timeout: 60,
    host: "0.0.0.0",
  },
  trans: {
    ffmpeg: "/opt/homebrew/bin/ffmpeg", // /usr/bin/ffmpeg kalau bingung tinggal ketik which ffmpeg
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=0]",
        hlsKeep: true,
      },
    ],
    MediaRoot: "./media",
  },
};

export const nms = new NodeMediaServer(nmsConfig);
