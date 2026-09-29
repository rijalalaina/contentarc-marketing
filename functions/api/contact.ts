// Cloudflare Pages Function: POST /api/contact → email via Brevo (+ optional newsletter opt-in).
// Configure in Pages → Settings → Variables and secrets (or .dev.vars locally):
//   BREVO_API_KEY (secret, required)
//   CONTACT_TO_EMAIL      where messages go        (default support@contentarc.app)
//   BREVO_SENDER_EMAIL    verified Brevo sender    (default noreply@contentarc.app)
//   BREVO_LIST_ID         list for newsletter opt-ins (optional)
//   TURNSTILE_SECRET_KEY  enables Turnstile verification (optional, recommended)

interface Env {
  BREVO_API_KEY: string;
  CONTACT_TO_EMAIL?: string;
  BREVO_SENDER_EMAIL?: string;
  BREVO_LIST_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface Payload {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  company?: string; // honeypot
  newsletter?: boolean;
  elapsed?: number;
  locale?: string;
  "cf-turnstile-response"?: string;
}

// Topic keys from the form → English labels for the email subject.
const TOPICS: Record<string, string> = {
  general: "General question",
  sales: "Sales & plans",
  support: "Support",
  billing: "Billing",
  partnership: "Partnership",
  press: "Press",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function brevo(env: Env, path: string, body: unknown) {
  return fetch(`https://api.brevo.com/v3${path}`, {
    method: "POST",
    headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Same-origin browser submissions only.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ code: "origin" }, 403);
  }
  if (!env.BREVO_API_KEY) return json({ code: "not_configured" }, 503);

  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return json({ code: "generic" }, 400);
  }

  // Bots: pretend success so they don't retry.
  if (data.company || (typeof data.elapsed === "number" && data.elapsed < 2500)) return json({ ok: true });

  const name = (data.name ?? "").trim().slice(0, 120);
  const email = (data.email ?? "").trim().toLowerCase().slice(0, 254);
  const message = (data.message ?? "").trim().slice(0, 5000);
  const topic = TOPICS[data.topic ?? ""] ?? TOPICS.general;
  const locale = /^[a-z]{2}$/.test(data.locale ?? "") ? data.locale! : "en";
  if (!name) return json({ code: "name" }, 400);
  if (!EMAIL_RE.test(email)) return json({ code: "email" }, 400);
  if (message.length < 10) return json({ code: "message" }, 400);

  if (env.TURNSTILE_SECRET_KEY) {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET_KEY);
    form.append("response", data["cf-turnstile-response"] ?? "");
    const ip = request.headers.get("cf-connecting-ip");
    if (ip) form.append("remoteip", ip);
    const verify = (await (
      await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form })
    ).json()) as { success: boolean };
    if (!verify.success) return json({ code: "verification" }, 400);
  }

  const to = env.CONTACT_TO_EMAIL || "support@contentarc.app";
  const sender = env.BREVO_SENDER_EMAIL || "noreply@contentarc.app";
  const safe = { name: escapeHtml(name), email: escapeHtml(email), topic: escapeHtml(topic), message: escapeHtml(message) };

  const res = await brevo(env, "/smtp/email", {
    sender: { name: "ContentArc website", email: sender },
    to: [{ email: to }],
    replyTo: { email, name },
    subject: `[ContentArc] ${topic}: ${name}`,
    textContent: `From: ${name} <${email}>\nTopic: ${topic}\nLanguage: ${locale}\nNewsletter opt-in: ${data.newsletter ? "yes" : "no"}\n\n${message}`,
    htmlContent: `<p><strong>From:</strong> ${safe.name} &lt;${safe.email}&gt;<br><strong>Topic:</strong> ${safe.topic}<br><strong>Language:</strong> ${locale}<br><strong>Newsletter opt-in:</strong> ${data.newsletter ? "yes" : "no"}</p><p style="white-space:pre-wrap">${safe.message}</p><p style="color:#888;font-size:12px">Reply to this email to answer ${safe.name} directly.</p>`,
    tags: ["contact-form"],
  });
  if (!res.ok) {
    console.error("Brevo send failed", res.status, await res.text().catch(() => ""));
    return json({ code: "send_failed" }, 502);
  }

  // Newsletter opt-in (explicit checkbox) → Brevo list. Failure here shouldn't fail the message.
  const listId = Number(env.BREVO_LIST_ID?.replace(/^#/, ""));
  if (data.newsletter && Number.isInteger(listId) && listId > 0) {
    const contact = await brevo(env, "/contacts", {
      email,
      attributes: { FIRSTNAME: name.split(/\s+/)[0], LANGUAGE: locale },
      listIds: [listId],
      updateEnabled: true,
    });
    if (!contact.ok) console.error("Brevo contact upsert failed", contact.status);
  }

  return json({ ok: true });
};

export const onRequest: PagesFunction<Env> = async () => json({ code: "method_not_allowed" }, 405);
