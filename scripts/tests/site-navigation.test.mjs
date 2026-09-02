import assert from "node:assert/strict";
import fs from "node:fs";

const navigationModule = new URL("../../src/lib/site-navigation.ts", import.meta.url);

assert.ok(
  fs.existsSync(navigationModule),
  "the public header must use a compact navigation model shared by desktop and mobile menus",
);

const { publicNavigation, getMobileNavigation, getSiteHeaderClassName } = await import(navigationModule);

assert.equal(
  typeof getSiteHeaderClassName,
  "function",
  "the public header must expose its scroll behavior for regression coverage",
);

const siteHeaderClassName = getSiteHeaderClassName();

assert.doesNotMatch(
  siteHeaderClassName,
  /(?:^|\s)(?:sticky|fixed)(?:\s|$)/,
  "the public header must remain in normal document flow instead of covering scrolled content",
);

assert.deepEqual(
  publicNavigation.primary.map(({ label }) => label),
  ["Why Us", "Pricing", "Contact"],
  "the desktop header must keep only three direct page links beside the Services menu",
);

assert.deepEqual(
  publicNavigation.services.map(({ label }) => label),
  ["AI Assistant", "AI Studio", "Mailboxes", "Offices", "AI Marketing", "Platforms"],
  "service destinations must stay grouped instead of crowding the desktop header",
);

assert.deepEqual(
  getMobileNavigation().map(({ href }) => href),
  [
    "/ai-assistant",
    "/ai-studio",
    "/mailboxes",
    "/offices",
    "/services/marketing",
    "/services/platforms",
    "/why-us",
    "/pricing",
    "/contact",
  ],
  "the mobile menu must preserve every public destination in one predictable order",
);

console.log("site-navigation: ok");
