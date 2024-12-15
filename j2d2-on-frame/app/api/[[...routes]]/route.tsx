/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/next";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { translate, isNogs } from "../../../../engine/src/index";

// Initialize Frog application with base configuration
const app = new Frog({
  basePath: "/api",
  title: "J2D2 Translator",
});

// Define the main frame route and its behavior
app.frame("/", async (c) => {
  const { buttonValue, inputText, status } = c;
  const text = inputText || "";
  const isNogsText = isNogs(text);

  let translatedText = text;
  if (buttonValue === "translate" && text) {
    translatedText = await translate(text);
  }

  if (buttonValue === "cast" && translatedText) {
    const urlRegex =
      /(https?:\/\/[^\s]+)|((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])/gi;
    const matches = translatedText.match(urlRegex) || [];

    const embedUrls = matches.map((url) =>
      url.startsWith("http") ? url : `https://${url}`
    );

    let warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      translatedText
    )}&channelKey=basednouns`;

    warpcastUrl += embedUrls
      .map((url) => `&embeds[]=${encodeURIComponent(url)}`)
      .join("");

    return c.res({
      action: warpcastUrl,
      image: (
        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(to right, #7c65c1, #382f59)",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
            padding: "40px",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 32,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            Redirecting to Warpcast...
          </div>
        </div>
      ),
    });
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: status === "response" ? "#e5e3d9" : "#FFFFFF",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          padding: "40px",
        }}
      >
        {!status && (
          <>
            <img
              src="https://i.ibb.co/gP2qKRr/Untitled-design.png"
              alt="J2D2"
              style={{
                width: "120px",
                height: "120px",
                marginBottom: "40px",
              }}
            />
            <div
              style={{
                color: "#000000",
                fontSize: "24px",
                fontStyle: "normal",
                marginBottom: "40px",
              }}
            >
              What is the message ?
            </div>
          </>
        )}
        {status === "response" && (
          <div
            style={{
              color: "#000000",
              fontSize: isNogsText ? 48 : 32,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              padding: "0 40px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {translatedText}
          </div>
        )}
      </div>
    ),
    intents: [
      <TextInput placeholder="talk to me" />,
      <Button value="translate">Encode</Button>,
      status === "response" && <Button value="cast">Cast 🪄</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ].filter(Boolean),
  });
});

// Enable development tools for debugging
devtools(app, { serveStatic });

// Export handlers for HTTP GET and POST requests
export const GET = handle(app);
export const POST = handle(app);
