## Permissions / Business Rules
- "Saved Responses" feature is available on the Pro plan and above.
- All Coaches in the workspace can use "Saved Responses" feature as long as the workspace has permission to use it.
- Saved Responses list is private per user.

## US1: As a coach who frequently messages clients, I want to save and quickly insert predefined responses in chats, so that I can respond faster and maintain consistency in my communication without typing the same messages repeatedly

### AC1: Add Saved Response button in Editor nav
- Given: I am in a conversation Editor nav
- When: I observe the Editor nav
- Then:
  - Add a Saved Responses button next to GIF button.
  - Hover over the button will show a tooltip: "Saved Responses".

### AC2: Saved Response popup
- Given: I am in a conversation
- When: I click on Saved Responses button OR using shortcut Ctrl/command K
- Then:
  - Saved Responses modal is shown.
  - The modal contains:
    - X button: on click, close the modal.
    - Search box (refer to AC3).
    - + "Create new" button:
      - Placed in top-right corner.
      - Hovering will display as "+ Create New".
      - When I click on the button, then refer to AC5.
  - If there are no saved responses, display:
    - An image.
    - Text: "Your saved responses list is empty. Start by creating your first one to save time during chats."
  - If having saved responses, display list of saved-response items below Search box, as:
    - On the left-side of the modal, show list of title's saved responses:
      - Order by latest updated time.
      - Divided into 2 sections:
        - FREQUENTLY USED section:
          - Show the responses that the user interacts with most often.
          - A response's usage count is incremented each time the response is selected (appended into chatbox) by the user. Usage count is per user.
          - If there is no frequently used saved responses, then hide this section.
          - If having list of frequently used saved responses, then show Top 5 most-used saved responses by that user.
          - If there are fewer than 5 responses, show all available responses.
          - Sort by usage_count descending (most used → least used).
          - When usage_count is equal, sort by title ascending (A-Z).
        - ALL section:
          - List all saved responses, sort by title A-Z.
    - Select the first saved response in the list by default.
    - Allow user to use arrow-keys (Up, Down) to move between responses in the list.
    - On the right-side of the modal, show the message detail of current-selecting saved response, as:
      - {title}
      - {message_detail}
      - Hover over the message detail will show a 3-dot (refer to AC4).
      - Allow scrolling if the message is long.
      - Hover between title of saved-responses list to view its message detail.
      - Allow to click on the title of a saved-response item to fill it in chatbox (refer to AC8).
    - Apply pagination:
      - Load every 20 items.
      - When user scrolls down, display Load more and get the next 20 items.
  - Footer shows list of shortcut as: "↑↓ to navigate", "↵ to select", "Esc to close".
  - Click X button OR shortcut Esc will close the popup.

### AC3: Search box behaviors
- Given: I am in a conversation Saved Responses popup
- When: I observe the Saved Responses popup
- Then:
  - Search box is present in Saved Responses popup.
  - Empty by default, with placeholder: "Search saved response".
  - When focus to the box, change placeholder to “Enter keyword...".
  - Allow input text to search for responses:
    - Display X icon when inputting text.
    - Remove text by backspace or click on X icon.
    - Should remove search input and show back the full list when search input is cleared.
  - Searching rules:
    - Start searching from 1 char.
    - Search based on title and message → return all saved responses where either the title or message field contains the search keyword.
    - Matching is case-insensitive and partial → the result is valid if the search keyword appears anywhere within either field.
  - Searching results are shown:
    - If having no results found, show:
      - An image.
      - Text: "Search results (0)".
    - If having matching results found:
      - Show number of matching results below Search box: "Search results ({number_of_matched_results})".
      - Show list of results same as AC2 above.
      - Select the first result to view by default.
      - Apply pagination:
        - Load every 20 items.
        - When user scrolls down, display Load more and get the next 20 items.

### AC4: 3-dot button behaviors
- Given: I am viewing Saved Responses popup
- When: I click on 3-dot button on a saved response item
- Then: A submenu is shown, containing options:
  - Edit response
  - Delete response

### AC5: Add a new saved response
- Given: I am viewing Saved Responses popup
- When: I click on + Create new button
- Then:
  - Create Saved Response popup is shown.
  - The popup contains:
    - Title: "Create Saved Response".
    - [X] button: On clicking X button, close the popup.
    - TITLE field:
      - Add a (info) icon next to field title.
      - When hover over the (info) icon, show a tooltip: "Used to organize responses. This won't appear in messages..".
      - Required field.
      - Empty by default, with placeholder: “Name this response for easy search".
      - Allow all characters.
      - Allow to input maximum 140 characters.
      - Cannot input anymore if inputted max 140 characters.
      - If user pastes a text more than 140 characters, then cut off and paste the first 140 characters into the field.
    - MESSAGE field:
      - Required field.
      - Empty by default, with placeholder: "Write the full message you want to send to clients".
      - Allow to input any characters.
      - Not allow text-formatting.
      - If user paste a text paragraph, clear text-formatting (if any).
      - Allow to input maximum 10,000 characters.
      - Character count is shown as "{X}/10000", {X} is total number of characters.
      - Cannot input anymore if inputted max 10,000 characters.
      - If user pastes a text more than 10,000 characters, then cut off and paste the first 10,000 characters into the field.
    - Cancel button:
      - Always enable.
      - On clicking Cancel button, close the popup.
    - Save button:
      - Disable by default.
      - Enable if having input in both TITLE & MESSAGE fields.
      - On clicking Save button, add a new saved response to the list.
      - Once successfully saved, display a toast "New Saved Response created."

### AC6: Edit a saved response
- Given: I am viewing Saved Responses popup
- When: I click on 3-dot button and click Edit response option
- Then:
  - Edit Saved Response popup is shown.
  - The popup contains:
    - Title: "Edit Saved Response".
    - [X] button:
      - If user has made no changes, close the popup.
      - If user has made at least 1 change, show the Discard change pop up:
        - Title: "Discard Changes?".
        - Text: "Are you sure you want to go? Changes have not been saved yet.".
        - Cancel button or [X] icon: On click, close the Discard changes pop up.
        - Discard Changes button: On click, close the Discard changes pop up & back to the previous page without saving changes.
    - TITLE field:
      - Pre-populate the existing title.
      - Keep other behaviors same as AC5.
    - MESSAGE field:
      - Pre-populate the full message.
      - Keep other behaviors same as AC5.
    - Cancel button:
      - Always enable.
      - On clicking Cancel button:
        - If use has made no changes, close the popup.
        - If user has made at least 1 change, show the Discard change pop up (as described for [X] button).
    - Save button:
      - Enable if having input in both TITLE & MESSAGE fields.
      - On clicking Save button, save new changes for that response.
      - Once successfully saved, display a toast "Saved Response updated successfully."

### AC7: Delete a saved response
- Given: I am viewing Saved Responses popup
- When: I click on 3-dot button and click Delete response option
- Then:
  - A confirmation popup is shown.
  - The popup contains:
    - Title: "Delete Response?".
    - Text: "This response will be permanently deleted and can't be recovered.<br>Are you sure you want to proceed?".
    - Cancel button: On click, close the popup.
    - OK button: On click, close the popup and process to delete the response. Once successfully deleted, display a toast “Saved Response deleted."

### AC8: Add saved response to chat box by selecting an item in Saved Response popup
- Given: I am viewing Saved Responses popup
- When: I click on title of a saved response item or hit ENTER
- Then: Append the full message content into the chatbox, place it behind the current text (if any).

## US2: As a coach who frequently messages clients, I want to create a saved response from a message in the conversation, so that I add a new saved response quicker

### AC1: Add "Save this response" button to Coach's non-text message
- Given: I am in a conversation message detail
- When: I hover over a non-text message of the Coach
- Then:
  - Add a (bookmark) button between 3-dot and Reply buttons for those non-text messages of the Coach.
  - Hover the button shows a tooltip "Saved this response".
  - On click the button, show add a new saved response popup (refer to US2 AC2 for details).
  - Note: Only show this button on hovering message if the workspace is in paid-plan including Saved Response feature (Pro, Studio plan).

### AC2: Add new saved response from the conversation
- Given: I am in a conversation detail
- When: I click on "Save this response" button
- Then:
  - The "Create Saved Response" popup (same structure as US1 AC5) is shown.
  - Adjust the popup title to "Add To Saved Responses".
  - Leave Title field blank.
  - Pre-populate the Coach's message into the Message field.
  - If the Coach's message is over 10,000 characters, then cut the first 10,000 characters of the message to be filled in the field.
  - On click Save button will add that message as a new saved response, and show a toast "Response has been saved".