import { MailjetProvider } from "../../pkg/mailjet/mailjet.js";
import { env } from "../config/env.js";

export const mailjetProvider = new MailjetProvider({
  apiKey: env.mailjet.apiKey,
  apiSecret: env.mailjet.secretKey,
  fromEmail: env.mailjet.fromEmail,
  fromName: env.mailjet.appName,
});
