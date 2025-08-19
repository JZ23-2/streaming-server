import axios, { HttpStatusCode } from "axios";

export async function createStream(dto) {
    try {
    const response = await axios.post(`${process.env.BACKEND_URL}/api/v1/streams/create-stream`, undefined, dto);
        if (response.status != HttpStatusCode.Ok) return undefined;

        return response.data.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }

}