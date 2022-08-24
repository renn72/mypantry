import { useState } from "react";
import { withTRPC } from "@trpc/next";
import { loggerLink } from '@trpc/client/links/loggerLink';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import superjson from "superjson";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import {
  ColorScheme,
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider,
} from "@mantine/core";

import type { AppPropsType, AppType } from "next/dist/shared/lib/utils";
import type { AppRouter } from "../server/router";

import "../styles/globals.css";
import Layout from "../components/Layout";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsType) => {
  const title = "T3 Blog";
  const description = "A full stack blog web app created with T3 Stack";
  const imageMetaURL = "/favicon.ico";

  const myCache = createEmotionCache({ key: "mantine", prepend: false });
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <SessionProvider session={session}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageMetaURL} />
        <meta name="twitter:image" content={imageMetaURL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#000000" />

        <link rel="icon" href={imageMetaURL} />
        <meta name="apple-mobile-web-app-title" content={title} />
        <meta name="application-name" content={title} />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme }}
          emotionCache={myCache}
        >
          <Layout
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </SessionProvider>
  );
};

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url,
      }),
    ];

    return {
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          };
        }
        return {};
      },
      links,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: { defaultOptions: { queries: { staleTime: 6000 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
