import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import crypto from "crypto";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json(
        { message: "If account exists, reset email sent" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.forgotPasswordToken = resetToken;
    user.forgotPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    await sendEmail({
      email,
      emailType: "RESET",
      userId: user._id,
    });

    return NextResponse.json(
      { message: "Reset email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
