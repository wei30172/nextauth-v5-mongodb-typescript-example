import nodemailer from "nodemailer"

const baseURL = process.env.NEXT_PUBLIC_APP_URL
const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: emailUser, pass: emailPass }
})

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${baseURL}/new-verification?token=${token}`

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  }
  
  await transporter.sendMail(mailOptions)
}

export const sendPasswordResetEmail = async (
  email: string, 
  token: string
) => {
  const resetLink = `${baseURL}/new-password?token=${token}`

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  }

  await transporter.sendMail(mailOptions)
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}.</p>`
  }

  await transporter.sendMail(mailOptions)
}