import { assertEquals } from "jsr:@std/assert";
import { isNogs } from "../src/index.ts";

Deno.test("English 100%", () => {
  const input = "hello world";
  assertEquals(isNogs(input), false);
});

Deno.test("English with domain", () => {
  const input = "hello dolphin.cool world";
  assertEquals(isNogs(input), false);
});

Deno.test("English with a lot of e's", () => {
  const input = `eager beekeepers determinedly preserve serene evergreen trees`;
  assertEquals(isNogs(input), false);
});

Deno.test("Dolphin 100%", () => {
  const input = "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧";
  assertEquals(isNogs(input), true);
});

Deno.test("Dolphin with domain", () => {
  const input = "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ dolphin.cool ◧◨▢ ▢◧ ▢◩ ◨◩ ◪◧";
  assertEquals(isNogs(input), true);
});

Deno.test("Dolphin with really long domain", () => {
  const input = "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ this-is-a-really-long-domain.com";
  assertEquals(isNogs(input), true);
});

Deno.test("Dolphin with emoji", () => {
  const input = "◪◪ ◪◨ ◨◩ ◨◩ ▢◧ 👋👋 👋 👋";
  assertEquals(isNogs(input), true);
});
