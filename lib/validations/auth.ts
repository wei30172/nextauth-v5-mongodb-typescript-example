import * as z from "zod"
import { UserRole } from "@/lib/database/models/types"

export function getSignInFormSchema(t?: (key: string) => string) {
  return z
    .object({
      email: z
        .string()
        .min(1, t?.("email.required") || "Email is required")
        .email(t?.("email.invalid") || "Invalid email"),
      password: z
        .string()
        .min(1, t?.("password.required") || "Password is required")
        .min(8, t?.("password.invalid") || "Password must be 8+ characters"),
        code: z.optional(z.string())
    })
}
export type SignInFormValues = z.infer<ReturnType<typeof getSignInFormSchema>>

export function getSignUpFormSchema(t?: (key: string) => string) {
  return z
    .object({
      name: z
        .string()
        .min(1, t?.("name.required") || "Username is required")
        .max(50, t?.("name.invalid") || "Username must be less than 50 characters"),
      email: z
        .string()
        .min(1, t?.("email.required") || "Email is required")
        .email(t?.("email.invalid") || "Invalid email"),
      password: z
        .string()
        .min(1, t?.("password.required") || "Password is required")
        .min(8, t?.("password.invalid") || "Password must be 8+ characters"),
      confirmPassword: z
        .string()
        .min(1, t?.("confirmPassword.required") || "Password confirmation is required")
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t?.("confirmPassword.invalid") || "Password do not match"
    })
}
export type SignUpFormValues = z.infer<ReturnType<typeof getSignUpFormSchema>>

export function getResetPasswordFormSchema(t?: (key: string) => string) {
  return z
    .object({
      email: z
        .string()
        .min(1, t?.("email.required") || "Email is required")
        .email(t?.("email.invalid") || "Invalid email")
    })
}
export type ResetPasswordFormValues = z.infer<ReturnType<typeof getResetPasswordFormSchema>>

export function getNewPasswordFormSchema(t?: (key: string) => string) {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, t?.("newPassword.required") || "Password is required")
        .min(8, t?.("newPassword.invalid") || "Password must be 8+ characters"),
      confirmPassword: z
        .string()
        .min(1, t?.("confirmPassword.required") || "Password confirmation is required")
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t?.("confirmPassword.invalid") || "Passwords do not match"
    })
}
export type NewPasswordFormValues = z.infer<ReturnType<typeof getNewPasswordFormSchema>>

const validatePassword = (t?: (key: string) => string) =>
  z
    .string()
    .refine((val) => val === "" || val.length >= 8, {
      message: t?.("password.invalid") || "Password must be 8+ characters if provided"
    })

export function getSettingsFormSchema(t?: (key: string) => string) {
  return z
    .object({
      name: z.optional(z.string()),
      email: z.optional(
        z.string().email(t?.("email.invalid") || "Invalid email")
      ),
      password: z.optional(validatePassword(t)),
      newPassword: z.optional(validatePassword(t)),
      role: z.enum([UserRole.ADMIN, UserRole.USER]),
      isTwoFactorEnabled: z.optional(z.boolean())
    })
    .refine(
      (data) => !(data.newPassword && !data.password),
      {
        path: ["password"],
        message:
          t?.("password.required") ||
          "To change password, enter current one."
      }
    )
    .refine(
      (data) => !(data.password && !data.newPassword),
      {
        path: ["newPassword"],
        message:
          t?.("newPassword.required") ||
          "To change password, enter new password."
      }
    )
}
export type SettingsFormValues = z.infer<ReturnType<typeof getSettingsFormSchema>>