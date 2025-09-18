import "dotenv/config";
import { parse, z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(8001),
  DB_URL: z.url(),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten());
  process.exit(1);
}

export const env = parsed.data;
