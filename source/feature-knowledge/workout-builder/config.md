---
name: workout-builder
created: '2026-02-09'
updated: '2026-02-09'
source_files:
  - Workout Builder.pdf
prompt: >-
  Keep the original content exactly as-is. Only convert to clean, well-formatted
  markdown that is easy to read. Do not rewrite, or omit any content. SHOULD
  list out Terminology. SHOULD summarize at the end.
---

## 1. Core System Overview

*   **Purpose:** Comprehensive tool for Coaches to design personalized workout plans (Exercises, Sections, Workouts) and for Clients to log/track results via a mobile app.
*   **Primary User Personas:**
    *   **Coaches:** Create/manage libraries (Exercises, Sections, Workouts), assign programs to calendars, and monitor client performance.
    *   **Clients:** View instructions, execute workouts, log data (sets, reps, weight, time), and track history.

## 2. System Constraints & Global Rules

*   **Media Limits:** Video file size limit is **300 MB**. Supported formats: `.mp4`, `.mov`, `.flv`, `.3gp`, `.avi`.
*   **Exercise Attributes:**
    *   **Modality:** Exactly **1** option allowed.
    *   **Muscle Group:** Max **3** options; 1st is primary.
    *   **Movement Pattern:** Max **3** options; 1st is primary.
    *   **Tracking Fields:** Max **3** fields per exercise (e.g., Reps, Weight). Field availability depends on **Category**.
*   **Section Logic:**
    *   **Section Format:** Must be one of **Regular**, **Interval**, **AMRAP**, **Timed**, or **Freestyle**.
    *   **Section Type:** Must be one of **Workout**, **Warmup**, **Cool down**, or **Recovery**.
*   **History Storage:**
    *   **Always:** Results from **Workout** section type are saved to Exercise History.
    *   **Never:** Results from **Warmup**, **Cool down**, **Recovery**, and **Freestyle** sections are saved to Exercise History.
*   **Deletion/Hiding:**
    *   **System Exercises:** Can only be **Hidden** (cannot be restored/made visible again).
    *   **Custom Exercises:** Can be **Deleted**.

## 3. Key Workflows & Logic

1.  **Create Exercise:** Input Name/Attributes → Select **Category** (defines metrics) → Add Media → Set Advanced Settings (Equip, Alt Exercises, Tags) → Save.
2.  **Create Section:** Select **Format** (e.g., AMRAP) → Select **Type** (e.g., Workout) → Drag & Drop Exercises → Save.
3.  **Create Workout:** Select Template or New → Drag & Drop **Exercises** or **Sections** → Configure Sets/Reps/Tempo.
    *   *Trigger:* Adding >1 exercise enables **"Link as Superset"**.
4.  **1RM Configuration:** Client logs past workout (Strength) → Coach adds exercise to new workout → Select **Use %** → Input **%1RM** → System auto-calculates weight based on Personal Best.
5.  **Assign to Client:** `Client Profile` → `Training Tab` → `+ Icon` → `Add Workout` → Select Date/Workout → Save.
6.  **Client Execution (App):** Open "Today" → `Start Workout` → Input data per set → Mark Complete.

## 4. Data Entities & Relationships

*   **Exercise:** The atomic unit. Contains **Category** (links to metrics), **Modality**, and **Media**. Can have **Default Alternate Exercises** linked.
*   **Section:** Container for Exercises. Defined by **Format** (time/logic flow) and **Type** (history storage).
*   **Workout:** Container for **Exercises** and **Sections**. Assigned to Client Calendar.
*   **Superset:** Linkage of 2+ exercises within a Workout. Syncs set counts; implies back-to-back execution (A1→B1→A2→B2).
*   **Alternate Exercise:** Interchangeable option for a Main Exercise. Automatically links when Main Exercise is added. Inherits tracking fields from Main Exercise.

## 5. Edge Cases & Error Handling

*   **Editing System Exercises:** Modifying a System Exercise automatically converts it to a **Custom Exercise** (indicated by checkmark).
*   **Section Updates:** Editing a Section in the Library does **not** update previously assigned workouts; only affects future assignments.
*   **1RM Failure:** 1RM auto-calculation fails if the client has no previous logged workout for that exercise with **Category = Strength**.
*   **Alternate Exercise Swapping:** When a client swaps to an Alternate Exercise, recorded metrics (Weight/Reps) are preserved from the original slot, and history is saved under the *Alternate* exercise name.
*   **Missing Workouts (Client App):** If no workout is assigned, the client sees a "Rest Day" reminder.

## 6. Technical References

*   **Entry Points:**
    *   **Exercise Creation:** `Left menu > Library > Exercises`.
    *   **Section Creation:** `Left menu > Library > Workout > Sections`.
    *   **Workout Creation:** `Left menu > Library > Workout`.
    *   **Assign Workout:** `Client profile > Training tab > Click + icon`.
*   **Glossary:**
    *   **AMRAP:** As Many Rounds As Possible (Countdown timer).
    *   **1RM:** One Rep Max (Theoretical max weight for 1 rep).
    *   **Tempo:** Rhythm of exercise (e.g., 4s down, 1s hold, 2s up).
    *   **Superset:** Linked exercises performed consecutively.
    *   **Freestyle:** Follow-along format; no manual data entry required; no history saved.

---

<!-- source: Workout Builder.pdf -->

# Product Guideline "Workout Builder"

## TABLE OF CONTENTS

I. INTRODUCTION FEATURE
II. MINDMAP
Workout Builders
Workout Tracking
III. USER FLOW
IV. DETAILS FOR EACH FUNCTION
    * Exercises
        * Create a New Exercise
        * Manage Exercises
    * Sections
        * Create Section
    * Workouts
        * Create a Workout
        * Superset
        * 1RM
        * Alternate Exercises
    * Web
        * Assign Workout to Client
        * Workout History
    * Client App
        * Log Workout/ Tracking workout
        * Workout History in client app

## I. INTRODUCTION FEATURE

### What is Workout Builder?

Workout Builder helps Coaches easily create personalized workout plans for Clients, using a wide range of exercises to design sessions that fit each Clientʼs unique goals. Itʼs a comprehensive tool for planning and customizing workouts.

With Workout Templates, Coaches can quickly set up multi-week programs and assign them to multiple Clients with just a few clicks. These templates are flexible, allowing adjustments for various fitness goals or training phases.

### What is Workout Tracking?

Workout Tracking helps Clients easily log their workout results in the Client app, while Coaches can update or record data through the Web and Coach app. Itʼs a complete tool for tracking workout progress.

With Workout History, Coaches can quickly review and adjust Client data across multiple sessions, making it easy to monitor performance and optimize training for better results.

## II. MINDMAP

*   Workout Builders
    *   Exercises
    *   Sections
    *   Workouts
*   Workout Tracking

## III. USER FLOW

(User flow diagram - not representable in markdown)

## IV. DETAILS FOR EACH FUNCTION

### Exercises

*   **Objective:** Enable Coaches to create or edit exercises, allowing customization of workouts to align with Clients' specific goals and needs. Contains more than 2500 System Exercises.
*   **Entry Point:**
    *   Custom Exercise

#### Create a New Exercise

Fields:

1.  **Name***
2.  **Primary Focus:**
    *   Primary focus:
3.  **Modality:**
    *   Exercise modalities encompass the various types of physical activities and equipment used in training, that target specific physiological responses and adaptations within the body.
    *   You can choose 1 option for the Exercise Modality. This will show up on the Exercise Library and Exercise pop-up on the Client mobile app when tracking a workout.
4.  **Muscle Group:**
    *   Exercises can be tagged and filtered by muscle groups to allow for more effective and specific searching
    *   You can choose up to 3 options for the Exercise Muscle Group. The first selected option will be automatically marked as primary. You can click on the "Star" icon of another selected option to change the primary option.
5.  **Movement Pattern:**
    *   Exercise movement pattern categorization involves grouping exercises based on the specific body movements they entail, such as pushing, pulling, squatting, or hinging for improved search filtering functions.
    *   You can also choose up to 3 options for the Exercise Movement Pattern. The first selected option will be automatically marked as primary. You can click on the "Star" icon of another selected option to change the primary option.
6.  **Category***: Defines the exercise type, allowing up to 3 tracking fields that can be reordered by drag and drop.
    *   Impact on Metrics: When a Client logs a workout and checks the Exercise History, only tracking fields matching the Category appear on the bar chart.
        *   Example:
            *   Strength → Weight
            *   Bodyweight → Reps
            *   Timed → Time
        *   Note: Entry point of Exercise History: Client profile > Metrics tab > Exercise metrics > click on any exercise to view history
7.  **Instruction**: Guide the steps of the exercise.
8.  **Image**: Show the correct form and provide a quick visual guide.
9.  **Video**: Upload custom videos, YouTube links, YouTube short links, YouTube timestamps, and Vimeo links.
    *   File types supported: .mp4, .mov, .flv, .3gp, .avi
    *   File size limit: 300 MB
10. **Equipment**: The equipment needed for the exercise
11. **Default Alternate Exercises**: Coaches can suggest similar exercises for Clients to choose from.
    *   Impact on Workout Builder: Default Alternate Exercises automatically link to the main exercise when added to a workout, and Coaches can rearrange the order using drag and drop.
12. **Default Note**: Coaches can add exercise notes for Clients.
    *   Impact on Workout Builder: The Default Note links automatically to the main exercise when added to a workout, and can be customized by Coaches for each Client.
13. **Synonym**: Coaches can add alternative names for the exercise to optimize search results.
14. **Tag**: Coaches can use a tag to categorize Exercise or Workout.

**Categorize Exercises**

*   Option 1: Click “Filter” button from Exercise Library.
*   Option 2: Click “Filter” button from Workout Builder (Left Panel).
*   Option 3: Click Filter button from Workout Builder (Center).

**Categorize Workouts**

*   Click “Filter” button from Workout Library.

#### View Exercise List

**Sort and Search Exercise**

Coaches can quickly sort the Exercise Library by name, primary focus, category, most recently accessed, or Custom Exercises. To find a specific exercise, simply type its name in the search bar.

**Filter Exercise**

Coaches can choose to filter exercises based on System Exercise or Custom Exercise, Video availability, Tags, Category, Primary focus, Equipment.

#### Manage Exercises

*   **Edit an Existing Exercise**
    *   When editing a System Exercise, the exercise will be converted to a Custom Exercise (showing a checkmark on the Custom column of Exercise Library).
    *   The most recently edited exercise will appear at the top.
*   **Duplicate Exercise**
    *   When Coaches duplicate an exercise, a screen opens, allowing them to make changes before saving.
*   **Hide Exercise**
    *   Coaches could Hide any System Exercises by choosing Hide and remove Custom Exercises by choosing Delete from the menu.
    *   Once exercises are hidden, they cannot be restored or made visible again.
*   **Sharing Settings:**
    *   Choose whether to keep the Exercise private for the Owner or share it with other Coaches on their team.

### Sections

*   **Objective:** Define the exercise's training method.
*   **Entry Point:** Left menu > Library > Workout > Sections

#### Create Section

1.  Click “Add new section” button to open the Create Section pop-up
2.  Choose section format to open the Section details pop-up
3.  Fill in the Section details

Fields:

*   **Name***
*   **Instructions**
*   **Section Format***: Choose 1 from the 5 section formats.
    *   Regular: Displays exercises one after another, mostly used for strength workouts.
    *   Interval: Runs timer for exercise and rest.
    *   AMRAP: Track total rounds completed based on assigned time.
    *   Timed: Track total time spent based on assigned rounds.
    *   Freestyle: Best for warmups or any follow-along videos
*   **Section Type***: Choose 1 from the 5 section types.
    *   Workout: The results will be saved in Exercise History.
    *   Warmup: The results will not be saved in Exercise History.
    *   Cool down: The results will not be saved in Exercise History.
    *   Recovery: The results will not be saved in Exercise History.
*   **Add Exercise to section***
    *   Option 1: Drag & Drop Exercise from Exercise Library Left Panel.
    *   Option 2: Click Add Exercise button, then type Exercise name in the search bar and choose.

#### View Section List

**Section Library**

*   **Sort and Search Section**
    *   On the top left corner of the Section Library, Coaches can search for a Section by name.
*   **Filter Section**
    *   Coaches could also filter by Section Format or Owner.

#### Manage Section

*   **Edit/ Duplicate/ Delete Section**
    *   When Coaches update a Section in the library, it wonʼt affect Sections already assigned in a workout, but future assignments will use the new configuration.
*   **Sharing Settings**
    *   Coaches can choose whether to keep the Section private for the Owner or share it with other Coaches on their team.
    *   When a Section is shared, the Sharing icon will be highlighted to differentiate it from a private Section. The initials of the Section owner will show up next to the Section.

### Workouts

*   **Objective:** Enables Coaches to create and save workouts for assignment to Clients. A workout includes 1-n Exercise and 1-n Section.
*   **Entry Point:** Left menu > Library > Workout

#### Create a Workout

1.  Choose to Create from Template or Create New Workout.
2.  Add Section to Workout Builder
    *   Option 1: Drag & Drop Section from Section Library Left Panel.
    *   Option 2: Click Add Section button, then type Section name in the search bar and choose.
3.  Add Exercise to Workout Builder*
    *   Option 1: Drag & Drop Exercise from Exercise Library Left Panel.
    *   Option 2: Click Add Exercise button, then type Exercise name in the search bar and choose.

**Workout Builder/ Workout details**

1.  **Name***
2.  **Description** (text, link)
3.  **Exercise information:**
    *   Maximum 3 tracking fields. Ex: Reps, Weight, 1RM
    *   Exclude: Rest time
    *   Number of sets:
    *   Add / Delete Set: automatically copy all the details of the last set.
    *   Each side: Clients perform exercises for both arms or legs
        *   Ex: Lunges Exercise -Perform with the left leg forward, then switch to the right leg.
    *   Tempo: pace or rhythm of the exercise.
        *   Ex: Squats - 4 seconds down, 1 second hold, 2 seconds up.

#### Superset

When Coaches add at least 2 exercises to a workout, “Link as Superset” button will appear and the number of sets will be synced.

Ex: Exercise A and B linked as Superset with 2 sets, the order of practice will be as follows:
A1 (Set 1 of Exercise A) → B1 (Set 1 of Exercise B) → A2 (Set 2 of Exercise A) → B2 (Set 2 of Exercise B)

#### 1RM

Before using 1RM, must log a past workout using an exercise (with category = Strength).

From Client Training Calendar:

1.  Add an exercise or choose an existing exercise.
2.  Click Use %
3.  Add % of 1RM → automatically calculates weight based on Client Personal Best.

Example:

1.  Coach assigns a workout with exercise A (category = Strength, tracking field Weight, Reps)
2.  May 21, Client log workout with exercise A (Weight = 100, Reps = 1)
3.  Coach copy/paste the workout to May 22
4.  Open this workout, turn on Use%, and input the value %1RM = 50. Check the Weight:
    *   a. It shows 50 lbs

How to calculate 1RM: refer
Input Rep and Weight then wait for the result

#### Alternate Exercises

Helps Clients have multiple options to choose during their workout.

*   **Add default alternate exercises**
    *   Automatically link alternate exercises to the main exercise when added to a workout.
*   **Add alternate exercises for a single workout**

1.  Click ... of exercise
2.  Select Alternate Exercises
3.  Search and select the desired exercises
4.  Save and review your changes

Client app

*   The client can choose the exercise that they want
*   When changing the alternate exercise, all values of the tracking field are still kept
*   The history will save the record for alternate exercise

#### View Workout List

Workouts include Search, Sort, and Filter options, like Exercises and Sections.

#### Manage Workout

Workouts include Duplicate, Delete, and Sharing Settings options, like Exercises and Sections.

### Web

#### Assign Workout to Client

*   **Entry Point:** Client profile > Training tab > Click + icon > Add workout

1.  Click icon, then click “Add workout” button to select existing workout or create new workout to assign.
2.  Customize Client Training Calendar
    *   Change the calendar view (1 week, 2 weeks, and 4 weeks)
    *   Drag and Drop workout
    *   Copy and paste the individual/many workout
    *   Copy and paste the week
    *   Delete a workout/ multiple delete workout
    *   Edit an existing workout
    *   Edit an exercise within a workout
    *   Add an exercise to a workout
    *   Hide Workout: Pre-schedule clients' workouts while keeping the details hidden.

#### Workout History

*   **Entry Point:** Client profile > Training tab > click on History button

Coaches can see completed or missed workouts on Client Training Calendar

### Client App

#### Entry Point for view workout

*   Today screen: On the top screen
*   Coaching screen: Tap on the Training section

#### Log Workout/ Tracking workout

*   **Today screen**
    *   For the day with assigned workouts
        *   Tap on “Start workout” button to find Workout details.
    *   For the day without assigned workouts
        *   Clients will see a rest day reminder.
*   **Coaching screen**
    *   Tap on Training section to see current, past, and future workouts.

Note: At client setting, the coach can choose the range you would like the client to have access to on their training calendar

#### Workout Preview

*   **Single Exercise**
    *   Clients view instructions and prescribed sets from Coaches, then follow and mark completed exercises.
*   **Superset**
    *   You will be doing a couple of exercises (usually 2) back to back for each set.
    *   Follow the sets from top to bottom to complete the assigned supersets.
*   **Preview Section screen**
    *   Each section type has a different workout flow, but the starting screen remains the same. It include:
        *   Section Name
        *   Section info and section type
        *   Description of section
        *   Start section button
        *   Exercise list
        *   Can change the alternate exericse in this screen
*   **Regular section**

1.  Exercises are displayed as a list.
2.  Scroll to view and check off exercises individually or complete the entire workout at once.
*   **Interval section**
    *   Simplifies programming time-based workouts. Automatic timer cycles through exercise and rest intervals.
    *   Once the workout begins your client will see each exercise in order. Along with a timer showing work and rest periods
    *   Throughout the workout, clients will always have access to...
        *   Current exercise
        *   Time remaining in an interval.
        *   Pause button, which pauses the timer and opens a summary of the client's progress.
        *   Cancel button.
    *   Note for each side option:
        *   The app will split the exercise into two parts: right side and left side
*   **Timed section**
    *   Once the workout begins your client will see a list of the exercises, reps, and rounds that need to be completed. Along with a timer (count up) showing their progress
    *   Throughout the workout, clients will always have access to...
        *   Current round number #
        *   Timer (count up) (bottom left)
        *   Pause button, which pauses the timer and opens a summary of the client's progress
        *   Cancel button
*   **AMRAP**
    *   Clients complete as many rounds of a set workout as possible within a specific time frame (count down).
    *   Track progress by noting the total rounds completed in the assigned time.
    *   Ideal for building endurance, intensity, and goal-oriented focus.
    *   Throughout the workout, clients will always have access to...
        *   Current round number # (top)
        *   Time remaining for AMRAP workout (bottom left)
        *   Complete the Round button to check off all exercises and move to the next round
        *   Pause button (bottom right), which pauses the timer and opens a summary of the client's progress. From here, the client can also choose to save the number of rounds completed, resume the section, or end the section early
        *   Cancel button (top left corner), which stops and exits the AMRAP workout
*   **FREESTYLE**
    *   Allows Clients to complete workouts without manual data entry.
    *   Clients can mark workouts as done with a simple tap of a checkmark.
    *   All results doesnʼt save in the exercise history

#### Workout History in client app

*   **Objective**
    *   Track and store all completed workouts for easy access anytime.
    *   Provide detailed data for Coaches to review workout history.
*   **Entry Point**
    *   You screen > Activity history

Clients can tap into any completed workout to:

*   See details of the workout they completed
*   Add/change your workout rating
*   View and leave comments for the Coach.

## Terminology

*   **Workout Builder:** A tool for coaches to create personalized workout plans.
*   **Workout Tracking:** A feature that allows clients to log their workout results.
*   **System Exercises:** Pre-loaded exercises within the platform.
*   **Custom Exercises:** Exercises created or modified by coaches.
*   **Sections:** Defined exercise training methods (e.g., Regular, Interval, AMRAP, Timed, Freestyle).
*   **Superset:** Linking two or more exercises to be performed back-to-back.
*   **1RM:** One Repetition Maximum; the maximum weight one can lift for a single repetition.
*   **Alternate Exercises:** Substitute exercises clients can choose during a workout.
*   **Exercise Modality:** The type of physical activity or equipment used in training.
*   **Exercise Muscle Group:** Categorization of exercises based on targeted muscle groups.
*   **Exercise Movement Pattern:** Categorization of exercises based on body movements.

## Summary

This document outlines the "Workout Builder" product guideline, detailing its features and functionalities for coaches and clients. It covers creating workouts, tracking progress, managing exercises and sections, and utilizing features such as supersets and 1RM. The guide includes instructions for both web and client app interfaces, ensuring a comprehensive understanding of the workout planning and tracking process.
