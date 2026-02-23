

Saved Response Specifications (WEB)

1. Context & Objective
2. Feature Design
3. Specifications
3. 1. Permissions
3. 2. Acceptant Criteria
User Story 1: As a coach who frequently messages clients, I want to save and quickly insert predefined responses in chats, so that I can respond faster and maintain consistency in my communication without typing the same messages repeatedly
AC1: Add Saved Response button in Editor nav
AC2: Saved Response popup
AC3: Search box behaviors
AC4: 3-dot button behaviors
AC5: Add a new saved response
AC6: Edit a saved response
AC7: Delete a saved response
AC8: Add saved response to chat box by selecting an item in Saved Response popup
User Story 2: As a coach who frequently messages clients, I want to create a saved response from a message in the conversation, so that I add a new saved response quicker
AC1: Add “Save this response” button to Coach's non-text message
AC2: Add new saved response from the conversation
1. Context & Objective
Users might often repeat similar messages when communicating with clients, leading to inefficiency and inconsistency. The Saved Response feature allows users to create and reuse predefined responses - to streamline communication, save time, and maintain consistent tone and quality.

3. Specifications
3. 1. Permissions
“Saved Responses” feature is available is available on the Pro plan and above.
All Coaches in the workspace can use “Saved Responses” feature as long as the workspace has permission to use it.
Saved Responses list is private per user
3. 2. Acceptant Criteria
      N
User Story 1: As a coach who frequently messages clients, I want to save and quickly insert predefined responses in chats, so that I can respond faster and maintain consistency in my communication without typing the same messages repeatedly AIT-1383: [Customer Support] [Saved Response] Allow Coach to qu ickly insert saved responses in chat by using Saved Response feature in Inbox QA SUCCESS
AC1: Add
    I am in I
Saved Add a Saved Responses
Response button in a observe button next to GIF button
Editor nav conver the
                  Hover over the button will show a sation Editor tooltip: ”Saved Responses \ ”
          nav
AC2:
    I am in I click Saved Responses modal is shown
Saved
Response popup a on https://www.figma.com/design/Ad conver j9bljV5m2lwDoyMV8uEf/Inbox?nod
          Saved sation e-id=12205-83759&t=XBqWVsEyi9
          Respo
                  50aUXa-4 Connect your Figma acc nses

ount which shows list of MY saved butto responses, contains:
n
X button: on click, close the modal
OR
(updated Dec 31)
using
Search box (refer to AC3)
shortcut
  - “Create new” button
Ctrl/
  Placed in top-right corner comma
  Hovering will display as “
nd K
  Create New”
  When I click on the button, then refer to AC5
If there are no saved responses, display:
”{image}
Your saved responses list is empty.
Start by creating your first one to save time during chats.”
If having saved responses, display list of saved-response items below Search box, as:
  On the left-side of the modal, show list of title's saved responses:
  Order by latest updated time
  Divided into 2 sections:
    FREQUENTLY USED
    section
      Show the responses that the user interacts with most often.
      A responseʼs usage

count is incremented each time the response is selected (appenđe into chatbox) by the user.
Usage count is per user
If there is no frequently used saved responses, then hide this section
If having list of frequently used saved responses, then show
Top 5 most-used saved responses by that user
- If there are fewer than
5 responses, show all available responses
- Sort by
usage_count descending (most used
→ least used). When usage_count is equal, sort by title ascending (A–Z)
ALL section
List all saved responses, sort by title A-Z
Select the first saved response in the list by default
Allow user to use arrow-keys
(Up, Down) to move between responses in the list
On the right-side of the modal, show the message detail of current-selecting saved response, as:
{title}
{message_detail}

Hover over the message detail will show a 3-dot (refer to AC4)
Allow scrolling if the message is long
Hover between title of saved-
responses list to view its mesage detail
Allow to click on the title of a saved-response item to fill it in chatbox (refer to AC1)
Apply pagination:
Load every 20 items
When user scrolls down, display Load more and get the next 20 items
Footer shows list of shortcut as:
Click X button OR shortcut Esc will close the popup (updated Dec
31. 
AC3:
I am in I Search box in Saved Responses
Search box a observe popup https://www.figma.com/desig behaviors conver the n/Adj9bljV5m2lwDoyMV8uEf/Inbox?n sation Saved ode-id=12203-76586&t=VeYPtxksTXvi
Respons QgJW-4 Connect your Figma accoun es t :
popup
Empty by default, with placeholder:
“Search saved response”
When focus to the box, change placeholder to “Enter keyword...”
Allow input text to search for responses:
Display x icon when inputting text
Remove text by backspace or click on x icon

Should remove search input and show back the full list
Searching rules:
Start searching from 1 char
Search based on title and message → return all saved responses where either the title or message field contains the search keyword
Matching is case-insensitive and partial → the result is valid if the search keyword appears anywhere within either field
Searching results are shown:
If having no results found, show:
Show number of matching results below Search box:
“Search results (0)”
If having matching results found:
Show number of matching results below Search box:
“Search results
( {number_of_matche d_results} )”
Show list of results same as
AC2 above
Select the first result to view by default
Apply pagination:

                  Load every 20 items
                  When user scrolls down, display Load more and get the next 20 items
AC4: 3-
I am I click A submenu is shown, containing dot button behaviors viewin on 3-dot options:
g button
            Edit response
Saved on a
            Delete response
Respo saved nses respons popup e item
AC5: Add
I am I click Create Saved Response popup is a new saved response viewin on + shown https://www.figma.com/desig g n/Adj9bljV5m2lwDoyMV8uEf/Inbox?n
      Creat
Saved ode-id=11606-94948&t=NWLSPvgVk e
Respo zxO2jpk-4 Connect your Figma accou new nses nt :
    button popup
            Title: “Create Saved Response”
            [X] button
              On clicking X button, close the popup
            TITLE field
              Add a next to field title
              When hover over the
              Then show a tooltip:
              “Used to organize responses.
              This wonʼt appear in messages..”
              Required field

Empty by default, with placeholder: “Name this response for easy search”
Allow all characters
Allow to input maximum 140 char
  Cannot input anymore if inputted max 140 char
  If user pastes a text more than
  140 char, then cut off and paste the first 140 char into the field
MESSAGE field
Required field
Empty by default, with placeholder: “Write the full message you want to send to clilents”
Allow to input any characters
  Not allow text-formatting
  If user paste a text paragraph, clear text-formatting (if any)
Allow to input maximum 10,000
char
  Character count is shown as
  “{X}/10000”, {X} is total number of characters
  Cannot input anymore if inputted max 500 char
  If user pastes a text more than
  10,000 char, then cut off and paste the first 10,000 char into the field
Cancel button
Always enable
On clicking Cancel button, close the popup
Save button
Disable by default

Enable if having input in both
TITLE & MESSAGE fields
On clicking Save button, add a new saved response to the list.
Once successfully saved, display a toast “New Saved Response created.”
AC6: Edit
I am I click Edit Saved Response popup is shown a saved response viewin on 3-dot https://www.figma.com/design/Adj9
g button bljV5m2lwDoyMV8uEf/Inbox?node-id
Saved and =11606-94949&t=NWLSPvgVkzxO2jp
Respo click k-4 Connect your Figma account :
nses
Edit
Title: “Edit Saved Response”
popup respo [X] button. On clicking [X] button:
nse If use has made no changes, close the popup option
If user has made at least 1
changes, show the Discard change pop up:
  Title: “Discard Changes?”
  Text: “Are you sure you want to go? Changes have not been saved yet.”
  Cancel button or [X] icon → On click, close the Discard changes pop up
  Discard Changes button → On click, close the
  Discard changes pop up & back to the previous page without saving changes
TITLE field
Pre-populate the shortcut

Keep other behaviors same as
AC5:
AC5:

                  a toast “Saved Response updated successfully.”
AC7:
    I am I click A confirmation popup is shown:
Delete a saved response viewin on 3-dot
                  Title: “Delete Response?”
    g button
                  Text: “This response will be
    Saved and permanently deleted and canʼt be
    Respo click recovered.
    nses
          Delet
                  Are you sure you want to proceed?”
    popup e
                  Cancel button respo
                  On click, close the popup nse
                  OK button option
                  On click, close the popup and process to delete the response
                  Once successfully deleted, display a toast “Saved Response deleted.”
AC8: Add
    I am I click Append the full message content into saved response to chat viewin on title the chatbox, place it behind the current box by selecting g of a text (if any)
an item in
Saved Saved saved
Response popup Respo respons nses e item or popup hit
          ENTE
          R
User Story 2: As a coach who frequently messages clients, I want to create a saved response from a message in the conversation, so that I add a new saved response quicker AIT-1811: Customer Support | Sa ved Response | Quick add an existed-message to Saved Response QA SUCCESS
AC1: Add
    I am in I hover Add a button between 3-dot and https://
“Save this response”
button to a over a Reply buttons for those non-text www.fig
Coach's non-text conver non-text message of the Coach ma.com/
message sation messag design/A
                  Hover the button shows a tooltip detail e of the dj9bljV5
                  “Saved this response”
          Coach m2lwDo
                  On click the button, show add a yMV8uE
                  new saved response popup f/Inbox?
                  Note: Only show this button on node-id=
                  hovering message if the workspace

is in paid-plan including Saved 13382-7
Response feature (Pro, Studio plan) 265&t=Q
                    llQNMfF
AC2: Add
I am in I click On click the button, then show the new saved response UvKE9u from the a on popup same as AC1 above conversati Nk-4 Co on conver “Saved Adjust the popup title to “Add To nnect yo sation this
Saved Responses”
                    ur Figm detail respons
Leave Title field blank a accounte”
Pre-populate the Coach's nt button message into the Message field
  If the Coach's message is over
  10,000 characters, then cut the first 10,000 characters of the message to be filled in the field
On click [Saved] button will add that message as a new saved response, and show a toast
“Response has been saved”