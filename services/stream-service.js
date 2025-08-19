import axios, { HttpStatusCode } from "axios";

export async function createStream(formData) {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/v1/streams/create-stream`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    if (response.status != HttpStatusCode.Created) return undefined;

    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function stopStream(hostPrincipalId) {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/v1/streams/stop-stream`,
      {
        hostPrincipalId,
      }
    );
    if (response.status != HttpStatusCode.Ok) return undefined;

    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
