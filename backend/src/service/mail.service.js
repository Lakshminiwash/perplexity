import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.EMAIL_USER?.trim(),
        pass: process.env.EMAIL_PASS?.trim()
    }
})

// Initialize transporter verification
transporter.verify()
    .then(() => { console.log("✓ Email transporter is ready to send emails"); })
    .catch((err) => { console.error("✗ Email transporter verification failed:", err.message); });


export async function sendEmail({ to, subject, html, text }) {
    try {
        // Validate required parameters
        if (!to || !subject) {
            throw new Error("Missing required parameters: 'to' and 'subject' are required");
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
            text
        };

        const details = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", details.messageId);
        return {
            success: true,
            messageId: details.messageId,
            message: "Email sent successfully"
        };
    } catch (error) {
        console.error("Failed to send email:", error.message);
        return {
            success: false,
            error: error.message,
            message: "Failed to send email"
        };
    }
}