export const prerender = false;

// Basic SSRF guard: block obviously internal/private hosts, since this is a
// public-facing proxy endpoint that could otherwise be used to probe internal
// network addresses through the Worker.
function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "::1") return true;
  if (/^10\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  return false;
}

const ALLOWED_USER_AGENTS: Record<string, string> = {
  default: "PixelquilBot/1.0 (+https://pixelquil.com)",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  googlebot_mobile: "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  gptbot: "Mozilla/5.0 (compatible; GPTBot/1.1; +https://openai.com/gptbot)",
  claudebot: "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  chrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");
  const uaKey = url.searchParams.get("ua") ?? "default";
  const userAgent = ALLOWED_USER_AGENTS[uaKey] ?? ALLOWED_USER_AGENTS.default;
  const method = url.searchParams.get("method") === "HEAD" ? "HEAD" : "GET";

  const corsHeaders = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

  if (!target) {
    return new Response(JSON.stringify({ error: "Missing 'url' parameter" }), { status: 400, headers: corsHeaders });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400, headers: corsHeaders });
  }

  if (targetUrl.protocol !== "https:" && targetUrl.protocol !== "http:") {
    return new Response(JSON.stringify({ error: "Only http/https URLs are allowed" }), { status: 400, headers: corsHeaders });
  }

  if (isPrivateHost(targetUrl.hostname)) {
    return new Response(JSON.stringify({ error: "This host is not allowed" }), { status: 400, headers: corsHeaders });
  }

  try {
    // redirect: "manual" so callers (like a future redirect-chain tool) can see
    // each hop individually. Callers that just want final content, like the
    // robots.txt tester, follow redirects themselves by re-calling this proxy.
    const upstream = await fetch(targetUrl.toString(), {
      method,
      headers: { "User-Agent": userAgent },
      redirect: "manual",
    });

    // HEAD responses have no body to read; avoid calling .text() on them.
    const bodyText = method === "HEAD" ? "" : await upstream.text();
    const headersObj: Record<string, string> = {};
    upstream.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    return new Response(
      JSON.stringify({
        status: upstream.status,
        statusText: upstream.statusText,
        headers: headersObj,
        body: bodyText,
        finalUrl: upstream.url,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Could not fetch the target URL" }), { status: 502, headers: corsHeaders });
  }
}