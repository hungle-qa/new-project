# Content Lifecycle

> Rule hygiene: avoid duplicates, deprecate stale content, review periodically

## Check for existing rules before adding

- **Mistake**: New rule added that overlapped with or contradicted an existing rule in the same category file. Resulted in conflicting instructions.
- **Fix**: Before appending a new rule via `/ruleagent`, scan all existing rules in the target category file for overlap or contradiction. Ask the user whether to update the existing rule or add a new one.
- **Applies to**: all rule files (code-rules and agent-rules)

## Mark outdated rules with (deprecated)

- **Mistake**: Outdated rule was deleted entirely. The mistake history was lost, and the same mistake was repeated later because there was no record of it.
- **Fix**: When a rule no longer applies, prefix its title with `(deprecated)` rather than deleting it. This preserves the mistake history for future reference.
- **Example**:
  ```
  ## (deprecated) Old rule about X
  - **Reason deprecated**: Replaced by Y (2024-01)
  ```
- **Applies to**: all rule files (code-rules and agent-rules)
