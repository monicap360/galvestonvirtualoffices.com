// Transactional email via Resend (https://resend.com). Set RESEND_API_KEY (and optional
// EMAIL_FROM) in the environment. If no key is set, sending is skipped gracefully.

const SITE_URL = "https://galvestonvirtualoffices.com";
const MAILING = "Galveston Virtual Offices, 3501 Winnie St, Galveston, TX 77550";
const FORM_1583_URL = "https://about.usps.com/forms/ps1583.pdf";

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // not configured yet — skip silently
  const from = process.env.EMAIL_FROM || "Galveston Virtual Offices <hello@galvestonvirtualoffices.com>";
  const first = (name || "there").split(" ")[0];

  const html = `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060814;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0b1120;border:1px solid #2a2540;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px;">
          <div style="font-size:22px;font-weight:800;color:#ffffff;">Galveston Virtual Offices</div>
          <div style="font-size:12px;color:#a78bfa;letter-spacing:1px;text-transform:uppercase;margin-top:4px;">Virtual Offices · Mailboxes · AI Support</div>
          <h1 style="color:#ffffff;font-size:24px;margin:24px 0 8px;">Welcome, ${first}! 🎉</h1>
          <p style="color:#cbd5e1;font-size:15px;line-height:1.6;">Your account is ready. Here's how to finish setting up your Galveston business presence.</p>

          <h2 style="color:#ffffff;font-size:17px;margin:24px 0 8px;">Your next steps</h2>
          <ol style="color:#cbd5e1;font-size:14px;line-height:1.7;padding-left:18px;margin:0;">
            <li><strong>Complete USPS Form 1583</strong> — required so we can legally receive mail and packages on your behalf. <a href="${FORM_1583_URL}" style="color:#c4b5fd;">Download &amp; print Form 1583</a>.</li>
            <li><strong>Get it notarized</strong> (in person, or via an online notary) and bring two forms of ID.</li>
            <li><strong>Mail the notarized form + your business check</strong> to: <span style="color:#fff;">${MAILING}</span></li>
          </ol>

          <p style="text-align:center;margin:28px 0;">
            <a href="${SITE_URL}/dashboard/start" style="background:linear-gradient(90deg,#6366f1,#a855f7,#d946ef);color:#ffffff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:12px;display:inline-block;">Open your setup packet (printable)</a>
          </p>

          <p style="color:#94a3b8;font-size:13px;line-height:1.6;">Tip: open the setup packet above and click <strong>Print</strong> — it includes your address, mailbox details, and a checklist to mail with your form and check.</p>
          <p style="color:#94a3b8;font-size:13px;line-height:1.6;">Questions? Call us at <strong>(409) 402-7908</strong> — a real local team, 6+ years on the Gulf Coast.</p>
          <p style="color:#64748b;font-size:12px;margin-top:24px;">${MAILING}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: "Welcome to Galveston Virtual Offices 🎉", html }),
    });
  } catch {
    // don't block signup on email failure
  }
}
