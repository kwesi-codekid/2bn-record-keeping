import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import styles from "~/tailwind.css";
import snow from "react-quill/dist/quill.snow.css";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: snow,
  },
];

import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { FlashSessionInterface, getFlashSession } from "./flash-session";
import { errorToast, successToast } from "./utils/toasters";
import { useEffect } from "react";
import connectToDatabase from "./mongoose";

export default function App() {
  const { flashSessionx } = useLoaderData<{
    flashSessionx: any;
  }>();
  useEffect(() => {
    if (flashSessionx && flashSessionx.status === "error") {
      errorToast(flashSessionx.title, flashSessionx.message);
    }
    if (flashSessionx && flashSessionx.status === "success") {
      successToast(flashSessionx.title, flashSessionx.message);
    }
  }, [flashSessionx]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>
          <Outlet />
        </Providers>
        <Toaster position="bottom-right" />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const flashSession = await getFlashSession(request.headers.get("Cookie"));
  const alert = flashSession || {};

  return { flashSessionx: alert.data.__flash_alert__ };
};
