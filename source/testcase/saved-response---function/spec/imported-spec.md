
GIVEN: The project structure and objectives.

WHEN: Analyzing the context and objective.

THEN: The following goals are established:

* Users often repeat similar messages when communicating with clients, leading to inefficiency and inconsistency.


* The Saved Response feature allows users to create and reuse predefined responses to streamline communication, save time, and maintain consistent tone and quality.


GIVEN: The feature specifications.

WHEN: Evaluating the permissions for the Saved Responses feature.

THEN: The following rules apply:

* The feature is available on the Pro plan and above.


* All Coaches in the workspace can use the feature as long as the workspace has permission to use it.


* The Saved Responses list is private per user.



GIVEN: User Story 1: As a coach who frequently messages clients, I want to save and quickly insert predefined responses in chats, so that I can respond faster and maintain consistency in my communication without typing the same messages repeatedly.

WHEN: Addressing AC1: Add Saved Response button in Editor nav.

THEN: The following criteria must be met:

* GIVEN: I am in a conversation.


* WHEN: I observe the Editor nav.


* THEN: Add a Saved Responses button next to the GIF button.


* THEN: Hovering over the button will show a tooltip: Saved Responses.



WHEN: Addressing AC2: Saved Response popup.

THEN: The following criteria must be met:

* GIVEN: I am in a conversation.


* WHEN: I click on the Saved Responses button or use shortcut Ctrl/command K.


* THEN: The Saved Responses modal is shown 


* THEN: The modal shows a list of MY saved responses.


* THEN: It contains an X button to close the modal.


* THEN: It contains a Search box.


* THEN: It contains a Create new button in the top-right corner.


* THEN: Hovering on Create new shows Create New tooltip.


* THEN: Clicking Create new triggers AC5.


* THEN: If the list is empty, display: {image} Your saved responses list is empty. Start by creating your first one to save time during chats..


* THEN: If having saved responses, display list items below the Search box, ordered by latest updated time.


* THEN: Divide the list into 2 sections: FREQUENTLY USED and ALL.


* THEN: In FREQUENTLY USED, show responses the user interacts with most often, incremented each time the response is appended to the chatbox.


* THEN: Usage count is per user.


* THEN: If no frequently used responses, hide this section.


* THEN: If available, show Top 5 most-used responses, sorted by usage_count descending, then by title A-Z.


* THEN: In ALL section, list all saved responses sorted by title A-Z.


* THEN: Select the first saved response by default.


* THEN: Allow using Up and Down arrow-keys to move between responses.


* THEN: On the right-side of the modal, show message details: {title} and {message_detail}.


* THEN: Hovering over message detail shows a 3-dot button (refer to AC4).


* THEN: Allow scrolling for long messages.


* THEN: Hovering between titles in the list updates the message detail view.


* THEN: Clicking on a title fills the chatbox (refer to AC1).


* THEN: Apply pagination: load every 20 items and show Load more on scroll.


* THEN: Footer shows shortcuts: X button or Esc to close popup.



WHEN: Addressing AC3: Search box behaviors.

THEN: The following criteria must be met:

* GIVEN: I am in a conversation.


* WHEN: I observe the Saved Responses popup.


* THEN: Show Search box 


* THEN: Empty by default with placeholder: Search saved response.


* THEN: When focused, placeholder changes to: Enter keyword....


* THEN: Allow input to search, displaying an x icon.


* THEN: Clicking x icon or using backspace removes text and shows back the full list.


* THEN: Start searching from 1 character.


* THEN: Search based on title and message field (case-insensitive and partial match).


* THEN: If no results found, show: Search results (0).


* THEN: If results found, show: Search results ({number_of_matched_results}) and list results as per AC2.


* THEN: Select the first result by default.


* THEN: Apply pagination: load every 20 items.



WHEN: Addressing AC4: 3-dot button behaviors.

THEN: The following criteria must be met:

* GIVEN: I am viewing the Saved Responses popup.


* WHEN: I click on the 3-dot button on a saved response item.


* THEN: A submenu is shown containing options: Edit response and Delete response.



WHEN: Addressing AC5: Add a new saved response.

THEN: The following criteria must be met:

* GIVEN: I am viewing the Saved Responses popup.


* WHEN: I click on the + Create new button.


* THEN: Create Saved Response popup is shown 


* THEN: Title is Create Saved Response.


* THEN: [X] button closes the popup.


* THEN: TITLE field is required, has a tooltip (Used to organize responses. This won't appear in messages..), and a placeholder (Name this response for easy search).


* THEN: TITLE field allows 140 characters max; excess text is cut off on paste.


* THEN: MESSAGE field is required, has a placeholder (Write the full message you want to send to clients), and does not allow text-formatting.


* THEN: MESSAGE field allows 10,000 characters max; character count shown as {X}/10000; excess text is cut off on paste.


* THEN: Cancel button is always enabled and closes the popup.


* THEN: Save button is disabled by default; enabled if both TITLE and MESSAGE are filled.


* THEN: On Save, display toast: New Saved Response created..



WHEN: Addressing AC6: Edit a saved response.

THEN: The following criteria must be met:

* GIVEN: I am viewing the Saved Responses popup.


* WHEN: I click on the 3-dot button and click the Edit response option.


* THEN: Edit Saved Response popup is shown


* THEN: Title is Edit Saved Response.


* THEN: [X] button or Cancel button closes popup if no changes; else shows Discard Changes? popup.


* THEN: Discard Changes? popup has text: Are you sure you want to go? Changes have not been saved yet..


* THEN: TITLE and MESSAGE fields are pre-populated with existing data; behaviors follow AC5.


* THEN: Save button enabled if fields are filled; shows toast: Saved Response updated successfully..



WHEN: Addressing AC7: Delete a saved response.

THEN: The following criteria must be met:

* GIVEN: I am viewing the Saved Responses popup.


* WHEN: I click on the 3-dot button and click the Delete response option.


* THEN: A confirmation popup is shown: Delete Response?.


* THEN: Text: This response will be permanently deleted and can't be recovered. Are you sure you want to proceed?.


* THEN: OK button deletes the response and shows toast: Saved Response deleted..



WHEN: Addressing AC8: Add saved response to chat box by selecting an item in Saved Response popup.

THEN: The following criteria must be met:

* GIVEN: I am viewing the Saved Responses popup.


* WHEN: I click on the title of a saved response item or hit ENTER.


* THEN: Append the full message content into the chatbox, behind current text.



GIVEN: User Story 2: As a coach who frequently messages clients, I want to create a saved response from a message in the conversation, so that I add a new saved response quicker.

WHEN: Addressing AC1: Add Save this response button to Coach's non-text message.

THEN: The following criteria must be met:

* GIVEN: I am in a conversation.


* WHEN: I hover over a non-text message of the Coach.


* THEN: Add a button between 3-dot and Reply buttons 


* THEN: Tooltip shows: Saved this response.


* THEN: Button only shows if workspace is on a paid plan (Pro, Studio).



WHEN: Addressing AC2: Add new saved response from the conversation.

THEN: The following criteria must be met:

* GIVEN: I am in a conversation detail.


* WHEN: I click on the Saved this response button.


* THEN: Show popup titled Add To Saved Responses.


* THEN: Leave Title field blank.


* THEN: Pre-populate Message field with the Coach's message (max 10,000 characters).


* THEN: Clicking Save adds the response and shows toast: Response has been saved.