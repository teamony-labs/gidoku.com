import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

export default jsxRenderer(({ children }) => {
  const c = useRequestContext();
  const nonce = c.get("secureHeadersNonce");

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async nonce={nonce} />
      </head>
      <body>{children}</body>
    </html>
  );
});
