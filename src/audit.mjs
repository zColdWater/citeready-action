#!/usr/bin/env node
import fs from "node:fs";

const AI_BOTS = [
  "OAI-SearchBot", "ChatGPT-User", "GPTBot", "PerplexityBot", "ClaudeBot",
  "Claude-SearchBot", "Google-Extended", "Applebot-Extended", "Amazonbot", "DuckAssistBot"
];

async function safeGet(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "CiteReady-GitHub-Action/1.0 (+https://citeready-checker.appwrite.network)" }
    });
    const text = await res.text();
    clearTimeout(t);
    return { ok: res.ok, status: res.status, headers: res.headers, text };
  } catch {
    clearTimeout(t);
    return { ok: false, status: 0, headers: new Headers(), text: "" };
  }
}

function findBlockedBots(robotsTxt) {
  const blocked = [];
  if (!robotsTxt) return blocked;
  const lines = robotsTxt.split(/\r?\n/);
  let agents = [];
  for (const raw of lines) {
    const line = raw.split("#")[0].trim();
    if (!line) { agents = []; continue; }
    const [k, ...rest] = line.split(":");
    const key = k.trim().toLowerCase();
    const val = rest.join(":").trim();
    if (key === "user-agent") agents.push(val.toLowerCase());
    else if (key === "disallow" && val === "/") {
      for (const bot of AI_BOTS) {
        if (agents.includes(bot.toLowerCase())) blocked.push(bot);
      }
    }
  }
  return [...new Set(blocked)];
}

async function main() {
  const args = process.argv.slice(2);
  let rawUrl = "";
  let minScore = 65;
  let reqLlms = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--min-score") minScore = Number(args[++i] || 65);
    else if (args[i] === "--require-llms-txt") reqLlms = String(args[++i]) === "true";
    else if (!args[i].startsWith("-")) rawUrl = args[i];
  }

  if (!rawUrl) {
    console.error("Usage: node src/audit.mjs <https://yourproduct.com> [--min-score 65]");
    process.exit(2);
  }
  if (!/^https?:\/\//i.test(rawUrl)) rawUrl = "https://" + rawUrl;
  const u = new URL(rawUrl);

  const [page, robots, llms] = await Promise.all([
    safeGet(u.href),
    safeGet(new URL("/robots.txt", u.origin).href),
    safeGet(new URL("/llms.txt", u.origin).href)
  ]);

  if (!page.ok) {
    console.error("Failed to fetch target page:", u.href);
    process.exit(1);
  }

  let score = 0;
  const gaps = [];

  // 1. AI Crawlers (30 pts)
  const blocked = findBlockedBots(robots.text);
  const allowedRatio = (AI_BOTS.length - blocked.length) / AI_BOTS.length;
  score += Math.round(30 * allowedRatio);
  if (blocked.length > 0) gaps.push(`Blocked AI crawlers in robots.txt: ${blocked.join(", ")}`);

  // 2. /llms.txt (25 pts)
  const hasLlms = llms.ok && llms.text.trim().length > 40 && !/<html/i.test(llms.text);
  if (hasLlms) score += 25;
  else gaps.push("Missing /llms.txt Markdown index for AI answer engines");

  // 3. Schema.org JSON-LD (25 pts)
  const jsonLdBlocks = [...page.text.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (jsonLdBlocks.length > 0) score += 25;
  else gaps.push("No Schema.org JSON-LD structured entity graph found");

  // 4. Title, Meta Description & Canonical (20 pts)
  if (/<title>[^<]{8,}<\/title>/i.test(page.text)) score += 7;
  if (/name=["']description["']/i.test(page.text)) score += 7;
  if (/rel=["']canonical["']/i.test(page.text)) score += 6;

  score = Math.max(0, Math.min(100, score));
  const pkUrl = `https://citeready-checker.appwrite.network/?a=${encodeURIComponent(u.hostname)}&b=stripe.com&ref=gh-citeready-action`;

  console.log(`CiteReady GEO Score for ${u.href}: ${score}/100 | /llms.txt: ${hasLlms} | JSON-LD blocks: ${jsonLdBlocks.length} | Blocked AI bots: ${blocked.length}/10`);
  for (const g of gaps) console.log(`  - ${g}`);
  console.log(`Run Side-by-Side Competitor AI Search PK & Unlock Generated /llms.txt + JSON-LD ($2 Launch Special): ${pkUrl}`);

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `score=${score}\nhas_llms_txt=${hasLlms}\nblocked_bots=${blocked.length}\n`);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    const md = [
      `### CiteReady AI Search Visibility Gate: **${score}/100**`,
      `- **Target:** ${u.href} | **/llms.txt:** ${hasLlms ? "Present" : "Missing"} | **JSON-LD Blocks:** ${jsonLdBlocks.length} | **Allowed AI Crawlers:** ${10 - blocked.length}/10`,
      gaps.length ? ("\n**Visibility Gaps:**\n" + gaps.map((g) => `- ${g}`).join("\n")) : "\nAll AI citation checks passed.",
      `\nCompare head-to-head against a competitor & unlock generated /llms.txt + Schema.org code (**$2 Launch Special**, ~~$12~~): [Open Side-by-Side PK](${pkUrl})`
    ].join("\n");
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");
  }

  if (score < minScore || (reqLlms && !hasLlms)) {
    process.exit(1);
  }
}

main();
