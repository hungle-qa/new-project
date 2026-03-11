Capture an agent-authoring mistake or lesson learned from this conversation and save it to the agent rules knowledge base.

User guidance (may be empty): $ARGUMENTS

Follow these steps:

1. **Analyze the conversation** to identify the agent-authoring mistake or lesson learned. If $ARGUMENTS is provided, use it as guidance for what to capture. If empty, auto-detect the most recent mistake or correction related to command/agent/skill files.

2. **Read the index** at `.claude/rules/agent-rules.md` to get the current category list and keywords.

3. **Match the lesson** to the best category file based on keywords. If no existing category fits well, create a new `.claude/agent-rules/{name}.md` file and update the index table.

4. **Read the target category file** from `.claude/agent-rules/`.

5. **Deprecation check**: Scan existing rules in the category for overlap or contradiction with the new rule. If found, ask the user: "These existing rules may be outdated or overlap — update/remove them?" and list the conflicting rules. Wait for user response before proceeding.

6. **Append the rule** at the end of the file using this format:

```
## [Short descriptive title]
- **Mistake**: What went wrong
- **Fix**: What to do instead
- **Example**: (optional) code snippet or file reference
- **Applies to**: command / agent / skill
```

7. **Save the category file**.

8. **Update the index** in `.claude/rules/agent-rules.md` if a new category was created or new keywords should be added.

9. **Confirm** what was saved: the rule title, which category file, and any index changes.
