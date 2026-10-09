import Mailjet from "node-mailjet";
export class MailjetProvider {
  client;
  fromEmail;
  fromName;

  constructor(config) {
    this.client = new Mailjet({
      apiKey: config.apikey,
      apiSecret: config.secretKey,
    });
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }

  sendMail(email, subject, html) {
    this.client.post("send", { version: "v3.1" }).request({
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
          subject: subject,
          HTMLpart: html,
        },
      ],
    });
  }
}
