const createTransporter = require("../config/mailConfig");

const getFromAddress = () => {
  const fromName = process.env.BREVO_FROM_NAME || "CivicFix AI";
  const fromEmail = process.env.BREVO_FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("BREVO_FROM_EMAIL is missing in .env");
  }

  return `"${fromName}" <${fromEmail}>`;
};

const getEmailTemplate = ({ otp, purpose, complaintId = "" }) => {
  const isForgotPassword = purpose === "FORGOT_PASSWORD";

  const subjectTitle = isForgotPassword
    ? "Password Reset OTP"
    : "Complaint Tracking OTP";

  const mainMessage = isForgotPassword
    ? "You requested to reset your CivicFix AI password. Use the OTP below:"
    : `You requested to track your complaint ${complaintId}. Use the OTP below:`;

  const footerMessage = isForgotPassword
    ? "If you did not request a password reset, you can safely ignore this email."
    : "If you did not request complaint tracking, you can safely ignore this email.";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>

    <body style="margin:0; padding:0; background:#07111f; font-family:Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#07111f; padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; background:#1d2a34; border:1px solid #314250; border-radius:24px; overflow:hidden; box-shadow:0 24px 70px rgba(0,0,0,0.35);">
              
              <tr>
                <td style="padding:34px 34px 12px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;">
                        <div style="width:58px; height:58px; border-radius:18px; background:linear-gradient(135deg,#2563eb,#06b6d4); display:inline-block; text-align:center; line-height:58px; color:#ffffff; font-size:32px; font-weight:900;">
                          🛡️
                        </div>
                      </td>

                      <td style="vertical-align:middle; padding-left:16px;">
                        <h1 style="margin:0; color:#14c8a6; font-size:32px; line-height:1.1; font-weight:900;">
                          CivicFix <span style="color:#38bdf8;">AI</span>
                        </h1>
                        <p style="margin:5px 0 0; color:#9fb2c4; font-size:14px; font-weight:700;">
                          Smart Civic Complaint Resolution
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:10px 34px 0;">
                  <h2 style="margin:0; color:#ffffff; font-size:24px; font-weight:900;">
                    ${subjectTitle}
                  </h2>
                </td>
              </tr>

              <tr>
                <td style="padding:26px 34px 0;">
                  <p style="margin:0; color:#dbeafe; font-size:18px; line-height:1.7;">
                    ${mainMessage}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:30px 34px;">
                  <div style="background:#0b1720; border-radius:18px; padding:30px 20px; text-align:center; border:1px solid #263846;">
                    <div style="color:#22e07f; font-size:50px; line-height:1; letter-spacing:12px; font-weight:900;">
                      ${otp}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:0 34px 18px;">
                  <p style="margin:0; color:#b6c8d8; font-size:16px; line-height:1.7;">
                    This OTP is valid for <b style="color:#ffffff;">10 minutes</b>. Do not share this OTP with anyone.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 34px 34px;">
                  <div style="background:#13222d; border:1px solid #2e4454; border-radius:16px; padding:16px;">
                    <p style="margin:0; color:#8fa6b8; font-size:14px; line-height:1.6;">
                      ${footerMessage}
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="background:#111d27; padding:18px 34px; text-align:center; border-top:1px solid #2d3f4d;">
                  <p style="margin:0; color:#8fa6b8; font-size:13px; font-weight:700;">
                    © 2026 CivicFix AI · Report smarter. Fix faster.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

const sendOTPEmail = async ({ to, otp, purpose, complaintId = "" }) => {
  const transporter = createTransporter();

  const subject =
    purpose === "FORGOT_PASSWORD"
      ? "CivicFix AI Password Reset OTP"
      : "CivicFix AI Complaint Tracking OTP";

  const html = getEmailTemplate({
    otp,
    purpose,
    complaintId,
  });

  const info = await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
  });

  return info;
};

module.exports = sendOTPEmail;