import axios from "axios";

/**
 * @param {CreateStreamHistoryDto} dto
 */
export async function createStreamHistory(dto) {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/v1/stream-history/create`,
      dto,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (err) {
    console.error(
      "Error creating stream history:",
      err.response?.data || err.message
    );
    throw err;
  }
}
