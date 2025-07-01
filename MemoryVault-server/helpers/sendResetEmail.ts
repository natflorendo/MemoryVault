import nodemailer from 'nodemailer';

export async function sendResetEmail (to: string, code: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"MemoryVault Support" <${process.env.EMAIL_FROM}>`,
        to,
        subject: "Your MemoryVault Password Reset Code",
        html: `
            <p>Here is your password reset code:</p>
            <h2>${code}</h2>
            <p>This code will expire in 15 minutes.</p>
        `,
    });
}