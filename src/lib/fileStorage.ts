import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Simple file storage for development
// In production, replace this with AWS S3, Cloudinary, etc.

const UPLOAD_DIR = join(process.cwd(), "uploads");

export async function storeFile(file: File, fileName: string): Promise<string> {
  try {
    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const filePath = join(UPLOAD_DIR, uniqueFileName);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return the file path (in production, this would be a URL)
    return filePath;
  } catch (error) {
    console.error("Error storing file:", error);
    throw new Error("Failed to store file");
  }
}

export async function getFileBuffer(filePath: string): Promise<Buffer> {
  try {
    console.log("Attempting to read file from path:", filePath);

    // Check if file exists
    const { existsSync } = await import("fs");
    if (!existsSync(filePath)) {
      console.error("File does not exist at path:", filePath);
      throw new Error(`File not found: ${filePath}`);
    }

    console.log("File exists, reading buffer...");
    const buffer = await readFile(filePath);
    console.log("File buffer read successfully, size:", buffer.length);

    return buffer;
  } catch (error) {
    console.error("Error reading file:", error);
    throw new Error("Failed to read file");
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const { unlink } = await import("fs/promises");
    await unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw error for delete failures
  }
}
