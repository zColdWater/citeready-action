# CiteReady GitHub Action (`zColdWater/citeready-action@v1`)

[![CiteReady AI Search Score](https://citeready-checker.appwrite.network/api/badge?url=citeready-checker.appwrite.network)](https://citeready-checker.appwrite.network/?url=citeready-checker.appwrite.network)

[![AI CiteReady](https://img.shields.io/badge/CiteReady-AI%20Search%20%26%20llms.txt-7c3aed)](https://citeready-checker.appwrite.network/?ref=gh-citeready-action-badge)
[![GitHub Release](https://img.shields.io/badge/release-v1.0.0-7c3aed)](https://github.com/zColdWater/citeready-action/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**Zero-dependency GitHub Action to verify `/llms.txt`, `/robots.txt` rules across 10 AI search crawlers (`OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `GPTBot`, `Google-Extended`), and Schema.org JSON-LD entity graphs on every deploy.**

- **Free Online Side-by-Side Competitor AI Search PK:** [https://citeready-checker.appwrite.network/?a=linear.app&b=stripe.com](https://citeready-checker.appwrite.network/?a=linear.app&b=stripe.com&ref=gh-citeready-action)
- **Free `/llms.txt` Generator:** [https://citeready-checker.appwrite.network/generator](https://citeready-checker.appwrite.network/generator?ref=gh-citeready-action)
- **CiteReady Fix Kit Unlock ($2 Launch Special, ~~$12~~):** [https://omnipulse-x402.appwrite.network/go/gumroad/citeready](https://omnipulse-x402.appwrite.network/go/gumroad/citeready)
- **OmniForge 3-in-1 Complete Suite ($5 Launch Special, ~~$29~~):** [https://omnipulse-x402.appwrite.network/go/gumroad/launch-stack](https://omnipulse-x402.appwrite.network/go/gumroad/launch-stack)

---

## Quick Start (`uses: zColdWater/citeready-action@v1`)

```yaml
name: CiteReady AI Search Gate
on: [push, pull_request]

jobs:
  ai-visibility:
    runs-on: ubuntu-latest
    steps:
      - name: Check AI Crawlers, llms.txt & JSON-LD
        uses: zColdWater/citeready-action@v1
        with:
          url: "https://yourproduct.com"
          min-score: "70"
          require-llms-txt: "true"
```

### Action Inputs & Outputs

| Input | Default | Description |
| :--- | :---: | :--- |
| `url` | *(required)* | Public website or documentation URL to inspect. |
| `min-score` | `"65"` | Minimum passing AI Citation Readiness score (`0-100`). |
| `require-llms-txt` | `"false"` | Fail build when `/llms.txt` is missing or returns HTML 404. |

Outputs: `score`, `has-llms-txt`, and `blocked-bots`.

## License

MIT © OmniForge · Agent Arena Studio (`agentarenastudio@proton.me`)

## 2026 Empirical Benchmarks

- [2026 Empirical Benchmark: AI Search Readiness & /llms.txt Across Top 50 AI & Dev SaaS Sites](https://zcoldwater.github.io/citeready-cli/ai-search-readiness-benchmark-2026.html)
- [2026 Top 50 AI & Dev SaaS AI Search Readiness & /llms.txt Benchmark](https://zcoldwater.github.io/citeready-cli/ai-search-readiness-benchmark-2026.html)
