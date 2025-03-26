import express from "express";
import nodemailer from "nodemailer";
import dbConfig from "../../config/sys.config.js";

const router = express.Router();

const EMAIL_TOKEN = dbConfig.EMAIL_TOKEN ?? process.env.EMAIL_TOKEN; // Replace with your actual static GUID

const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: dbConfig.NODEMAILER_MAIL,  // ✅ Ensure correct email
        pass: dbConfig.NODEMAILER_PASSWORD,  // ✅ Ensure correct password
    },
});

// ✅ Send Mail Route
router.post("/send", async (req, res) => {
    try {
        const { authToken, name, email, message, subject, sendTo } = req.body;

        if (!authToken || authToken !== EMAIL_TOKEN) {
            return res.status(401).json({ status: 401, mailsent: false, apimessage: "Unauthorized: Invalid auth token" });
        }

        const mailOptions = {
            from: '"noreply" <anthonysevilla@tenghuey.dev>',
            to: sendTo,
            subject: subject || "New Contact Request",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
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
