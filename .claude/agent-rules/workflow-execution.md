# Workflow Execution

> Step sequencing, STOP conditions, user interaction gates

## MUST use AskUserQuestion and STOP for user input

- **Mistake**: Brainstorm agent generated clarifying questions AND then immediately answered them itself in the same response, skipping the user entirely.
- **Fix**: When a workflow step requires user input, use AskUserQuestion tool and include an explicit **STOP — do not proceed until the user responds** instruction. Never generate hypothetical answers.
- **Example**:
  ```
  Step 2: Ask clarifying questions using AskUserQuestion.
  **STOP — wait for user answers before proceeding to Step 3.**
  ```
- **Applies to**: agents and skills with multi-step workflows

## Step tables must show STOP conditions

- **Mistake**: Workflow steps were described in prose paragraphs. Claude treated them as a continuous flow and skipped STOP points.
- **Fix**: Use a table with Step / Action / STOP Condition columns. Explicit structure prevents Claude from blending steps together.
- **Example**:
  ```
  | Step | Action | STOP Condition |
  |------|--------|----------------|
  | 1 | Analyze the request | — |
  | 2 | Ask clarifying questions | STOP — wait for user response |
  | 3 | Present recommendation | — |
  ```
- **Applies to**: agents and skills with multi-step workflows
