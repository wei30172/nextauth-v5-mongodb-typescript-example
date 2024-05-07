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
  apiAuthPrefix: "/api/auth",
  defaultLoginRedirect: "/settings",
  defaultLogoutRedirect: "/signin"
}