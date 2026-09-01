import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const navigation = readFileSync(
  new URL("../src/components/site-nav.tsx", import.meta.url),
  "utf8",
);

test("mobile header uses a compact logo and keeps the business name visible", () => {
  assert.match(navigation, /h-9 w-9[^\n]*sm:h-11 sm:w-11/);
  assert.match(navigation, /GalvestonVirtual<br className="sm:hidden" \/>Offices\.com/);
});
