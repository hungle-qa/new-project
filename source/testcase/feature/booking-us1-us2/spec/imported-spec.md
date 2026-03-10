## Permissions / Business Rules
- Trainer role is out of scope in P1.0.
- We don't need to handle hiding the Booking Feature from Trainer role because we intend to only enable Booking feature for WS which only has Owner/Admin in P1.
- We also don't need to consider how Booking feature looks like from the Trainer account for now - will take care later on.

## US1: As an Everfit Admin/Employee, I want to enable or disable the Booking feature for specific workspaces so that I can manage feature access in the first stage

### AC1: Add Booking Toggle to Workspace Features
- Given: I am on the Workspace Detail page in the CMS
- When: I scroll in the "Features" grid section
- Then:
  - I should see a new toggle card labeled "Booking" at the bottom of the grid.

### AC2: Toggle State Change (ON)
- Given: The "Booking" toggle is currently [OFF]
- When: I click the toggle to [ON]
- Then:
  - I can be able to click on the toggle button to turn it ON or OFF
  - The toggle button should be displayed as "ON"
  - The system immediately updates the Workspace configuration and a "Success" toast appears.
  - The "Booking" menu becomes visible to all Coaches in that Workspace.

### AC3: Persisted State on Refresh
- Given: I have changed the toggle state
- When: I refresh the CMS page or navigate away and back
- Then:
  - The toggle should reflect the updated state.

### AC4: Toggle State Change (OFF)
- Given: A workspace had Booking feature turned ON and they had related data
- When: The feature toggle is OFF
- Then:
  - The Booking feature on Coach Web App should be hidden.
  - The WS data in Booking scope should be persisted in our database.

## US2: As a Owner or Admin of a Workspace that has Booking feature enabled, I want to access to Booking feature so that I can use this feature

### AC1: Eligibility & Access Control
- Given: I am a Workspace Owner or Admin and the Booking feature is enabled for my workspace
- When: I am logged into the system
- Then:
  - The system should display the Booking item in the left-side navigation
  - The Booking label should display a "BETA” tag next to it
  - On hover:
    - Should display background highlight
    - Should display the contextual dropdown menu:
      - Calendar
      - Session Type
  - On click:
    - Given I am using a browser where no Booking navigation history has been stored (no relevant browser cookie exists)
    - When I click on the Booking menu in the left navigation
    - Then:
      - The system should navigate me to the Calendar page by default
      - The system should mark Calendar as the active menu item within Booking
      - The system should expand the Booking submenu and visually highlight Calendar
      - The system should store the visited page (Calendar) as the last visited Booking page in a browser cookie
    - Given I am a coach who has previously visited a Booking sub-page And a valid last-visited Booking page is stored in the browser cookie
    - When I click on the Booking menu
    - Then:
      - The system should automatically navigate me to the last visited Booking page
      - The system should expand the Booking submenu
      - The system should visually highlight the restored page as active
  - Page URL:
    - Calendar: /home/booking/calendar?mode=(day|week|month)&start-date=YYYY-MM-DD&end-date=YYYY-MM-DD
    - Session type:<br>Active tab: app.everfit.io/booking/session-types?tab=active<br>Archived tab: app.everfit.io/booking/session-types?tab=archived
  - On the bottom of the lefthand side sub menu:
    - Display button “Learn more about Booking"
    - On click:
      - Should open Booking help article page on the new tab (TBD)

### AC2: Disabled / Hidden State
- Given: I am a Workspace Owner/Admin and the Booking feature is not enabled for my workspace
- When: I am logged into the system
- Then:
  - Booking menu navigation item should NOT visible
  - I should NOT be able to access to any pages inside Booking feature via URL

### AC3: Mapping user's terminology for Booking feature
- Given: I am a Workspace Owner or Admin and the Booking feature is enabled for my workspace
- When: I access and use the Booking feature on Coach Web App
- Then:
  - The system should apply the User Terminology settings configured in My Account to all text displayed within the Booking feature
  - Replace all occurrences of the terms "client" and "clients" with the value defined in [Client Terminology]
  - Replace all occurrences of the terms "coach" and "coaches" with the value defined in [Coach Terminology]
  - The system should apply the configured terminology consistently across:
    - Labels
    - Field placeholders
    - Helper text
    - Empty states
    - Tooltips
    - Notifications and messages related to Booking
  - When I update the Client Terminology or Coach Terminology in My Account
  - Then:
    - The system should reflect the updated terminology immediately in the Booking feature without requiring a page reload