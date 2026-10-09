import Mailjet from "node-mailjet";
export class MailjetProvider {
  client;
  fromEmail;
  fromName;

  constructor(config) {
    this.client = new Mailjet({
      apiKey: config.apiKey,
      apiSecret: config.secretKey,
    });
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }

  async sendMail(email, subject, html) {
    await this.client.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: this.fromEmail,
            Name: this.fromName,
          },
          To: [
            {
              Email: email,
              Name: "You",
            },
          ],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });
  }
}
