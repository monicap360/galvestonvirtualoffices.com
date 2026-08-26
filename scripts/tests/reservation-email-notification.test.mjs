import fs from "node:fs";
import assert from "node:assert/strict";

const actions = fs.readFileSync("src/app/orders/actions.ts", "utf8");
const mail = fs.readFileSync("src/lib/reservation-mail.ts", "utf8");
const render = fs.readFileSync("render.yaml", "utf8");

assert.ok(actions.includes("sendReservationNotification"), "office booking must invoke reservation notification");
assert.ok(actions.includes("bookingId: booking.id"), "notification must be tied to the saved booking row");
assert.ok(mail.includes("cruisesfromgalveston.texas@gmail.com"), "notification target must be Cruises From Galveston Gmail");
assert.ok(mail.includes("smtp.gmail.com"), "notification transport must use Gmail SMTP");
assert.ok(mail.includes("GMAIL_APP_PASSWORD"), "Gmail app password must come from environment, never source");
assert.ok(mail.includes("customerName") && mail.includes("customerEmail") && mail.includes("customerPhone"), "notification must include customer contact details");
assert.ok(mail.includes("officeName") && mail.includes("startDate") && mail.includes("endDate") && mail.includes("totalCents"), "notification must include booking details");
assert.ok(render.includes("GMAIL_APP_PASSWORD") && render.includes("sync: false"), "Render must declare the private Gmail app-password secret");

console.log("reservation-email-notification: ok");
