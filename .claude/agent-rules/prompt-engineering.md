# Prompt Engineering

> Writing clear, unambiguous instructions that Claude reliably follows

## Use imperative, not descriptive

- **Mistake**: Instructions written as "The agent file should be read" or "Skills are loaded after classification." Claude treated these as informational descriptions and sometimes skipped them.
- **Fix**: Write instructions as direct commands: "Read the agent file." "Classify the task, THEN load the matching skill." Imperative phrasing is treated as mandatory by Claude.
- **Example**:
  - Bad: "The user's input should be validated before proceeding."
  - Good: "Validate the user's input before proceeding."
- **Applies to**: commands, agents, and skills

## Explicit > implicit

- **Mistake**: Critical behaviors were buried in prose paragraphs. Claude followed the structured/numbered rules but skipped important constraints hidden in paragraph text.
- **Fix**: If a behavior is required, state it as a numbered rule, bold constraint, or table row. Never bury requirements in explanatory prose. Claude follows structured rules but skips prose.
- **Example**:
  - Bad: "It's worth noting that the agent should always wait for user input between steps, as this ensures better interaction quality."
  - Good: "**Rule: ALWAYS wait for user input between steps. Use AskUserQuestion + STOP.**"
- **Applies to**: commands, agents, and skills
