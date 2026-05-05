const createTransporter = require("../config/mailConfig");

const getFromAddress = () => {
  const fromName = process.env.BREVO_FROM_NAME || "CivicFix AI";
  const fromEmail = process.env.BREVO_FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("BREVO_FROM_EMAIL is missing in .env");
  }

  return `"${fromName}" <${fromEmail}>`;
};

const sendOTPEmail = async ({ to, otp, purpose, complaintId = "" }) => {
  const transporter = createTransporter();

  const subject =
    purpose === "FORGOT_PASSWORD"
      ? "CivicFix AI Password Reset OTP"
      : "CivicFix AI Complaint Tracking OTP";

  const title =
    purpose === "FORGOT_PASSWORD"
      ? "Reset Your Password"
      : "Track Your Complaint";

  const message =
    purpose === "FORGOT_PASSWORD"
      ? "Use this OTP to reset your CivicFix AI account password."
      : `Use this OTP to securely track complaint ${complaintId}.`;

  const html = `
    <div style="font-family: Arial, sans-serif; background:#f1f5f9; padding:28px;">
      <div style="max-width:560px; margin:auto; background:#ffffff; border-radius:18px; padding:26px; border:1px solid #dbe3ef;">
        <div style="display:inline-block; background:#eff6ff; color:#2563eb; padding:8px 12px; border-radius:999px; font-weight:800;">
          CivicFix AI
        </div>

        <h2 style="color:#0f172a; margin:18px 0 10px;">${title}</h2>

        <p style="color:#475569; line-height:1.6;">
          ${message}
        </p>

        <div style="font-size:34px; letter-spacing:8px; font-weight:900; color:#2563eb; background:#eff6ff; border-radius:16px; padding:18px; text-align:center;">
          ${otp}
        </div>

        <p style="color:#64748b; margin-top:18px;">
          This OTP is valid for 10 minutes.
        </p>

        <p style="color:#94a3b8; font-size:13px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
  });
};

module.exports = sendOTPEmail;