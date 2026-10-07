import nodemailer from "nodemailer";
import {env} from "../config/env.js"

export async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.nodemailer.email,
      pass: env.nodemailer.pass,
    },
  });
  await transporter.sendMail({
    from: `"GuessWho?" <${env.nodemailer.email}>`,
    to: to,
    subject: subject,
    html: html,
  });
}
