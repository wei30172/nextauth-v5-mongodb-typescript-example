import { NextResponse } from "next/server"

// api/test/email-preview
export async function GET(
  req: Request
) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name") || "World"
  const emailHtml = `
    <html>
      <body>
        <h1>Hello, ${name}!</h1>
        <p>This is a test email.</p>
      </body>
    </html>
  `

  // const confirmLink = "#"
  // const emailHtml = `
  //   <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
  //     <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  //       <h1 style="color: #64748b; text-align: center;">Email Confirmation</h1>
  //       <p style="color: #475569; font-size: 18px; text-align: center;">Please click the link below to confirm your email address:</p>
  //       <table style="margin: 20px auto;">
  //         <tr>
  //           <td style="background-color: #64748b; padding: 10px 20px; border-radius: 5px; text-align: center;">
  //             <a href="${confirmLink}" style="font-size: 18px; color: white; text-decoration: none; display: inline-block;">Click here to confirm email</a>
  //           </td>
  //         </tr>
  //       </table>
  //       <p style="color: #475569; text-align: center; margin-top: 20px;">If you did not request this email, please ignore it.</p>
  //     </div>
  //   </body>
  // `

  // const confirmLink = "#"
  // const emailHtml = `
  //   <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
  //     <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  //       <h1 style="color: #64748b; text-align: center;">Password Reset</h1>
  //       <p style="color: #475569; font-size: 18px; text-align: center;">Please click the link below to reset your password:</p>
  //       <table style="margin: 20px auto;">
  //         <tr>
  //           <td style="background-color: #64748b; padding: 10px 20px; border-radius: 5px; text-align: center;">
  //             <a href="${confirmLink}" style="font-size: 18px; color: white; text-decoration: none; display: inline-block;">Click here to reset password</a>
  //           </td>
  //         </tr>
  //       </table>
  //       <p style="color: #475569; text-align: center; margin-top: 20px;">If you did not request this email, please ignore it.</p>
  //     </div>
  //   </body>
  // `

  // const token = "123456"
  // const emailHtml = `
  //   <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
  //     <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  //       <h1 style="color: #64748b; text-align: center;">Two-Factor Authentication</h1>
  //       <p style="color: #475569; font-size: 18px; text-align: center;">Your 2FA code is:</p>
  //       <table style="margin: 20px auto;">
  //         <tr>
  //           <td style="background-color: #64748b; padding: 10px 20px; border-radius: 5px; text-align: center;">
  //             <span style="font-size: 24px; color: white; background-color: #64748b; padding: 10px 20px; border-radius: 5px; text-align: center;">
  //               ${token}
  //             </span>
  //           </td>
  //         </tr>
  //       </table>
  //       <p style="color: #475569; text-align: center; margin-top: 20px;">Please use this code to complete your login.</p>
  //       <p style="color: #64748b; text-align: center; font-size: 14px; margin-top: 10px;">
  //         For your security, never share this code with anyone.
  //       </p>
  //     </div>
  //   </body>
  // `

  return new NextResponse(emailHtml, {
    headers: {
      "Content-Type": "text/html"
    }
  })
}