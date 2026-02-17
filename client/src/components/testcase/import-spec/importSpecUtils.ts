export type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export const FALLBACK_SPEC_PROMPT = `You are a senior QA analyst. Convert the following raw content into a structured feature specification document.

**CRITICAL INSTRUCTIONS:**

1. Extract all feature requirements, user flows, and acceptance criteria
2. Organize into clear sections with markdown headers
3. Preserve all technical details, field names, error messages, and business rules
4. Use tables for structured data (fields, validations, etc.)
5. Include edge cases and boundary conditions if mentioned
6. Output ONLY the structured markdown content (no preamble)

**OUTPUT FORMAT:**
# Feature Specification

## Overview
...

## User Flows
...

## Requirements
...

## Acceptance Criteria
...`
