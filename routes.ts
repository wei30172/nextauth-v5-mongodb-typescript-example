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
  defaultLoginRedirect: "/settings",
  defaultLogoutRedirect: "/signin"
}