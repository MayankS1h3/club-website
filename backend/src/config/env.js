import "dotenv/config";
import { parse, z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(8001),
  DB_URL: z.url(),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  
  // Cloudinary configuration (required for image uploads)
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten());
  process.exit(1);
}

export const env = parsed.data;
