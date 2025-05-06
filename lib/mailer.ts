import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const baseURL = process.env.NEXT_PUBLIC_APP_URL

const emailURL = process.env.RESEND_EMAIL_URL
// todo: Only send emails to the "Resend" registered email if a domain is set and purchased.

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${baseURL}/new-verification?token=${token}`

  await resend.emails.send({
    from: `${emailURL}`, 
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  })
}

export const sendPasswordResetEmail = async (
  email: string, 
  token: string
) => {
  const resetLink = `${baseURL}/new-password?token=${token}`

  await resend.emails.send({
    from: `${emailURL}`,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  })
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: `${emailURL}`,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}.</p>`
  })
}