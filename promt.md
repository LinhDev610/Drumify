# AI Prompt Templates for Development

This file contains reusable prompts for daily development with AI.

---

# 1. Daily Prompt (small tasks)

Use for:
- fix bug
- add field
- update API
- add validation
- small UI change
- refactor small logic

## Prompt

Read rules.md first. \
Inspect related files. \
Reuse existing patterns. \
Then implement the requested feature.

## Example

Read rules.md first. \
Inspect ProductController, ProductService, ProductResponse. \
Reuse existing patterns. \
Then add productStatus field to product detail API.

---

# 2. Full Prompt (large tasks)

Use for:
- new feature
- new module
- payment flow
- authentication
- dashboard
- order workflow
- major refactor

## Prompt

Read rules.md first. \
Inspect all related files. \
Summarize your understanding of the current implementation. \
Provide a short implementation plan. \
Reuse existing patterns. \
Then implement the requested feature.

After implementation provide:
- files changed
- reason for each change
- possible risks

## Example

Read rules.md first. \
Inspect all order-related files. \
Summarize the current order flow. \
Provide a short implementation plan. \
Reuse existing patterns. \
Then implement refund feature.

After implementation provide:
- files changed
- reason for each change
- possible risks

---

# 3. Correction Prompt (when AI is wrong)

Use when:
- wrong architecture
- duplicate code
- wrong DTO
- wrong API format
- bad naming
- missing validation
- security issue

## Prompt

You violated rules.md.

Please do the following: 
1. Explain what was wrong. 
2. Explain why it violates the project rules. 
3. Fix the implementation. 
4. Update rules.md so this mistake does not happen again.

## Example

You violated rules.md. 

Please do the following: 
1. Explain why returning Entity directly is wrong. 
2. Explain which rule was violated. 
3. Fix the implementation using Response DTO. 
4. Update rules.md to make the rule stricter.