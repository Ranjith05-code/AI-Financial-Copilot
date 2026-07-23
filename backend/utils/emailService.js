const nodemailer = require("nodemailer");

const isPlaceholderEmailConfig = () => {
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();

    return !user || !pass || user.includes("your_gmail") || pass.includes("your_gmail");
};

const sendOTPEmail = async (to, otp) => {
    if (isPlaceholderEmailConfig()) {
        console.log(`📧 [DEV OTP MODE] Verification code for ${to}: ${otp}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"FinanceAI" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your FinanceAI Verification Code",
        html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;background:#0d1424;color:#e2e8f0;border-radius:16px;padding:40px;">
                <h2 style="color:#c9a84c;margin-bottom:8px;">Verify your email</h2>
                <p style="color:#7a90b0;margin-bottom:32px;">Enter this code to complete your FinanceAI registration. It expires in <strong style="color:#e2e8f0;">10 minutes</strong>.</p>
                <div style="background:#111d35;border-radius:12px;padding:24px;text-align:center;letter-spacing:12px;font-size:36px;font-weight:bold;color:#c9a84c;">
                    ${otp}
                </div>
                <p style="color:#4a6080;font-size:12px;margin-top:32px;">If you did not request this, you can safely ignore this email.</p>
            </div>
        `,
    });
};

module.exports = { sendOTPEmail };
