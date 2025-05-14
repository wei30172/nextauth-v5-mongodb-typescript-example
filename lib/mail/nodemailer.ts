import { getTranslations } from "next-intl/server"
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
  const tEmail = await getTranslations("Email.verification")
  const confirmLink = `${baseURL}/new-verification?token=${token}`

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: tEmail("subject"),
    // html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #64748b; text-align: center;">${tEmail("title")}</h1>
          <p style="color: #475569; font-size: 18px; text-align: center;">${tEmail("description")}</p>
          <table style="margin: 20px auto;">
            <tr>
              <td style="background-color: #64748b; padding: 10px 20px; border-radius: 5px; text-align: center;">
                <a href="${confirmLink}" style="font-size: 18px; color: white; text-decoration: none; display: inline-block;">${tEmail("button")}</a>
              </td>
            </tr>
          </table>
          <p style="color: #475569; text-align: center; margin-top: 20px;">${tEmail("ignoreNote")}</p>
        </div>
      </body>
    `
  }
  
  await transporter.sendMail(mailOptions)
}

export const sendPasswordResetEmail = async (
  email: string, 
  token: string
) => {
  const tEmail = await getTranslations("Email.reset")
  const resetLink = `${baseURL}/new-password?token=${token}`

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: tEmail("subject"),
    // html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #64748b; text-align: center;">${tEmail("title")}</h1>
          <p style="color: #475569; font-size: 18px; text-align: center;">${tEmail("description")}</p>
          <table style="margin: 20px auto;">
            <tr>
              <td style="background-color: #64748b; padding: 10px 20px; border-radius: 5px; text-align: center;">
                <a href="${resetLink}" style="font-size: 18px; color: white; text-decoration: none; display: inline-block;">${tEmail("button")}</a>
              </td>
            </tr>
          </table>
          <p style="color: #475569; text-align: center; margin-top: 20px;">${tEmail("ignoreNote")}</p>
        </div>
      </body>
    `
  }

  await transporter.sendMail(mailOptions)
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  const tEmail = await getTranslations("Email.2fa")

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: tEmail("subject"),
    // html: `<p>Your 2FA code: ${token}</p>`
    html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #64748b; text-align: center;">${tEmail("title")}</h1>
          <p style="color: #475569; font-size: 18px; text-align: center;">${tEmail("description")}</p>
          <table style="margin: 20px auto;">
            <tr>
              <td style="background-color: #64748b; padding: 10px 20px; border-radius: 5px; text-align: center;">
                <span style="font-size: 24px; color: white; background-color: #64748b; padding: 10px 20px; border-radius: 5px; text-align: center;">
                  ${token}
                </span>
              </td>
            </tr>
          </table>
          <p style="color: #475569; text-align: center; margin-top: 20px;">${tEmail("loginNote")}</p>
          <p style="color: #64748b; text-align: center; font-size: 14px; margin-top: 10px;">
            ${tEmail("securityNote")}
          </p>
        </div>
      </body>
    `
  }

  await transporter.sendMail(mailOptions)
}