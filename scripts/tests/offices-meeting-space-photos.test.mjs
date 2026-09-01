import fs from "node:fs";
import assert from "node:assert/strict";

const page = fs.readFileSync("src/app/offices/page.tsx", "utf8");
const photoPaths = [
  "public/images/meeting-space/IMG_3201.jpeg",
  "public/images/meeting-space/IMG_3202.jpeg",
];

assert.ok(
  page.includes("/images/meeting-space/IMG_3201.jpeg"),
  "first emailed meeting-space photo must be shown",
);
assert.ok(
  page.includes("/images/meeting-space/IMG_3202.jpeg"),
  "second emailed meeting-space photo must be shown",
);
assert.ok(
  page.includes("Meeting &amp; Collaboration Space"),
  "meeting-space gallery needs a clear heading",
);

for (const photoPath of photoPaths) {
  const photo = fs.readFileSync(photoPath);

  assert.deepEqual(
    [...photo.subarray(0, 3)],
    [0xff, 0xd8, 0xff],
    `${photoPath} must contain JPEG bytes instead of a corrupted binary payload`,
  );
  assert.deepEqual(
    [...photo.subarray(-2)],
    [0xff, 0xd9],
    `${photoPath} must contain a complete JPEG image`,
  );
}

console.log("offices-meeting-space-photos: ok");
