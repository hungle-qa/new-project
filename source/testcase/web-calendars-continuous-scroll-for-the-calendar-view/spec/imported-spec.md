# Feature Specification

## Overview

This document outlines the specifications for the continuous scrolling feature in the web application's calendar views (Training Calendar and Task Calendar). It covers dynamic date updates, sticky month labels, date picker enhancements, scrollable date ranges, week preservation across modes, initial calendar loading, date selection limitations, and auto-highlighting in the selector. It also specifies the behavior when a skeleton is displayed during data loading. This feature applies to the Training Calendar's Assignment, History, and Task tabs.

## User Flows

1.  **Scrolling to View More Content:** User scrolls vertically within the Training or Task Calendar to view more content without using navigation icons.
2.  **Dynamic Date Update:** User scrolls, and the calendar select dropdown updates in real-time to reflect the visible date range.
3.  **Sticky Month Label:** User scrolls; a sticky month label appears, reflecting the month of the first day in the visible week.  The label disappears when scrolling stops.
4.  **Year Transition:** User scrolls to a week spanning two years, the date picker header updates to show the correct year range.
5.  **Mode Switching:** User switches between 1-week, 2-week, and 4-week calendar modes; the calendar remains on the week initially viewed.
6.  **Initial Load:** User opens the calendar; the current week is displayed.
7.  **Date Selection:** User selects a date using the date picker; the calendar scrolls to that week, and workout data is shown for that week.
8.  **Scrolling and Highlighting:** User scrolls the calendar, and the highlighted date in the selector automatically updates to reflect the currently displayed week.
9.  **Data Loading:** User performs an action that triggers data fetching (changing week range, scrolling, switching clients, navigating dates, refreshing, re-entering); skeleton loaders appear until data is loaded.

## Requirements

**1. Dynamic Start/End Date Updates While Scrolling**

*   The start and end dates displayed in the calendar select dropdown must update dynamically in real-time as the user scrolls vertically through the workout calendar.
*   This behavior is dependent on the current calendar mode (1 Week, 2 Week, or 4 Week).

**2. Sticky Month Label on Scrolling**

*   A sticky month label should appear when the user scrolls up or down through the Training Assignment calendar.
*   The label should be based on the month of the first cell in the first visible week.
*   The label should remain fixed at the top during scrolling.
*   When the first visible week changes to a different month, the label must update accordingly.
*   When the user stops scrolling, the month label must fade/hide, and the interface should return to showing the day number inside each cell as normal.

**3. Show Month/Year Label in the Date Picker**

*   The date picker header should display a "Month Day – Month Day, Year" label for the visible week when scrolling up or down to a week that crosses into the previous year or the next year.
*   For weeks spanning two years, the year in the label must follow the year that the week belongs to (the current year context of the calendar).

**4. Scroll Across Years (Date Range Limitation)**

*   The calendar date range is limited to 52 weeks into the past and 52 weeks into the future from the current date for the Assignment, History, and Task tabs.

**5. Preserve Week When Changing Modes**

*   The calendar must remain on the same week the user was viewing before changing calendar modes (1, 2, or 4 Week).

**6. Initial Load Shows Current Week**

*   The calendar must display the current week (based on system time) upon initial load.

**7. Calendar Select Date Limit & Sync**

*   Date selection via the calendar selector is limited to a range of +/- 52 weeks from the current date.
*   Upon date selection, the calendar scrolls to the corresponding week and displays the associated workout data.

**8. Auto-Highlight Date in Selector on Scroll**

*   The highlighted date in the calendar selector automatically updates based on the currently visible week in the calendar view.

**9. Skeleton Loading**

*   Skeleton loaders should be displayed in place of each day cell while the Training Assignment calendar is fetching data for the following scenarios:
    *   Changing week range (1W / 2W / 4W)
    *   Scrolling to weeks not yet loaded (virtualized loading)
    *   Switching clients
    *   Navigating between dates (previous/next arrows, Today)
    *   Refreshing or re-entering the tab

## Acceptance Criteria

**1. Dynamic Start/End Date Updates While Scrolling**

| Criteria | Expected Result |
|---|---|
| Scroll the calendar vertically | The start and end dates in the calendar select dropdown update in real-time. |
| Change calendar modes (1, 2, 4 Week) | The start and end date update functionality still works after changing modes |
| Scroll quickly through the calendar | Ensure no significant performance lag in date updates. |

**2. Sticky Month Label on Scrolling**

| Criteria | Expected Result |
|---|---|
| Scroll up or down | A sticky month label appears at the top of the calendar view based on the first visible week. |
| Continue Scrolling within the same month | The sticky label remains fixed and does not change. |
| Scroll to a different month | The sticky label updates to reflect the new month. |
| Stop Scrolling | The sticky month label fades/hides after a brief delay. |

**3. Show Month/Year Label in the Date Picker**

| Criteria | Expected Result |
|---|---|
| Scroll to a week spanning two years (e.g., Dec 29 - Jan 4) | The date picker header displays the correct month and year range (e.g., "Dec 29 - Jan 4, YEAR"). Year should reflect the year the week belongs to. |
| Select a week with a specific Year | The date picker displays the correct year. |

**4. Scroll Across Years (Date Range Limitation)**

| Criteria | Expected Result |
|---|---|
| Attempt to scroll more than 52 weeks into the past from the current date | The calendar stops at the 52-week boundary. |
| Attempt to scroll more than 52 weeks into the future from the current date | The calendar stops at the 52-week boundary. |
| Select a date outside the 52-week range using the date picker | The calendar does not navigate to the selected date and a message indicating date outside allowed range does not appear |

**5. Preserve Week When Changing Modes**

| Criteria | Expected Result |
|---|---|
| Select a specific week in the calendar | The selected week is visible. |
| Switch between 1, 2, and 4-week modes | The calendar remains focused on the previously selected week. |

**6. Initial Load Shows Current Week**

| Criteria | Expected Result |
|---|---|
| Open the calendar for the first time | The calendar displays the current week based on the system time. |
| Verify after time zone change | Calendar defaults to correct week based on system time after the timezone is changed. |

**7. Calendar Select Date Limit & Sync**

| Criteria | Expected Result |
|---|---|
| Select a date within the allowed date range (+/- 52 weeks) | The calendar scrolls to the corresponding week and displays the associated workout data. |
| Select a date outside the allowed date range (+/- 52 weeks) | The calendar does not navigate to the selected date. No error message needs to be displayed. |

**8. Auto-Highlight Date in Selector on Scroll**

| Criteria | Expected Result |
|---|---|
| Scroll the calendar | The highlighted date in the calendar selector automatically updates to reflect the visible week. |
| Quickly Scroll through the calendar | The highlighted date updates smoothly without delays. |

**9. Skeleton Loading**

| Criteria | Expected Result |
|---|---|
| Change week range (1W / 2W / 4W) | Skeleton loaders appear in place of the day cells while data is loading. |
| Scroll to weeks not yet loaded (virtualized loading) | Skeleton loaders appear in place of the day cells while data is loading. |
| Switch Clients | Skeleton loaders appear in place of the day cells while data is loading. |
| Navigate between dates (previous/next arrows, Today) | Skeleton loaders appear in place of the day cells while data is loading. |
| Refresh or re-enter the tab | Skeleton loaders appear in place of the day cells while data is loading. |
| Data loaded | The skeleton loaders disappear and the actual data is displayed. |