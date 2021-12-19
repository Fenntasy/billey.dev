import {
  NavLink,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  Form,
  LoaderFunction,
  useLoaderData,
  ActionFunction,
  json,
  useActionData,
} from "remix";
import React from "react";
import type { LinksFunction } from "remix";
import appStyles from "~/styles/app.css";
import classNames from "classnames";
import { themeCookie } from "./cookies";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: appStyles }];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const theme = formData.get("theme") === "light" ? "light" : "dark";

  return json(
    { theme },
    {
      headers: {
        "Set-Cookie": await themeCookie.serialize(theme),
      },
    }
  );
};

type Theme = "light" | "dark";

type LoaderData = {
  theme: Theme;
};

export const loader: LoaderFunction = async ({ request }) => {
  const theme = await themeCookie.parse(request.headers.get("Cookie"));

  return { theme: theme === "light" ? "light" : "dark" };
};

export default function App() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<LoaderData>();
  const theme = actionData ? actionData.theme : loaderData.theme;

  return (
    <Document theme={theme}>
      <Layout theme={theme}>
        <Outlet />
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();
  console.log({ caught });

  let message;
  switch (caught.status) {
  case 401:
    message = (
      <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
      </p>
    );
    break;
  case 404:
    message = (
      <p>Oops! Looks like you tried to visit a page that does not exist.</p>
    );
    break;

  default:
    throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
  theme,
}: {
  children: React.ReactNode;
  title?: string;
  theme?: Theme;
}) {
  return (
    <html lang="en" className={theme === "light" ? "" : "dark"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="text-zinc-700 dark:bg-zinc-900 dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: Theme;
}) {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    classNames("transform transition-transform duration-300 hover:scale-105", {
      "text-indigo-600 dark:text-indigo-400 underline underline-offset-8 decoration-2":
        isActive,
    });

  return (
    <>
      <header className="mb-10">
        <nav className="grid grid-cols-3 justify-between py-10">
          <div className="text-2xl px-12">Vincent Billey</div>
          <div className="lg:w-[65ch] text-lg flex items-end gap-8">
            <NavLink className={navLinkClasses} to="/blog">
              Blog
            </NavLink>
            <NavLink className={navLinkClasses} to="/resume">
              Resume
            </NavLink>
          </div>
          <div className="px-12 text-right">
            <Form method="post">
              <input
                type="hidden"
                name="theme"
                value={theme === "light" ? "dark" : "light"}
              />
              <button
                type="submit"
                aria-label={`Toggle ${
                  theme === "light" ? "dark" : "light"
                } mode`}
                title={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
              </button>
            </Form>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}

const SunIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-brightness-2"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 6h3.5l2.5 -2.5l2.5 2.5h3.5v3.5l2.5 2.5l-2.5 2.5v3.5h-3.5l-2.5 2.5l-2.5 -2.5h-3.5v-3.5l-2.5 -2.5l2.5 -2.5z" />
  </svg>
);

const MoonIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-moon"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
  </svg>
);
