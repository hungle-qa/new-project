## Permissions / Business Rules
-   I am logged in as a Owner/Admin.
-   The Booking feature is enabled for my Workspace.
-   Session Types are a catalog of the sessions the coach offers, which gives them options to choose from when booking a session with a client, or later provides the client with options to book from.
-   Coach can create and manage the "session types" they will offer with basic information that will be shown to the client in the email communications.
-   `is_archived` = FALSE by default, meaning the session type is active.
-   Color should NOT be unique for session type.
-   Archive a session type should NOT affect to a session scheduled along with this session type.
-   Unarchive a session type should NOT affect to a session scheduled along with this session type.
-   Edited data of a session type should NOT affect the sessions scheduled along with the session type.

## US3: As a coach, I want to create reusable session types so that I can quickly offer specific services to my clients with pre-defined durations and locations.

### AC1: Entry Point
-   Given: I am on the Session Types list view
-   When: I click the "+ Add New Session Type" CTA button in the center or on the top right
-   Then:
    -   The system should open the "Create Session Type” popup overlay on the Session Types page.

### AC2: Create session type input
-   Given: I'm on Create Session Type Popup
-   When: I interact with the popup to input data
-   Then:
    -   I SHOULD be able to close the pop-up when pressing the ESC keyboard or click "x" icon.
    -   I Should NOT be able to click outside to close the pop up.
    -   The Create session type form should include the following fields and behaviors:
        -   **Number of clients:**
            -   **1:1 Session:**
                -   Display primary label "1:1 Session" and secondary label "1:1 training, check-in, etc."
                -   Should be selected by default.
            -   **Group session:**
                -   Display primary label “Group session" and secondary label "Class, webinars, etc."
                -   Display tag "Coming soon" on the top right corner of session.
                -   When coach hover on, display "block" icon under the cursor (indicating it's not selectable).
        -   **Name:**
            -   Required.
            -   Should auto-focus on the "Name" field at the Create Session Type popup first open so coach can start typing immediately.
            -   Focus on the field, should still show the place holder text until coach typing.
            -   Label: Name.
            -   Place holder text: e.g. Personal Training session.
            -   Limit chars: 100 chars.
            -   When coach has typed 95 characters, should start show chars counter.
                -   Format: `{number}/100` with number is the current number of characters typed.
            -   When it reaches limitation of 100 chars, should block the input cursor.
            -   The system should automatically trim all redundant space characters at the beginning and end of the name value.
        -   **Session type color:**
            -   Displayed next to Name field.
            -   Default to "Blue".
            -   On click, should display the color list (Have hover state).
            -   The Color should be displayed as per this order (Updated on Feb 24, 2026):
                -   1. Red
                -   2. Orange
                -   3. Yellow
                -   4. Green
                -   5. Turquoise Cyan (Updated on Feb 26, 2026)
                -   6. Dark Cyan
                -   7. Blue
                -   8. Purple
                -   9. Violet
                -   10. Gray
            -   The selected one should be showed with the "checked" icon inside.
            -   Allow coach to select one of any available color.
        -   **Duration:**
            -   Required.
            -   Default to 30 min.
            -   When coach select the duration field, the system should:
                -   Highlight the entire current value (text selection) to indicate the field is editable.
            -   Should display the available option in a dropdown list (15 min, 30 min, 45 min, 60 min, 90 min, 120 min) - have hover state.
                -   I can select one of the available option.
                -   Selected option should have a tick icon on the left side.
                -   Click on an available option on the dropdown (have hover state) should:
                    -   Change the selected item.
                    -   Close the dropdown.
                    -   Selected item should be displayed on Duration field.
            -   When I start typing a numeric value into the Duration field, the system should:
                -   Replace the currently selected value with the typed input.
                -   Accept only numeric input `>=1`.
            -   When I type a value that matches one of the available duration options, the system should:
                -   Visually highlight the matching option in the dropdown (same as hover state).
            -   Given I have typed a value into the Duration field, When I press the Enter key or click outside the Duration field and the dropdown, the system should:
                -   Apply the current input value to the Duration field.
                -   Close the dropdown.
        -   **Location (required):**
            -   Have hover state for the available options.
            -   **In-person:**
                -   Should be selected by default.
                -   If selected, should show "Add address (optional)" and "Add location note (optional)" - both are optional, have hover state.
                -   **Add address (optional):**
                    -   Limit chars: 500.
                    -   When it reaches limitation of 500 chars, should block the input cursor.
                -   **Add location note (optional):**
                    -   Limit chars: 500.
                    -   When it reaches limitation of 500 chars, should block the input cursor.
            -   **Phone call:**
                -   If selected, should show the checkbox option:
                    -   Label: Collect client's phone number during booking.
                    -   Default selected.
                    -   Coach can uncheck/check the checkbox.
            -   **Video call:**
                -   If selected, should show the message "You will need to provide your own video conferencing link to the client. Integrations coming soon!".
        -   **Description (Optional):**
            -   **Tooltip:**
                -   When coach hover on the "i" icon, should show tooltip "This description will be included in the booking confirmation and reminder emails sent to the client.".
            -   **Input field:**
                -   Limit chars: 10,000.
                -   When it reaches limitation of 10,000 chars, should block the input cursor.
                -   Handle scrolling inside the paragraph textbox in the case the input text is long.

### AC3: Save & Validation (Success)
-   Given: I click "Create" button
-   When: All required fields are inputted and the API call is successful
-   Then:
    -   Save input data to database.
    -   The `is_archived` status should be FALSE by default.
    -   Close the popup.
    -   Show a success toast on the top right corner of the screen.
        -   Message: "Session type has been created."
        -   Display for 5 seconds then close it.
        -   Coach can click on "x" icon on the right side of toast message to close it.
        -   If coach hovers on the toast message, it will be kept displaying while hovering.
    -   Refresh the Session Type list to include the new entry.
    -   Session type just created should be an `Active` one, even if Coach is at the "Archived" tab and triggers session type creation.
    -   Data saved in `session_type` table in Booking Microservice.

### AC3: Save & Validation (Missing Required Fields)
-   Given: I click "Create" button
-   When: There are still required fields left empty
-   Then:
    -   Display inline error messages for each empty required field.
        -   Name: "Please add a session name"
        -   Duration: "Please add duration"
    -   Keep all the input data (if any) with the popup open.

### AC3: Save & Validation (API Failure)
-   Given: I click "Create" button
-   When: The API call is failed to save the session type
-   Then:
    -   Keep the modal open.
    -   Preserve all user-entered changes.
    -   Display an error state (toast message).
    -   Allow retry by clicking Update again.

### AC4: Cancel and close [unsaved changes]
-   Given: I have input data to any of the fields in the Create Session Type popup
-   When: I click on "Cancel" button OR "x" icon on the top right corner
-   Then:
    -   Should show "Discard Changes?" popup.
        -   Label: "Discard changes?"
        -   Message: "Are you sure you want to go? Changes have not been saved yet."
        -   CTA buttons:
            -   "Cancel":
                -   On click, Close the Discard changes popup and Keep input data.
            -   "Discard Changes":
                -   On click, Close the discard changes popup, Close the create session type popup, and Don't save anything.
        -   The "x" icon on the popup:
            -   On click, has the same behavior as the "Cancel" CTA button.

### AC5: Keyboard & Accessibility Interactions
-   Given: I'm on Create Session Type Popup
-   When: I interact with keyboard/accessibility features on the loaded popup
-   Then:
    -   **Tab key:**
        -   Should move focus through:
            -   Data input fields
            -   CTA buttons
    -   **Enter key:**
        -   Should activate focused interactive elements.
    -   **Focus state:**
        -   Focused elements should display a visible focus indicator.

## US4: As a coach, I can see the list of session types so that I can manage my service offerings efficiently and understand what is available for client booking.

### AC1: Entry point - Access Session type list
-   Given: I am on Booking menu
-   When: I click on the "Session Types" sub-menu in the left sidebar
-   Then:
    -   The system should navigate me to the Session Types page.
    -   **URL:**
        -   Active tab: `app.everfit.io/booking/session-types?tab=active`
        -   Archived tab: `app.everfit.io/booking/session-types?tab=archived`
    -   The page header should display:
        -   Title: Session Types.
        -   Tabs: Active (default) | Archived.
            -   Active: display the active session types.
            -   Archived: display the archived session types.
        -   The Search box should be visible under the page title.
        -   The "+ Add New Session Type" CTA should be visible at the top-right corner.

### AC2: Empty State Display
-   Given: There are no session types existing
-   When: I access to Session types page
-   Then:
    -   Should display the session types list:
        -   If no sessions exist, display the "Zero State" illustration with the "+ Add New Session Type" button in the center.
    -   When I click the CTA (e.g. "+ Add New Session Type" button):
        -   The system should initiate the Create Session Type flow (US3. Session Type Creation).

### AC3: Page Loading Behavior
-   Given: I access to Session types page
-   When: The Session types list page is loading
-   Then:
    -   During loading time:
        -   The system should display skeleton loaders for:
            -   Table rows (4 rows)
            -   Column names
        -   No actual session data should be visible until loading completes:
            -   Session type
            -   Duration
            -   Location
            -   Number of clients
            -   Most recent
    -   Data should be loaded and response within 5 seconds.
    -   Should load 20 items per batch based on the selected page.
    -   When data loading finishes:
        -   Skeleton loaders should be replaced by actual session type data.
        -   The list should render without page refresh or layout shift.
    -   When the first attempt to load data has failed:
        -   The system should automatically retry up to 3 times.
        -   If loading data has still failed after 3 retries, the system should show the error state as current logic.

### AC4: Session Type List Table Structure
-   Given: Session types exist
-   When: I access to Session type page
-   Then:
    -   The system should display a table with the following columns:
        -   Session type
        -   Duration
        -   Location
        -   Number of clients
        -   Most recent
        -   Action menu (ellipsis icon)
    -   **Hover behavior:**
        -   On hover over a session type row, the row background should change to indicate hover state.
    -   **Column content behavior:**
        -   Each row should represent one session type.
        -   Long text (e.g. session name or description preview) should:
            -   Be truncated to fit the column width.
            -   Not break table layout.
            -   Display "..." for the remaining text at the end of the row.
        -   **Content details:**
            -   **Session type column:**
                -   Display the total number of session types in the header (e.g., "Session Type (6)").
                -   Content:
                    -   Name as primary.
                    -   Description as secondary (if provided).
                    -   Display description to maximum 2 rows.
                    -   If there is remaining text, display "..." for the rest.
            -   **Duration:**
                -   Content: Duration of the session type in minutes (min).
            -   **Location:**
                -   Content: Location type: In-person, Phone call, Video call.
                -   For In-person type, display the address (if any).
            -   **Number of clients:**
                -   Content: "1:1 session" or "Group session".
            -   **Most recent:**
                -   Content: Display the duration between the latest update timestamp to the current time (e.g., 5s, 1m, 59m, 1h, 6d, 1w, 5w, 1y) based on internal logic.
            -   **Action menu:**
                -   Should not display the column name in the header.
                -   Display contextual dropdown menu (3 dot icon).
                -   On hover, should display a tooltip says "More options".

### AC5: Action Menu (Active Session Type)
-   Given: The Session Types list is displayed <br> The session type is active
-   When: I click the Action menu icon on a row
-   Then:
    -   Should display a contextual dropdown menu aligned to the icon, containing:
        -   Edit
        -   Archive
    -   The dropdown should overlay above the table content.
    -   Clicking outside the menu should close it.

### AC5: Action Menu (Archived Session Type)
-   Given: The Session Types list is displayed <br> The session type is archived
-   When: I click the Action menu icon on a row
-   Then:
    -   Should display a contextual dropdown menu aligned to the icon, containing:
        -   Edit
        -   Unarchive
    -   The dropdown should overlay above the table content.
    -   Clicking outside the menu should close it.

### AC6: Sorting Behavior
-   Given: The Session Type list is loaded
-   When: The list is displayed
-   Then:
    -   **Sortable columns:**
        -   Name
        -   Duration
        -   Most recent (Should sort latest on top by default)
    -   **Sort interaction:**
        -   When I click on a sortable column header:
            -   The system should sort the list by that column.
            -   The first click should apply ascending order, with the arrow pointed down.
            -   A second click should apply descending order, with the arrow pointed up.
            -   The active sort column should display a visual indicator.
    -   **Sorting persistence:**
        -   Sorting should be preserved while:
            -   Switching between tabs
            -   Paginating within the same tab
        -   Sorting should be back to default when the page is loaded.

### AC7: Tab Switching - Active / Archived
-   Given: I first land on the page
-   When: The page is loaded
-   Then:
    -   The Active tab should be selected by default.
        -   Fetch and display active session types.
        -   Default pagination to the first page.
-   When: I click the Archived tab
-   Then:
    -   The system should:
        -   Highlight the Archived tab as active.
        -   Fetch and display archived session types.
        -   Reset pagination to the first page.

### AC8: Pagination Behavior
-   Given: The number of session types exceeds the page limit
-   When: The page is loaded
-   Then:
    -   The system should display pagination controls at the bottom of the list.
    -   Pagination should include:
        -   Current page indicator
        -   Total item count
    -   Page size behavior consistent with design (e.g., `< 1-20 of 21 >`).
    -   When I click a pagination control:
        -   The system should load the corresponding page.
    -   The list should update without all pages reload.
    -   Scroll position should reset to the top of the list.

### AC9: Scroll Behavior
-   Given: The list height exceeds the viewport
-   When: I scroll on the page
-   Then:
    -   The system should allow vertical scrolling within the page.
    -   Coach can vertically scroll within a page.
    -   The table header row should remain visible while scrolling.

### AC10: Keyboard & Accessibility Interactions
-   Given: I'm on the Session type page
-   When: I interact with keyboard/accessibility features on the loaded page
-   Then:
    -   **Tab key:**
        -   Should move focus through:
            -   Search box
            -   "Add New Session type" CTA button
            -   Tabs
    -   **Enter key:**
        -   Should activate focused interactive elements.
    -   **Focus state:**
        -   Focused elements should display a visible focus indicator.

## US5: As a coach, I can search for a session type so that I can easily find a session type.

### AC1: Entry Point - Search Availability
-   Given: I am on the Booking → Session Types page
-   When: The page is loaded
-   Then:
    -   The system should display a Search input field at the top left of the Session Types list.
    -   The Search input should be visible in both tabs:
        -   Active
        -   Archived

### AC2: Search Input - Default State & Focus Behavior
-   Given: I am on the Booking → Session Types page
-   When: The Session Types page is first loaded
-   Then:
    -   The Search input should be empty by default.
    -   The input should display placeholder text "Search session type name”.
    -   The Search input should NOT be auto-focused on page load.
-   When: I hover over the Search input
-   Then:
    -   The input should display a hover state (border or background highlight).
-   When: I click into the Search input
-   Then:
    -   The cursor should appear in the input.
    -   The input should display a focused state.

### AC3: Search Input - Typing & Trigger Behavior
-   Given: I am on Session Type page
-   When: I am focused on the Search input
-   Then:
    -   **Typing behavior:**
        -   The system should allow free-text input.
        -   Input should support:
            -   Uppercase and lowercase characters
            -   Numbers
            -   Spaces
    -   **Search trigger:**
        -   The system should trigger search:
            -   Automatically after a short debounce (200ms)
            -   OR On pressing the Enter key
        -   The list should update without full page reload.
    -   **Matching results:**
        -   The system should display only session types:
            -   Whose name contains the search keyword.
        -   Matching should be:
            -   Case-insensitive.
        -   All existing table behaviors should still apply:
            -   Hover on rows
            -   Action menu access
            -   Sorting
            -   Pagination
    -   **Switch tabs search:**
        -   Given I am searching on a tab (Active/Archived)
        -   When I switch to other tab
        -   Then the system should:
            -   Apply the same search keyword to archived session types.
            -   Only session types belonging to that tab matching the keyword should be displayed.

### AC4: Page Loading Behavior During Search
-   Given: I have typed into search input
-   When: A search request is in progress
-   Then:
    -   Should keep displaying the existing data in the list area.
    -   Should display the loading processing bar.
-   When: The search request completes
-   Then:
    -   Existing data should be replaced by the search result.
    -   The page layout should remain stable (no layout shift).

### AC5: No Search Result State
-   Given: I have typed into search input
-   When: The search keyword returns no matching results
-   Then:
    -   The system should display an empty state message: “No session types found.".
    -   The table rows should not be displayed.
    -   Pagination controls should be hidden.

### AC6: Clearing Search Input
-   Given: I have typed into search input
-   When: I manually delete all text from the Search input
-   Then:
    -   The system should:
        -   Reset the list to the default unsearched state.
        -   Reload data for the currently active tab.
    -   Sorting state should be preserved if previously applied.

### AC7: Interaction with Sorting
-   Given: I have typed into search input
-   When: A search keyword is applied
-   Then:
    -   **Sorting behavior:**
        -   Sorting should continue to work on the filtered results.
        -   Clicking a sortable column header should:
            -   Sort only the searched results.
            -   Maintain the active search keyword.
    -   **Persistence:**
        -   Sorting state should persist:
            -   While typing new search keywords.
            -   While switching tabs.

### AC8: Interaction with Pagination
-   Given: The searched results exceed one page
-   When: The search results is loaded
-   Then:
    -   The system should display pagination controls.
    -   Pagination should apply only to searched results.
-   When: I navigate between pages
-   Then:
    -   The search keyword should remain applied.
    -   The system should fetch results for the selected page only.
-   When: I update the search keyword
-   Then:
    -   Pagination should reset to page 1.

### AC9: Keyboard Interactions (Search Input)
-   Given: I am focused on the Search input
-   When: I interact with keyboard
-   Then:
    -   **Enter key:**
        -   Should trigger search if debounce is not applied.
    -   **Tab key:**
        -   Should move focus out of the Search input to the next interactive element.

### AC10: Error State - Search Failure
-   Given: I have typed into search input
-   When: The search API request fails
-   Then:
    -   The system should display an error state as current logic.
    -   The list should not display partial results.
    -   The search keyword should remain in the input for retry.

## US6: As a coach, I can view a session type's details so that I can understand what the session include before creating or booking a session.

### AC1: Open session type details from list
-   Given: I am a logged-in coach
-   When: I click on a session type row on the session type page OR I click on a session type URL OR I click on "Edit" button of a session type from the contextual menu inside three-dot icon
-   Then:
    -   The system should allow me to click on everywhere on the Session type row (except the three-dot icon) to view a session type details.
    -   Should open the session type popup.
        -   All input fields should be populated only after data is fully loaded.
    -   The page URL should reflect the session type route: `https://app.everfit.io/home/booking/session-types/:id/view?tab=active`.
    -   The background page should be dimmed with a modal overlay.
    -   Scrolling on the background page should be disabled.
    -   If there is no value change made in the popup, the system should keep the “Update” button disabled and the “Cancel” button enabled.
    -   On hover the "Update" button, the system should display "block" icon if it is disabled.
    -   Should allow coach to edit session type on the popup (refer to US7. Edit Session Type for details).

### AC2: Close modal behavior
-   Given: The Session Type popup is open
-   When: I click the X icon OR The Cancel button
-   Then:
    -   Should close the popup.
    -   Return me to the Session Types list.
    -   No data should be changed.

## US7: As a coach, I can edit a session type so that I can update its details to reflect my current offerings.

### AC1: Entry Point & Edit Mode Trigger
-   Given: The Session Type modal is open in view mode
-   When: I modify any editable field
-   Then:
    -   If there is no value change, the system should keep the “Update” button at disable state.
        -   On hover the “Update” button, the system should display "block" icon.
    -   If there is value change on the editable fields, the system should enable the "Update” button.
    -   The system should automatically switch the modal to edit mode.
    -   Should show the secondary label: "Changes affect new bookings only, scheduled sessions will not be modified."

### AC2: Saving Updates (Success)
-   Given: The modal is in edit mode
-   When: I click Update and the update is successful
-   Then:
    -   During update in-progress state:
        -   Should disable the Update button.
        -   Should prevent duplicate submissions until the request completes.
    -   Should save the updated session type data.
        -   `updated_at` should be updated with the current timestamp.
    -   Should close the modal.
    -   Should display a toast message on top right of the page.
        -   Message: "Session type has been updated."

### AC2: Saving Updates (Failure)
-   Given: The modal is in edit mode
-   When: I click Update and the update fails
-   Then:
    -   During update in-progress state:
        -   Should disable the Update button.
        -   Should prevent duplicate submissions until the request completes.
    -   Keep the modal open.
    -   Preserve all user-entered changes.
    -   Display an error state (toast message).
    -   Allow retry by clicking Update again.

### AC3: Edit an archived session type
-   Given: I am on the Archived tab and there is archived session type existed
-   When: I trigger edit a session type
-   Then:
    -   All editing behavior should follow the same as editing an active session type (refer AC1 & AC2 of US7).
    -   After editing, the `is_archived` status should NOT be changed.

## US8: As a coach, I can archive a session type so that it is no longer available for booking new sessions, while existing sessions remain unchanged.

### AC1: Entry Point - Archive Action
-   Given: I am on Session Type page/Active tab and there is an active session type
-   When: I click the three-dot icon on a specific active session type row
-   Then:
    -   The system should display a context menu (with hover state) containing:
        -   Edit
        -   Archive

### AC2: Confirmation modal (Archive)
-   Given: The contextual menu of a session type is displayed
-   When: I click on "Archive" button
-   Then:
    -   Should display a confirmation popup.
    -   The modal should contain:
        -   Title: "Archive Session Type?"
        -   Description text explaining: "Are you sure you want to archive this session type? It will no longer be available for booking new sessions. All existing sessions on your calendar will remain unchanged."
        -   Two actions:
            -   Cancel
            -   Archive (focused)
-   When: I click Cancel OR the "x" icon on the top right corner of the confirmation modal
-   Then:
    -   Close the confirmation modal.
    -   Return me to the Session Types list.
    -   Make no changes to the session type.
-   When: I click Archive and the archive request is successful
-   Then:
    -   Trigger the archive action for the selected session type.
    -   Disable the Archive button to prevent duplicate submissions.
    -   Close the confirmation popup.
    -   Mark the selected session type as archived:
        -   `is_archived` should be updated to TRUE.
        -   `archived_at` should be updated with the current timestamp.
        -   `updated_at` should be updated with the current timestamp.
    -   Display a toast message: "Session type has been archived."
    -   The archived session type should appear on the Archived tab.
-   When: I click Archive and the archive request fails
-   Then:
    -   Keep the session type in the Active tab.
    -   Display an error message: "Failed to archive session type. Please try again."
    -   Allow the user to retry the archive action.

### AC3: Tabs, Sorting & Pagination Consistency (Archive)
-   Given: A session type is archived
-   When: The session type page is loaded
-   Then:
    -   Should keep the current sorting rules for the remaining list.
    -   Should refresh the current page and pull the next item forward if available.
-   Given: I am on the Active tab <br> An item is archived
-   When: An archive action succeeds
-   Then:
    -   The system should keep me on the Active tab until I take another action.

## US9: As a coach, I can unarchive a session type so that it becomes available for use again.

### AC1: Entry Point
-   Given: I am on the Archived tab and there is an archived session type
-   When: I click on the action menu (three dots) on an archived session type row
-   Then:
    -   The system should display a contextual menu (with hover state) containing:
        -   Edit
        -   Unarchive

### AC2: Unarchive session type
-   Given: The action menu is open
-   When: I click Unarchive and the unarchive action succeeds
-   Then:
    -   The system should immediately process the unarchive action.
    -   The system should display a toast notification with the message "Session type has been unarchived." in the top right corner.
    -   Remove the session type from the Archived tab.
    -   Move it back to Active tab.
    -   Mark the selected session type as active in DB:
        -   `is_archived` should be updated to FALSE.
        -   `archived_at` should be removed to null.
        -   `updated_at` should be updated with the current timestamp.
-   When: I click Unarchive and the unarchive action fails due to a system or network error
-   Then:
    -   The system should display an error toast.
        -   Text: "Failed to unarchive session type. Please try again."
    -   The session type should remain in the Archived list.

### AC3: Tabs, Sorting & Pagination Consistency (Unarchive)
-   Given: A session type is unarchived
-   When: The session type page is loaded
-   Then:
    -   Should keep the current sorting rules to the remaining list.
    -   Should refresh the current page and pull the next item forward if available.