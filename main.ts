// Entry program for the make.fun bounty "Day one, day seven"
// (post-tiktok-day-one-day-seven-20261123-0327).
//
// The scored artifact is the TikTok video itself; this program's only job is
// to hand the grader the video's address. It copies VIDEO.json from the
// repository root into the output directory, where the harness reads it.
//
// The bot directory comes from MAKEFUN_BOT_DIR when set and falls back to
// /bot; the output directory comes from MAKEFUN_OUTPUT_DIR and falls back
// to /output. Node 22, standard library only.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Fail loudly rather than hand in an address that can never score: the gate
// refuses short links and placeholders, so VIDEO.json must parse and its url
// must be one full tiktok.com/@<handle>/video/<digits> address — no query
// string, no fragment.
const videoUrlPattern = /^https:\/\/www\.tiktok\.com\/@[^/?#]+\/video\/\d+$/;

function checkedVideoUrl(dir: string): void {
  let parsed: { url?: unknown };
  try {
    parsed = JSON.parse(readFileSync(join(dir, "VIDEO.json"), "utf8"));
  } catch (err) {
    console.error(
      `VIDEO.json in ${dir} is not readable JSON: ${(err as Error).message}`,
    );
    process.exit(1);
  }
  if (typeof parsed.url !== "string" || !videoUrlPattern.test(parsed.url)) {
    console.error(
      `VIDEO.json does not hold a full TikTok video address: ${String(parsed.url)}`,
    );
    process.exit(1);
  }
}

checkedVideoUrl(botDir);
mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(join(botDir, "VIDEO.json"), join(outputDir, "VIDEO.json"));
} catch (err) {
  console.error(
    `could not copy VIDEO.json from ${botDir}: ${(err as Error).message}`,
  );
  process.exit(1);
}
