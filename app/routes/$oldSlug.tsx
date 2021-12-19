import { LoaderFunction, redirect } from "remix";

const oldArticles = [
  "my-audio-life",
  "takeaways-dot-security-2016",
  "1-is-enough",
  "pure-javascript-immutable-array",
  "jen-ai-marre-je-veux-devenir-chef-de-projet",
  "php-gettext-debian-local",
  "choose-height-facebook-app",
  "kdenlive-crashes-when-i-open-my-project",
  "wordpress-404-form-template-custom",
];

export const loader: LoaderFunction = async ({params}) => {
  if (typeof params.oldSlug === "string" && oldArticles.includes(params.oldSlug)) {
    return redirect(`/blog/${params.oldSlug}`, {status: 308});
  }
  return new Response(null, { status: 404});
};
