import axios, { AxiosError } from "axios";
import FormData from "form-data";
import fs from "fs";

interface UploadResponse {
  app_url: string;
}

export async function uploadApp(filePath: string, username: string, password: string): Promise<UploadResponse> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  try {
    const response = await axios.post<UploadResponse>(
      "https://api-cloud.browserstack.com/app-live/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        auth: {
          username,
          password,
        },
      },
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to upload app: ${error.response?.data?.message || error.message}`,
      );
    }
    throw error;
  }
}
