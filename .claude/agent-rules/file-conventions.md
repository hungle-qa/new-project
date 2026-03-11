# File Conventions

> Directory layout, naming, metadata requirements

## Canonical directory layout

- **Mistake**: Agent-related files placed in wrong directories (e.g., skill files inside agents/, or rules inside commands/).
- **Fix**: Follow this layout exactly:
  ```
  .claude/
    agents/           # Agent orchestration files
    skills/{agent}/   # Skill files grouped by parent agent
    commands/         # User-facing slash commands
    rules/            # Auto-loaded rule indexes (code-rules.md, agent-rules.md)
    code-rules/       # Code mistake rule files
    agent-rules/      # Agent mistake rule files
    workflows/        # Cross-cutting workflow documentation
  ```
- **Applies to**: all .claude/ files

## Agent metadata must declare tools

- **Mistake**: Agent file had no metadata section. Claude used default tool set, which may not include required tools like AskUserQuestion.
- **Fix**: Every agent file needs a Metadata section listing: name, description, and tools the agent requires.
- **Example**:
  ```
  ## Metadata
  - **Name**: brainstorm
  - **Description**: Strategic product brainstorming
  - **Tools**: Read, Glob, Grep, AskUserQuestion
  ```
- **Applies to**: all agents

## Command frontmatter is required

- **Mistake**: Command file had no frontmatter. The command didn't show up correctly in help/listings.
- **Fix**: Commands need a description line at the top and `$ARGUMENTS` placeholder for user input.
- **Example**:
  ```
  Short description of what the command does.

  User guidance (may be empty): $ARGUMENTS
  ```
- **Applies to**: all commands
