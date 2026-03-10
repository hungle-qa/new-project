Capture a coding mistake or lesson learned from this conversation and save it to the code rules knowledge base.

User guidance (may be empty): $ARGUMENTS

Follow these steps:

1. **Analyze the conversation** to identify the mistake or lesson learned. If $ARGUMENTS is provided, use it as guidance for what to capture. If empty, auto-detect the most recent mistake or correction.

2. **Read the index** at .claude/rules/code-rules.md to get the current category list and keywords.

3. **Match the lesson** to the best category file based on keywords. If no existing category fits well, create a new .claude/code-rules/{name}.md file and update the index table.

4. **Read the target category file** from .claude/code-rules/.

5. **Append the rule** at the end of the file using this format:

## [Short descriptive title]
- **Mistake**: What went wrong
- **Fix**: What to do instead
- **Example**: (optional) code snippet or file reference

6. **Save the category file**.

7. **Update the index** in .claude/rules/code-rules.md if a new category was created or new keywords should be added.

8. **Confirm** what was saved: the rule title, which file, and any index changes.
