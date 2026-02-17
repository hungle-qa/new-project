

Based on the provided design documents, here is the functional logic converted into the 
Given-When-Then (GWT) format. 
Feature: Coach Notifications for Workout Phase Ending 
Scenario 1: Notification for Autoflow or Standard Program Ending (UC1.1) 
● Given an "Active" client has an assigned Autoflow or Program. 
● And there are no follow-up workouts, programs, studio programs, or Autoflows assigned 
after the current phase. 
● When the current date is exactly 7 days before the last scheduled workout of that 
Autoflow or Program. 
● And the time is 9:00 AM in the Coach’s configured timezone. 
● Then the system sends an In-App Notification to the Coach Web and App. 
● And the notification message reads: "{Client Name}'s program and last workout ends 
next week ({mmm dd}). Check to assign more workouts.". 
Scenario 2: Notification for Individual Workouts (7-Day Warning) (UC1.3) 
● Given an "Active" client has an individually assigned workout or On-Demand workout. 
● And there are no follow-up items scheduled after this workout. 
● When the current date is exactly 7 days before the last workout. 
● And the time is 9:00 AM in the Coach’s configured timezone. 
● Then the system sends an In-App Notification to the Coach Web and App. 
● And the notification message reads: "{Client Name}'s last workout is in 7 days ({mmm 
dd}). Check to assign more workouts.". 
Scenario 3: Notification for Individual Workouts or Studio Programs (3-Day Warning) 
(UC1.2) 
● Given an "Active" client has an assigned individual workout, client-added workout, or 
Studio Program. 
● And there are no follow-up items scheduled after this workout. 
● And the notification is enabled (default). 
● When the current date is exactly 3 days before the last workout. 
● And the time is 9:00 AM in the Coach’s configured timezone. 
● Then the system sends an In-App Notification to the Coach Web and App. 
● And if the item is an Individual/On-Demand Workout, the message reads: "{Client 
Name}'s last workout is in 3 days ({mmm dd}). Check to assign more workouts.". 
● And if the item is a Studio Program, the message reads: "{Client Name}'s current 
studio program and last workout ends in 3 days ({mmm dd}).". 
Scenario 4: User Interaction with Notification 
● Given a coach has received a "Workout phase ends" notification. 

● When the coach clicks on the notification in the Web or App. 
● Then the system opens the client's training calendar. 
● And the calendar view focuses on the specific week containing the last workout. 
Scenario 5: Mixed Content Priority (Conflict Resolution) 
● Given the last day of a schedule contains both an Individual Workout AND a 
Program/Autoflow workout. 
● When the trigger date approaches. 
● Then the system triggers only the 7-day notification logic (UC1.1). 
● And the system suppresses the 3-day notification usually sent for individual workouts. 
Scenario 6: Last Day Content Type Conflict (Case 6) 
● Given the last scheduled day contains mixed types: On-Demand workout, Individual 
assigned workout, AND Studio Program workout. 
● When the notification is generated. 
● Then the message content must use the Individual/On-Demand workout message 
format (not the Studio Program format). 
Scenario 7: Gap in Schedule (Case 1) 
● Given a client has a Program ending on a specific date (e.g., Nov 15). 
● And there is a separate individual workout scheduled shortly after (e.g., Nov 17). 
● When calculating the notification trigger date. 
● Then the system ignores the Program end date. 
● And calculates the trigger based on the final individual workout (Nov 17). 
● And sends the notification 3 days prior to the final workout (Nov 14) rather than the 
program end. 
Scenario 8: Hidden Workouts (Case 4) 
● Given the last workout in a phase is set to "Hidden" from the client. 
● When the system checks for the "last workout". 
● Then the system includes this hidden workout in the count. 
● And triggers the notification based on the date of the hidden workout. 
Scenario 9: Coach Settings and Timezones (US2 & Case 2) 
● Given the coach changes their timezone setting to a time that has already passed 9:00 
AM for the current day. 
● When the system attempts to send a notification. 
● Then the system does not resend the notification for the current day. 
● And schedules the notification for the following days based on the new timezone. 
● But if the coach has toggled "Client's workout phase ends" to OFF in Notification 
Settings. 

● Then no In-app or Push notifications are sent. 
Scenario 10: Client Status Exclusions (Case 5) 
● Given a client status is "Archived" or "Pending". 
● And their workout phase is ending. 
● When the trigger date arrives. 
● Then the system does not send any notification. 
 