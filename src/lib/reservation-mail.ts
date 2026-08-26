import "server-only";
import * as tls from "node:tls";

const GMAIL_USER = process.env.GMAIL_USER || "cruisesfromgalveston.texas@gmail.com";
const NOTIFY_EMAIL = process.env.RESERVATION_NOTIFY_EMAIL || "cruisesfromgalveston.texas@gmail.com";

type ReservationNotification = {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  officeName: string;
  startDate: string;
  endDate: string;
  totalCents: number;
};

type SmtpReply = { code: number; text: string };

function clean(value: string | null | undefined) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

function dollars(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function readReply(socket: tls.TLSSocket): Promise<SmtpReply> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const last = lines.at(-1);
      if (!last || !/^\d{3} /.test(last)) return;
      cleanup();
      resolve({ code: Number(last.slice(0, 3)), text: lines.join("\n") });
    };
    const onError = (error: Error) => { cleanup(); reject(error); };
    const onTimeout = () => { cleanup(); reject(new Error("SMTP timeout")); };
    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("timeout", onTimeout);
    };
    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("timeout", onTimeout);
  });
}

async function command(socket: tls.TLSSocket, value: string, expected: number | number[]) {
  const expectedCodes = Array.isArray(expected) ? expected : [expected];
  socket.write(`${value}\r\n`);
  const reply = await readReply(socket);
  if (!expectedCodes.includes(reply.code)) throw new Error(`SMTP ${reply.code}: ${reply.text}`);
  return reply;
}

async function sendViaGmail(subject: string, body: string) {
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!appPassword) {
    console.error("Reservation notification not sent: GMAIL_APP_PASSWORD is not configured");
    return false;
  }

  const socket = tls.connect({ host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com" });
  socket.setTimeout(12_000);

  try {
    const greeting = await readReply(socket);
    if (greeting.code !== 220) throw new Error(`SMTP ${greeting.code}: ${greeting.text}`);
    await command(socket, "EHLO galvestonvirtualoffices.com", 250);
    await command(socket, "AUTH LOGIN", 334);
    await command(socket, Buffer.from(GMAIL_USER).toString("base64"), 334);
    await command(socket, Buffer.from(appPassword).toString("base64"), 235);
    await command(socket, `MAIL FROM:<${GMAIL_USER}>`, 250);
    await command(socket, `RCPT TO:<${NOTIFY_EMAIL}>`, [250, 251]);
    await command(socket, "DATA", 354);

    const message = [
      `From: Galveston Virtual Offices <${GMAIL_USER}>`,
      `To: ${NOTIFY_EMAIL}`,
      `Subject: ${clean(subject)}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      body.replace(/^\./gm, ".."),
      "",
      ".",
    ].join("\r\n");
    socket.write(`${message}\r\n`);
    const accepted = await readReply(socket);
    if (accepted.code !== 250) throw new Error(`SMTP ${accepted.code}: ${accepted.text}`);
    socket.write("QUIT\r\n");
    return true;
  } catch (error) {
    console.error("Reservation notification email failed", error);
    return false;
  } finally {
    socket.end();
  }
}

export async function sendReservationNotification(input: ReservationNotification) {
  const subject = `NEW GVO RESERVATION — ${clean(input.customerName)} — ${clean(input.officeName)}`;
  const body = [
    "A new Galveston Virtual Offices reservation was submitted.",
    "",
    `Customer: ${clean(input.customerName)}`,
    `Email: ${clean(input.customerEmail)}`,
    `Phone: ${clean(input.customerPhone) || "Not provided"}`,
    `Space: ${clean(input.officeName)}`,
    `Dates: ${clean(input.startDate)} through ${clean(input.endDate)}`,
    `Amount: ${dollars(input.totalCents)}`,
    `Booking ID: ${clean(input.bookingId)}`,
    "",
    "Please review and respond to this reservation promptly.",
  ].join("\n");

  return sendViaGmail(subject, body);
}
