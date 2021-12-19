import { createCookie } from "remix";

export const themeCookie = createCookie("theme", {
  maxAge: 2^31
});
