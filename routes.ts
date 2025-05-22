export const routes = {
  public: [
    "/",
    "/new-verification"
  ],
  auth: [
    "/signin",
    "/signup",
    "/reset",
    "/new-password",
    "/error"
  ],
  defaultSignInPage: "/signin",
  defaultErrorPage: "/error",
  defaultLoginRedirect: "/settings",
  defaultLogoutRedirect: "/signin"
}