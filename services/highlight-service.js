import axios, { HttpStatusCode } from "axios";

export async function createHighlight(videoUrl, streamHistoryID) {
  try {
    const response = await axios.post(
      `${process.env.AI_URL}/generate_highlight`,
      { video_url: videoUrl }
    );

    if (response.status !== HttpStatusCode.Ok) return undefined;

    const mappedClips = response.data.clips.map((clip) => ({
      highlightStreamHistoryID: streamHistoryID,
      highlightUrl: clip.path,
      startHighlight: clip.start,
      endHighlight: clip.end,
      highlightDescription: clip.description,
    }));

    return { clips: mappedClips };
  } catch (error) {
    console.error("Failed to create highlight:", error);
    return undefined;
  }
}
