import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // creates a hashed token using bcryptjs
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "e35d2f0a0c0416",
        pass: "1354dacb606bbb",
      },
    });

    // Prepare mail options based on email type
    const mailOptions = {
      from: "sahil@gmail.com",
      to: email,
      subject: "",
      html: "",
    };

    if (emailType === "VERIFY") {
      const verifyUrl = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;
      mailOptions.subject = "Verify your email";
      mailOptions.html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Thank you for signing up! Please verify your email address to continue.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify Email</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${verifyUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">This link will expire in 1 hour.</p>
        </div>
      `;
    } else if (emailType === "RESET") {
      const resetUrl = `${process.env.DOMAIN}/reset-password?token=${hashedToken}`;
      mailOptions.subject = "Reset Your Password";
      mailOptions.html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #EA580C; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">This link will expire in 1 hour.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `;
    }

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error("Email sending failed", { cause: error });
  }
};
