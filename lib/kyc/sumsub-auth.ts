import crypto from "node:crypto";

export function sumsubConfigured() {
  return Boolean(process.env.SUMSUB_APP_TOKEN && process.env.SUMSUB_SECRET_KEY && process.env.SUMSUB_LEVEL_NAME);
}

export function signSumsubRequest(timestamp: string, method: string, path: string, body: string) {
  const secret = process.env.SUMSUB_SECRET_KEY;
  if (!secret) throw new Error("Sumsub Sandbox is not configured");
  return crypto.createHmac("sha256", secret).update(timestamp + method.toUpperCase() + path + body).digest("hex");
}

export function verifySumsubWebhook(rawBody: string, signature: string | null) {
  const secret = process.env.SUMSUB_SECRET_KEY;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest();
  const provided = Buffer.from(signature, /^[a-f0-9]+$/i.test(signature) ? "hex" : "base64");
  return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
}

export async function sumsubRequest<T>(path: string, method: "GET" | "POST", body = ""): Promise<T> {
  const baseUrl = process.env.SUMSUB_BASE_URL || "https://api.sumsub.com";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-App-Token": process.env.SUMSUB_APP_TOKEN || "",
      "X-App-Access-Ts": timestamp,
      "X-App-Access-Sig": signSumsubRequest(timestamp, method, path, body)
    },
    body: method === "POST" ? body : undefined,
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Sumsub request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}
