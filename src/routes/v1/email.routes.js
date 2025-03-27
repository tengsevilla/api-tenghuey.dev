import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const EMAIL_TOKEN = process.env.EMAIL_TOKEN;

const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

// ✅ Send Mail Route
router.post("/send", async (req, res) => {
    try {
        const authToken = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer scheme
        const { name, email, message, subject, sendTo } = req.body;

        if (!authToken || authToken !== EMAIL_TOKEN) {
            return res.status(401).json({ status: 401, mailsent: false, apimessage: "Unauthorized: Invalid auth token" });
        }

        const mailOptions = {
            from: '"noreply" <anthonysevilla@tenghuey.dev>',
            to: sendTo,
            subject: subject || "New Contact Request",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto;">
              <h2 style="color: #2c3e50;">📩 New Message Received</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0;">${email}</td>
                </tr>
              </table>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
              <p style="margin-bottom: 10px;"><strong>Message:</strong></p>
              <p style="background: #f9f9f9; padding: 15px; border-radius: 6px; white-space: pre-line;">${message}</p>
            </div>
          `,

        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}`);
        res.status(200).json({ status: 200, apimessage: "Email sent successfully", mailsent: true, info });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ status: 500, apimessage: "Error sending email", error: error.message, mailsent: false });
    }
});

export default router;
