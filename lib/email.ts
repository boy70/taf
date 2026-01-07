import nodemailer from "nodemailer"

export async function sendInviteEmail({ to, password }: { to: string; password: string }) {
  // Configure your SMTP transport here
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Your Account Credentials",
    text: `Welcome!\n\nYour account has been created.\n\nEmail: ${to}\nPassword: ${password}\n\nPlease log in and change your password.`,
    html: `<p>Welcome!</p><p>Your account has been created.</p><ul><li><b>Email:</b> ${to}</li><li><b>Password:</b> ${password}</li></ul><p>Please log in and change your password.</p>`,
  })

  return info
}
