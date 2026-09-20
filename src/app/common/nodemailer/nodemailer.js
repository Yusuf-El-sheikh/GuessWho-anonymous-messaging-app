import { config } from "dotenv";
config();
import nodemailer from "nodemailer";

export async function sendEmail(to, subject, html) {
    const transporter = nodemailer.createTransport(
        {
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASS
            }
        }
    );
    await transporter.sendMail({
        from: `"GuessWho?" <${process.env.EMAIL}>`,
        to: to,
        subject: subject,
        html: html
    });
}