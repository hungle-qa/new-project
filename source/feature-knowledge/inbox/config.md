---
name: inbox
created: '2026-02-09'
updated: '2026-02-12'
source_files:
  - EV-Handbook inbox-090226-101139.pdf
prompt: "You are a senior QA knowledge engineer. Convert the raw document into a condensed knowledge reference that a QA testcase writer can use. Goal: 20% of original length but 80% of the context and information.\r\n\r\n**CRITICAL INSTRUCTIONS:**\r\n1. Organize ALL content under ## headings (one per major topic/function)\r\n2. Under each ## heading, extract ONLY:\r\n   - Key business rules and logic (bullet points)\r\n   - Field names, valid values, constraints\r\n   - User roles and permissions\r\n   - Error conditions and edge cases\r\n   - Terminology definitions (bold term: definition)\r\n3. SKIP: UI flow narratives, screenshots descriptions, lengthy explanations, repeated info\r\n4. KEEP: exact field names, error messages, numeric thresholds, status values — these must be word-for-word\r\n5. End with ## Terminology section (bold glossary of all domain-specific terms)\r\n6. End with ## Summary section (3-5 bullet high-level overview)\r\n7. Output ONLY the structured markdown (no preamble)\r\n\r\n**OUTPUT FORMAT:**\r\n\r\n## I. {Topic/Function Name}\r\n- {key rule or constraint}\r\n- **{Field/Term}:** {definition or valid values}\r\n- {business logic bullet}\r\n\r\n## II. {Next Topic}\r\n...\r\n\r\n## Terminology\r\n- **{Term}:** {definition}\r\n\r\n## Summary\r\n- {high-level point 1}\r\n- {high-level point 2}"
---

<!-- source: EV-Handbook inbox-090226-101139.pdf -->

## I. Overview
- In-app messaging system for coaches to receive and send replies instantaneously.
- Accessible to all user roles (Owner, Admin, Trainer, Client) on all plans.

## II. Admin Convo Mode
- Owners, Admins, or Managers can view their Coaches' inbox and conversations with clients for quality control.
- Navigation: Inbox > Click the dropdown > Choose the Coach.

## III. AI Setting (Smart Response)
- Smart Responses provide AI-generated draft replies based on the chat context.
- Scenario 1: New (Unopened) Conversations
    - Smart Response creates a draft reply as soon as a message arrives.
    - A "Draft" badge appears in the Inbox list.
    - Open the conversation to see the AI draft already filled in the chat box.
- Scenario 2: Actively Chatting
    - Smart Response drafts a reply for the first incoming message of an active session.
    - The draft appears as a preview above the chat box.
    - Click the draft to move it into the chat box.
- Manually Generate a Smart Response:
    - Web app: Hover over a clientʼs text message > Click Reply with AI.
    - Mobile app: Long‑press a client message > Tap Reply with AI.

## IV. Broadcast
- Send messages to multiple clients simultaneously.
- Available only to Studio plan users.

## V. Create New Chat - Group Chat
- Coaches and clients can maintain seamless communication and participate in real-time discussions.
- Available to Studio plan users.

## VI. Reply Message
- Web app: Hover over the message to respond to.
- Mobile app: Select the message and swipe left or press hold.

## VII. Mark as Unread / Archive Room
- Mark as unread: Remind yourself to check back on a conversation.
- Archive a chat: Click on the “...” button at the top right corner.

## VIII. Voice Chat
- Send voice messages to clients.
- Web: Click the microphone icon.
- Mobile: Microphone icon in the Inbox of the coach app.
- Voice chat is enabled for all clients by default.
- To disable for specific clients: Client's settings page > uncheck "Allow client to send voice messages" under "Messages".

## IX. Save Response
- Save frequently used messages and quickly reuse them in chats.
- Available on the Pro plan and above.
- Web app: Click the Saved Responses button (or use the shortcut).
- Mobile app: Tap the Saved Responses icon in the chat input.

## X. Test Accounts
- `hungle+a1@everfit.io`: Owner - Can chat with all clients.
- `hungle+ada1@everfit.io`: Admin - Can chat with all clients.
- `hungle+tra1@everfit.io`: Trainer - Donʼt allow chat with other coachesʼ clients.

## Terminology
- **Admin Convo Mode:** Allows Owners, Admins, or Managers to view coach-client conversations for quality control.
- **Smart Response:** AI-generated draft replies to client messages.
- **Broadcast:** Sending a message to multiple clients simultaneously.
- **Archive:** Removing a conversation from the main inbox view.
- **Saved Response:** Pre-written messages that can be quickly inserted into a chat.

## Summary
- Inbox feature supports various communication methods including text, voice, and AI-assisted responses.
- Different user roles have specific permissions, such as Admins viewing coach conversations.
- Studio plan unlocks advanced functionalities like broadcast messages and group chats.
- Voice chat can be disabled for individual clients.
- Saved responses streamline communication for coaches.
