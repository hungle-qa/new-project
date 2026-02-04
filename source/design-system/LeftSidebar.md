---
name: LeftSidebar
category: navigation
created: 2026-02-04
status: draft
---

# LeftSidebar

## Preview
A hierarchical navigation sidebar with main sections and sub-sections. Features:
- Title "Library" at top
- Main sections (Exercises, Workouts, Programs, etc.)
- Sub-sections indented under parent sections
- Hover state with gray background and shadow
- Selected state with white background and shadow
- Collapsible via external trigger (hamburger button in header)

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage
Use for main navigation in content management systems. Supports hierarchical structure with main sections and sub-sections. Collapses when triggered by external hamburger button.

## HTML
```html
<aside class="sidebar" id="leftSidebar">
  <div class="sidebar-header">
    <h2 class="sidebar-title">Library</h2>
  </div>

  <nav class="sidebar-nav">
    <ul class="sidebar-menu">
      <!-- Main Section -->
      <li class="sidebar-item">
        <a href="#exercises" class="sidebar-link">Exercises</a>
      </li>

      <!-- Main Section with Sub-sections -->
      <li class="sidebar-item">
        <a href="#workouts" class="sidebar-link">Workouts</a>
        <ul class="sidebar-submenu">
          <li class="sidebar-subitem">
            <a href="#workouts-sections" class="sidebar-sublink">Sections</a>
          </li>
        </ul>
      </li>

      <!-- Main Section -->
      <li class="sidebar-item">
        <a href="#programs" class="sidebar-link">Programs</a>
      </li>

      <li class="sidebar-item">
        <a href="#tasks" class="sidebar-link">Tasks</a>
      </li>

      <li class="sidebar-item">
        <a href="#forms" class="sidebar-link">Forms &amp; Questionnaires</a>
      </li>

      <!-- Main Section with Sub-sections -->
      <li class="sidebar-item">
        <a href="#meal-plans" class="sidebar-link">Meal Plan Templates</a>
        <ul class="sidebar-submenu">
          <li class="sidebar-subitem">
            <a href="#recipes" class="sidebar-sublink">Recipes</a>
          </li>
          <li class="sidebar-subitem">
            <a href="#ingredients" class="sidebar-sublink sidebar-sublink-selected">Ingredients</a>
          </li>
          <li class="sidebar-subitem">
            <a href="#recipe-books" class="sidebar-sublink">Recipe Books</a>
          </li>
        </ul>
      </li>

      <li class="sidebar-item">
        <a href="#metric-groups" class="sidebar-link">Metric Groups</a>
      </li>

      <li class="sidebar-item">
        <a href="#knowledge-base" class="sidebar-link">Knowledge Base (FAQ)</a>
      </li>
    </ul>
  </nav>
</aside>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-bg-white: #FFFFFF;
  --color-btn-action: #184EFF;
  --color-btn-cancel-hover: #F5F7F9;
  --color-bg-button-hover: #F0F1FF;
}

/* Sidebar Container */
.sidebar {
  width: 240px;
  height: 100vh;
  background-color: var(--color-bg-white);
  border-right: 1px solid #E5E7EB;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: var(--font-family);
  transition: transform 0.3s ease, width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

/* Collapsed State */
.sidebar.collapsed {
  transform: translateX(-240px);
  width: 0;
}

/* Sidebar Header */
.sidebar-header {
  padding: 24px 16px 16px;
  border-bottom: 1px solid #E5E7EB;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  font-family: var(--font-family);
}

/* Sidebar Navigation */
.sidebar-nav {
  padding: 8px 0;
}

.sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Main Menu Item */
.sidebar-item {
  margin: 0;
}

.sidebar-link {
  display: block;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
  border-radius: 8px;
  margin: 2px 8px;
}

.sidebar-link:hover {
  background-color: var(--color-btn-cancel-hover);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Submenu */
.sidebar-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar-subitem {
  margin: 0;
}

.sidebar-sublink {
  display: block;
  padding: 8px 16px 8px 36px; /* 36px left padding for indent */
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
  border-radius: 8px;
  margin: 2px 8px;
  position: relative;
}

/* Indent indicator */
.sidebar-sublink::before {
  content: '└─';
  position: absolute;
  left: 20px;
  color: #9CA3AF;
  font-size: 12px;
}

.sidebar-sublink:hover {
  background-color: var(--color-btn-cancel-hover);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Selected State */
.sidebar-sublink-selected {
  background-color: var(--color-bg-white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  border: 1px solid #E5E7EB;
  font-weight: 500;
}

.sidebar-sublink-selected:hover {
  background-color: var(--color-bg-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* Scrollbar Styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #D1D5DB;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #9CA3AF;
}
```

## JavaScript
```javascript
// LeftSidebar - Collapsible sidebar controlled by external trigger
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('leftSidebar');

  if (!sidebar) {
    console.log('LeftSidebar: Element not found');
    return;
  }

  // Listen for custom event from hamburger button
  document.addEventListener('toggleSidebar', function(e) {
    sidebar.classList.toggle('collapsed');
    console.log('LeftSidebar: Toggled', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
  });

  // Optional: Click outside to close on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth < 768) {
      if (!sidebar.contains(e.target) && !e.target.closest('.hamburger-btn')) {
        sidebar.classList.add('collapsed');
      }
    }
  });

  console.log('LeftSidebar: Initialized');
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Default | - | White background, no border | `.sidebar-link` |
| Hover | Mouse over | Gray bg #F5F7F9, shadow | `.sidebar-link:hover` |
| Selected | Active page | White bg, border, shadow | `.sidebar-sublink-selected` |
| Collapsed | External trigger | Hidden (translateX -240px) | `.sidebar.collapsed` |

## Props/Variants

| Variant | Class | Description |
|---------|-------|-------------|
| Main item | `.sidebar-link` | Top-level navigation item |
| Sub item | `.sidebar-sublink` | Indented child item (20px left) |
| Selected | `.sidebar-sublink-selected` | Active/current page indicator |
| Collapsed | `.sidebar.collapsed` | Hidden state |

## Accessibility
- Semantic HTML with `<nav>`, `<ul>`, `<li>` structure
- Links use proper `<a>` tags with href attributes
- Clear visual focus states
- Keyboard navigable
- ARIA labels can be added for screen readers

## Notes
- Created on 2026-02-04
- No collapse button in sidebar (controlled externally)
- Listens to `toggleSidebar` custom event
- Submenu items indented 20px with └─ indicator
- Selected state: white bg + border + shadow
- Hover state: gray bg #F5F7F9 + shadow
- Fixed position, full height
- Smooth collapse animation (0.3s)
- Custom scrollbar styling
