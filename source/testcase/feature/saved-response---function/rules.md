## Business Rules

### Web
- **MUST** test on Safari.
- If the feature is related to the purchase flow in Payment & Package → **MUST** check on mobile browser.
- **MUST** handle ESC key to close pop-ups.
- **SHOULD** show pointer cursor when hovering on buttons, comboboxes, and clickable sections.
- If a checkbox includes inline text → **SHOULD** be able to click the text to tick/untick the checkbox.

### API
- If spec doesn't define coach permissions → **MUST** ask QA to verify. General rule:
  - **Trainer:** edit/delete permission on their own assets only, even if shared.
  - **Admin/Owner:** edit/delete permission on all shared assets.
- If the feature involves turning on a feature via CMS permission or upgrade path → **MUST** be aware of plan tiers: Trial, Paid (Pro, Studio, Bundle), Free.
- Related to uploading image/video → **MUST** test file size limitations.
- Related to billing → **SHOULD** test both monthly and annual billing periods.
- If the function affects the autoflow calendar → **SHOULD** test both Exact Date and Interval autoflow types.
- Any case related to client status → **MUST** be aware of all states: Pending, Connected, Offline, Archived, Waiting Activation.
- Related to authentication → **MUST** be aware of Google login.
- Related to purchase → **SHOULD** check 3DS card flow.

### General
- **MUST** check plural vs. singular nouns. Example: `1 item`, `2 items`.
- Date/time format:
  - Same year: `MMM d` (e.g., `Mar 2`)
  - Different year: `MMM d, YYYY` (e.g., `Mar 2, 2024`)
- Any logic related to date/time → **MUST** test timezone handling.
- **SHOULD** show a Discard Changes pop-up when unsaved changes exist and user attempts to close the main pop-up.
- CTA button → **SHOULD** be disabled when there are no changes.
- CTA button → **SHOULD** check spam-click behavior.
- **MUST** be aware of load-more logic for long lists.
- Search without a submit button:
  - **SHOULD NOT** spam the API while typing — must have a debounce delay.
  - **SHOULD** test search with: numbers, special characters, special languages, lower/upper case, copy/paste input.
  - **SHOULD** verify result ordering after search.
- Load more test data: create enough data for at least 2 load-more triggers. Example: if page size = 20 → prepare 41 items minimum.
- Any logo or Everfit branding → **MUST** be aware of Whitelabel (workspaces with custom branding in client app, payment flow, and client emails).
