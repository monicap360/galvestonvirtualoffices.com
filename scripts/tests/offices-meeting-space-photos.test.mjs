import fs from "node:fs";
import assert from "node:assert/strict";

const page = fs.readFileSync("src/app/offices/page.tsx", "utf8");

assert.ok(
  page.includes("/images/meeting-space/IMG_3201.jpeg"),
  "first emailed meeting-space photo must be shown",
);
assert.ok(
  page.includes("/images/meeting-space/IMG_3202.jpeg"),
  "second emailed meeting-space photo must be shown",
);
assert.ok(
  page.includes("Meeting & Collaboration Space"),
  "meeting-space gallery needs a clear heading",
);

console.log("offices-meeting-space-photos: ok");
