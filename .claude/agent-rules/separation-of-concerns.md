# Separation of Concerns

> Single responsibility: command dispatches, agent orchestrates, skill executes

## Commands must NOT contain workflow logic

- **Mistake**: Brainstorm command had the full 4-step workflow (Analyze → Clarify → Challenge → Recommend) instead of delegating to the agent. The command duplicated what the agent should own.
- **Fix**: Command = read agent file + pass $ARGUMENTS, nothing more. All workflow logic belongs in the agent or skill files.
- **Example**: Command should be ~10 lines: parse args, read agent file, done. If a command exceeds 20 lines and has a matching agent, it's doing too much.
- **Applies to**: commands that have a matching agent

## Never redefine agent role/tone in command

- **Mistake**: Command file included role/persona definitions ("You are a strategic advisor...") that duplicated or conflicted with the agent file's role definition.
- **Fix**: Role, persona, and tone belong exclusively in the agent file. Commands must not set tone — they only dispatch.
- **Applies to**: all commands

## Never pre-load all skills — classify first

- **Mistake**: Brainstorm command read ALL skill files (app-build.md, ai-workflow.md) upfront before knowing which domain the task belonged to. Wastes context window and confuses routing.
- **Fix**: Agent classifies the task first, THEN reads ONLY the matching skill file. Classification before loading.
- **Example**: Agent reads task → determines domain is "app-build" → reads only `.claude/skills/brainstorm/app-build.md`
- **Applies to**: agents with multiple skills

## Skill files must be self-contained

- **Mistake**: Skill file referenced "Step 3 from the agent" without defining what Step 3 actually does. The agent defined steps but the skill assumed them.
- **Fix**: Each skill defines its complete workflow end-to-end. A skill should be understandable without reading the agent file.
- **Applies to**: all skills

## Direct commands are valid

- **Mistake**: Assumed every command needs an agent. Tried to create agents for simple one-shot commands like /ship and /rulecode.
- **Fix**: Simple commands (commit, capture rule, etc.) can contain their full logic directly. The command→agent→skill pattern is for complex, multi-step workflows only.
- **Applies to**: commands without agents
