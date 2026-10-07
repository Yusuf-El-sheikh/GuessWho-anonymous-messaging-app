import { z } from "zod";

import {config} from "dotenv"
config();

const schema = z.object({
  PORT: z.string().default(3000),

  DB_URL: z.string(),

  EMAIL: z.string().trim().toLowerCase(),
  APP_PASS: z.string(),

  SECRET_TOKEN_KEY: z.string(),

  GOOGLE_CLIENT_ID: z.string(),

  REDIS_PORT: z.string().default(6379),
  REDIS_HOST: z.string(),
  REDIS_PASS: z.string(),
});

const parsed = schema.parse(process.env); //check if process.env mathces the schema

export const env = {
  port: Number(parsed.PORT),

  db: {
    url: parsed.DB_URL,
  },

  redis: {
    host: parsed.REDIS_HOST,
    port: Number(parsed.REDIS_PORT),
    pass: parsed.REDIS_PASS,
  },

  nodemailer: {
    email: parsed.EMAIL,
    pass: parsed.APP_PASS,
  },

  jwt: {
    secret: parsed.SECRET_TOKEN_KEY,
  },

  google: {
    clientId: parsed.GOOGLE_CLIENT_ID,
  },
};
