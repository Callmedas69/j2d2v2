import { assertEquals } from "jsr:@std/assert";
import { translate } from "../src/index.ts";

Deno.test("English => Dolphin", () => {
  const input = "hello world";
  const expected = "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧";
  assertEquals(translate(input), expected);
});

Deno.test("English with domain => Dolphin", () => {
  const input = "hello dolphin.cool world";
  const expected = "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ dolphin.cool ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧";
  assertEquals(translate(input), expected);
});

Deno.test("English with Emoji => Dolphin", () => {
  const input = "hello 👋👋 world 🌎 🌎 🌎 world";
  const expected =
    "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ 👋👋 ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧ 🌎 🌎 🌎 ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧";
  assertEquals(translate(input), expected);
});

Deno.test("English with URL => Dolphin", () => {
  const input = "check out this link https://example.com its great";
  const expected =
    "◨◨ ◪◪ ◪◨ ◨◨ ◧◩ ▢◧ ◪▢ ◨▢ ◨▢ ◪◪ ◩◧ ◧▢ ◨◩ ◩◧ ▢▢ ◧◩ https://example.com ◩◧ ◨▢ ◧▢ ◨◪ ▢◩ ◪◨ ◧◧ ◨▢";
  assertEquals(translate(input), expected);
});

Deno.test("English with custom filter => Dolphin", () => {
  const input = "what the bobba";
  const expected = "◧◨▢ ◪◪ ◧◧ ◨▢ ◨▢ ◪◪ ◪◨ ◧◨ ▢◧ ◧◨ ◧◨ ◧◧";
  assertEquals(
    translate(input, {
      customFilter: { pattern: /heck/g, replacement: "bobba" },
    }),
    expected,
  );
});

Deno.test("English with censored word => Dolphin", () => {
  const input = "lets fucking go";
  const expected = `◨◩ ◪◨ ◨▢ ◧▢ ◧◪ ◨◨ ◧◩ ◨◪ ▢◧`;
  assertEquals(translate(input, { swearFilter: true }), expected);
});

Deno.test("English with uncensored word => Dolphin", () => {
  const input = "lets fucking go";
  const expected = `◨◩ ◪◨ ◨▢ ◧▢ ◧◪ ◪▢ ◨◨ ◧◩ ◩◧ ▢▢ ◨◪ ◨◪ ▢◧`;
  assertEquals(translate(input), expected);
});

Deno.test("English with line breaks => Dolphin", () => {
  const input = "hello\n\nworld\nmultiline";
  const expected =
    "◪◪ ◪◨ ◨◩ ◨◩ ▢◧\n\n◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧\n◩◩ ◪▢ ◨◩ ◨▢ ◩◧ ◨◩ ◩◧ ▢▢ ◪◨";
  assertEquals(translate(input), expected);
});

Deno.test("English with multiline => Dolphin", () => {
  const input = `hello

world
multiline`;
  const expected = `◪◪ ◪◨ ◨◩ ◨◩ ▢◧

◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧
◩◩ ◪▢ ◨◩ ◨▢ ◩◧ ◨◩ ◩◧ ▢▢ ◪◨`;
  assertEquals(translate(input), expected);
});

Deno.test("English with username => Dolphin", () => {
  const input = "follow me @anondolphin on finspace";
  const expected =
    "◧◪ ▢◧ ◨◩ ◨◩ ▢◧ ◧◨▢ ◩◩ ◪◨ @anondolphin ▢◧ ▢▢ ◧◪ ◩◧ ▢▢ ◧▢ ▢◨ ◧◧ ◨◨ ◪◨";
  assertEquals(translate(input), expected);
});

Deno.test("English with complex sentence => Dolphin", () => {
  const input =
    "follow-me @anondolphin on-finspace-and-check-out dolphin.cool 🐬🐬🐬 🐬🐬 🐬 https://dolphin.cool/some/long/url/to/nowhere.html";
  const expected =
    "◧◪ ▢◧ ◨◩ ◨◩ ▢◧ ◧◨▢ ⧉⧉ ◩◩ ◪◨ @anondolphin ▢◧ ▢▢ ⧉⧉ ◧◪ ◩◧ ▢▢ ◧▢ ▢◨ ◧◧ ◨◨ ◪◨ ⧉⧉ ◧◧ ▢▢ ◪◧ ⧉⧉ ◨◨ ◪◪ ◪◨ ◨◨ ◧◩ ⧉⧉ ▢◧ ◪▢ ◨▢ dolphin.cool 🐬🐬🐬 🐬🐬 🐬 https://dolphin.cool/some/long/url/to/nowhere.html";
  assertEquals(translate(input), expected);
});

Deno.test("English with channel => Dolphin", () => {
  const input = "lets talk on /dolphin-zone later today";
  const expected =
    "◨◩ ◪◨ ◨▢ ◧▢ ◨▢ ◧◧ ◨◩ ◧◩ ▢◧ ▢▢ /dolphin-zone ◨◩ ◧◧ ◨▢ ◪◨ ▢◩ ◨▢ ▢◧ ◪◧ ◧◧ ▢◧◨";
  assertEquals(translate(input), expected);
});
