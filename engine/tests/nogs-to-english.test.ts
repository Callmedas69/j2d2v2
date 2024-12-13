import { assertEquals } from "jsr:@std/assert";
import { translate } from "../src/index.ts";

Deno.test("Nogs => English", () => {
  const input = "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧";
  const expected = "helloworld";
  assertEquals(translate(input), expected);
});

Deno.test("Nogs with domain => English", () => {
  const input = "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ dolphin.cool ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧";
  const expected = "hello dolphin.cool world";
  assertEquals(translate(input), expected);
});

Deno.test("Nogs with Emoji => English", () => {
  const input =
    "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ 👋👋 ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧ 🌎 🌎 🌎 ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧";
  const expected = "hello 👋👋 world 🌎 🌎 🌎 world";
  assertEquals(translate(input), expected);
});

Deno.test("Nogs with URL => English", () => {
  const input =
    "◨◨ ◪◪ ◪◨ ◨◨ ◧◩ ▢◧ ◪▢ ◨▢ ◨▢ ◪◪ ◩◧ ◧▢ ◨◩ ◩◧ ▢▢ ◧◩ https://example.com ◩◧ ◨▢ ◧▢ ◨◪ ▢◩ ◪◨ ◧◧ ◨▢";
  const expected = "checkoutthislink https://example.com itsgreat";
  assertEquals(translate(input), expected);
});

Deno.test("Nogs with custom filter => English", () => {
  const input = "◧◨▢ ◪◪ ◧◧ ◨▢ ◨▢ ◪◪ ◪◨ ◧◨ ▢◧ ◧◨ ◧◨ ◧◧";
  const expected = "whatthebobba";
  assertEquals(
    translate(input, {
      customFilter: { pattern: /heck/g, replacement: "bobba" },
    }),
    expected,
  );
});

Deno.test("Nogs with censored word => English", () => {
  const input = "◨◩ ◪◨ ◨▢ ◧▢ ◧◪ ◨◩ ◩◧ ▢◨ ▢◨ ◩◧ ▢▢ ◨◪ ◨◪ ▢◧";
  const expected = "letsflippinggo";
  assertEquals(translate(input, { swearFilter: true }), expected);
});

Deno.test("Nogs with uncensored word => English", () => {
  const input = "◨◩ ◪◨ ◨▢ ◧▢ ◧◪ ◪▢ ◨◨ ◧◩ ◩◧ ▢▢ ◨◪ ◨◪ ▢◧";
  const expected = "letsfuckinggo";
  assertEquals(translate(input), expected);
});

Deno.test("Nogs with line breaks => English", () => {
  const input =
    "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ \n\n ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧ \n ◩◩ ◪▢ ◨◩ ◨▢ ◩◧ ◨◩ ◩◧ ▢▢ ◪◨";
  const expected = "hello\n\nworld\nmultiline";
  assertEquals(translate(input), expected);
});

Deno.test("Nogs with multiline => English", () => {
  const input = `◪◪ ◪◨ ◨◩ ◨◩ ▢◧

◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧
◩◩ ◪▢ ◨◩ ◨▢ ◩◧ ◨◩ ◩◧ ▢▢ ◪◨`;
  const expected = `hello

world
multiline`;
  assertEquals(translate(input), expected);
});

Deno.test("Nogs with username => English", () => {
  const input =
    "◧◪ ▢◧ ◨◩ ◨◩ ▢◧ ◧◨▢ ◩◩ ◪◨ @anondolphin ▢◧ ▢▢ ◧◪ ◩◧ ▢▢ ◧▢ ▢◨ ◧◧ ◨◨ ◪◨";
  const expected = "followme @anondolphin onfinspace";
  assertEquals(translate(input), expected);
});

Deno.test("Nogs with complex sentence => English", () => {
  const input =
    "◧◪ ▢◧ ◨◩ ◨◩ ▢◧ ◧◨▢ ⧉⧉ ◩◩ ◪◨ @anondolphin ▢◧ ▢▢ ⧉⧉ ◧◪ ◩◧ ▢▢ ◧▢ ▢◨ ◧◧ ◨◨ ◪◨ ⧉⧉ ◧◧ ▢▢ ◪◧ ⧉⧉ ◨◨ ◪◪ ◪◨ ◨◨ ◧◩ ⧉⧉ ▢◧ ◪▢ ◨▢ dolphin.cool 🐬🐬🐬 🐬🐬 🐬 https://dolphin.cool/some/long/url/to/nowhere.html";
  const expected =
    "follow-me @anondolphin on-finspace-and-check-out dolphin.cool 🐬🐬🐬 🐬🐬 🐬 https://dolphin.cool/some/long/url/to/nowhere.html";
  assertEquals(translate(input), expected);
});

Deno.test("Nogs with channel => English", () => {
  const input =
    "◨◩ ◪◨ ◨▢ ◧▢ ◨▢ ◧◧ ◨◩ ◧◩ ▢◧ ▢▢ /dolphin-zone ◨◩ ◧◧ ◨▢ ◪◨ ▢◩ ◨▢ ▢◧ ◪◧ ◧◧ ▢◧◨";
  const expected = "letstalkon /dolphin-zone latertoday";
  assertEquals(translate(input), expected);
});
