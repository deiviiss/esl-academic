---
name: git-message
description: >
  Generate git commit messages and pull request descriptions.
  Uses Conventional Commits + gitmoji + structured markdown + branch names.
  Auto-detects intent: commit or PR.
  Trigger: "commit", "mensaje de commit", "PR", "pull request".
---

Determine intent: COMMIT or PR.

- If user says "commit" → generate COMMIT
- If user says "PR" or "pull request" → generate PR

## CRITICAL OUTPUT RULE

- Output MUST consist of EXACTLY TWO SEPARATE code blocks:
  1. Block 1: Raw branch name ONLY (e.g. `feat/yena-reference-filter`)
  2. Block 2: Complete commit message or PR description in markdown
- Do NOT add `git checkout -b` or explanations outside/inside the blocks.

---

## BRANCH NAME RULES

- Always suggest a git branch name
- Format: `<type>/<kebab-case-short-summary>` (e.g. `feat/yena-reference-filter`, `docs/add-etl-domains-skill`, `fix/aggregators-duplicate-error`)
- Max 40 characters for the branch name slug
- Lowercase only, hyphen-separated

---

## COMMIT MODE

### Rules

- English only
- Use Conventional Commit types (feat, fix, refactor, docs, etc.)
- Include a gitmoji
- Summary ≤ 50 characters
- Be concise and clear

### Output format

Block 1 (Commit Message):
```markdown
<type>: <gitmoji> <summary>

### Changes Made
- <type>: <gitmoji> <change>
- <type>: <gitmoji> <change>

### Description of Changes
- <Detailed explanation of what, why, impact>
```

Block 2 (Raw Branch Name):
```text
<type>/<kebab-case-short-summary>
```

---

## PR MODE

### Rules

- English only
- Group related changes
- Remove duplicates
- Infer intent from commits

### Output format

Block 1 (PR Description):
```markdown
<type>: <gitmoji> <PR summary>

### Changes Made
- <type>: <gitmoji> <grouped change>
- <type>: <gitmoji> <grouped change>

### Description of Changes
- High-level explanation
- Why it was done
- Impact (UI, perf, architecture)
```

Block 2 (Raw Branch Name):
```text
<type>/<kebab-case-short-summary>
```


---

## Heuristics

- UI / UX → feat: 🎨
- Fixes → fix: 🐛
- Internal cleanup → refactor: 🧱
- Documentation → docs: 📝
- Mixed → pick dominant change

---

## Behavior

- If diff present → analyze
- If commits present → summarize
- If repeated commits → deduplicate
- Prioritize clarity over verbosity

---

## Triggers

- "dame un commit"
- "mensaje de commit"
- "generate commit"
- "dame un PR"
- "mensaje de PR"
- "PR con commits"