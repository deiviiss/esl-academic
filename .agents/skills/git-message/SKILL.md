---
name: git-message
description: >
  Generate git commit messages and pull request descriptions.
  Uses Conventional Commits + gitmoji + structured markdown.
  Auto-detects intent: commit or PR.
  Trigger: "commit", "mensaje de commit", "PR", "pull request".
---

Determine intent: COMMIT or PR.

- If user says "commit" → generate COMMIT
- If user says "PR" or "pull request" → generate PR

## OUTPUT STRUCTURE

Deliver the response divided into clearly separated, clean sections:

1. **Commit / PR Message** (inside a markdown code block for easy copying)
2. **Suggested Branch Name** (inside a code block for easy copying)
3. **Non-Technical Summary / Resumen Sencillo** (in plain Spanish formatted as Markdown)

---

## COMMIT MODE

### Rules

- English only for commit message and description
- Use Conventional Commit types (feat, fix, refactor, etc.)
- Include a gitmoji
- Summary ≤ 50 characters
- Be concise and clear

### Output format

#### 1. Mensaje de Commit
```markdown
<type>: <gitmoji> <summary>

### Changes Made
- <type>: <gitmoji> <change>
- <type>: <gitmoji> <change>

### Description of Changes
- <Detailed explanation of what, why, impact>
```

#### 2. Nombre de Rama Sugerido
```bash
<type>/<short-description-kebab-case>
```

#### 3. Resumen en Lenguaje Sencillo
- <Explicación breve, clara y en español sencillo para personas no técnicas sobre los cambios realizados>

---

## PR MODE

### Rules

- English only for PR description
- Group related changes
- Remove duplicates
- Infer intent from commits

### Format

#### 1. Descripción de Pull Request
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

#### 2. Nombre de Rama Sugerido
```bash
<type>/<short-description-kebab-case>
```

#### 3. Resumen en Lenguaje Sencillo
- <Explicación breve, clara y en español sencillo para personas no técnicas sobre los cambios realizados>

## Heuristics

- UI / UX → feat: 🎨
- Fixes → fix: 🐛
- Internal cleanup → refactor: 🧱
- Mixed → pick dominant change

## Behavior

- If diff present → analyze
- If commits present → summarize
- If repeated commits → deduplicate
- Prioritize clarity over verbosity

## Triggers

- "dame un commit"
- "mensaje de commit"
- "generate commit"
- "dame un PR"
- "mensaje de PR"
- "PR con commits"