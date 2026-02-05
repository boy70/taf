import nodemailer from "nodemailer"

export async function sendInviteEmail({ to, password }: { to: string; password: string }) {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  // If SMTP is NOT configured, use dev mode
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.log("📧 [DEV MODE - No SMTP configured] Email would be sent to:", to)
    console.log("📧 [DEV MODE] Credentials - Email:", to, "Password:", password)
    return { messageId: "dev-mode-" + Date.now() }
  }

  // SMTP is configured - send real email
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpUser,
      to,
      subject: "Your Account Credentials - TAF Sula",
      text: `Welcome!\n\nYour account has been created.\n\nEmail: ${to}\nPassword: ${password}\n\nPlease log in at http://localhost:3000 and change your password.\n\nBest regards,\nTAF Sula Team`,
      html: `<p>Welcome!</p><p>Your account has been created.</p><ul><li><b>Email:</b> ${to}</li><li><b>Password:</b> ${password}</li></ul><p><a href="http://localhost:3000">Click here to log in</a> and change your password.</p><p>Best regards,<br>TAF Sula Team</p>`,
    })

    console.log("✅ [EMAIL SENT] To:", to)
    return info
  } catch (error: any) {
    console.error("❌ [EMAIL ERROR]:", error.message)
    throw error
  }
}
