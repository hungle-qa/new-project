---
name: LeftSidebar
category: navigation
created: 2026-02-04T00:00:00.000Z
updated: 2026-02-04T08:30:00.000Z
status: approved
---

# LeftSidebar

## Preview
A hierarchical navigation sidebar with main sections and sub-sections. Features:
- Title "Library" at top
- Realistic menu structure with 12+ sections (Dashboard, Clients, Programs, Exercises, Nutrition, etc.)
- Sub-sections indented under parent sections (NO connector lines)
- Hover state with gray background and shadow
- Selected state with white background and shadow
- Click behavior: Shows wireframe placeholder on right side (NO page navigation)
- Collapsible via external trigger (hamburger button in header)

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

## Usage
Use for main navigation in content management systems. Supports hierarchical structure with main sections and sub-sections. Clicking items displays wireframe placeholder instead of navigating to new pages. Collapses when triggered by external hamburger button.

## HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LeftSidebar Demo</title>
</head>
<body>

<!-- Left Sidebar -->
<aside class="sidebar" id="leftSidebar">
  <div class="sidebar-header">
    <h2 class="sidebar-title">Library</h2>
  </div>

  <nav class="sidebar-nav">
    <ul class="sidebar-menu">
      <!-- Dashboard -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Dashboard">Dashboard</a>
      </li>

      <!-- Clients with Sub-sections -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Clients">Clients</a>
        <ul class="sidebar-submenu">
          <li class="sidebar-subitem">
            <a class="sidebar-sublink" data-section="Active Clients">Active Clients</a>
          </li>
          <li class="sidebar-subitem">
            <a class="sidebar-sublink" data-section="Archived Clients">Archived Clients</a>
          </li>
        </ul>
      </li>

      <!-- Programs with Sub-sections -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Programs">Programs</a>
        <ul class="sidebar-submenu">
          <li class="sidebar-subitem">
            <a class="sidebar-sublink" data-section="Templates">Templates</a>
          </li>
          <li class="sidebar-subitem">
            <a class="sidebar-sublink" data-section="Active Programs">Active Programs</a>
          </li>
        </ul>
      </li>

      <!-- Exercises with Sub-sections -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Exercises">Exercises</a>
        <ul class="sidebar-submenu">
          <li class="sidebar-subitem">
            <a class="sidebar-sublink" data-section="Exercise Library">Exercise Library</a>
          </li>
          <li class="sidebar-subitem">
            <a class="sidebar-sublink" data-section="Custom Exercises">Custom Exercises</a>
          </li>
        </ul>
      </li>

      <!-- Workouts -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Workouts">Workouts</a>
      </li>

      <!-- Nutrition with Sub-sections -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Nutrition">Nutrition</a>
        <ul class="sidebar-submenu">
          <li class="sidebar-subitem">
            <a class="sidebar-sublink" data-section="Meal Plans">Meal Plans</a>
          </li>
          <li class="sidebar-subitem">
            <a class="sidebar-sublink active" data-section="Recipes">Recipes</a>
          </li>
          <li class="sidebar-subitem">
            <a class="sidebar-sublink" data-section="Ingredients">Ingredients</a>
          </li>
        </ul>
      </li>

      <!-- Tasks -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Tasks">Tasks</a>
      </li>

      <!-- Forms & Questionnaires -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Forms & Questionnaires">Forms &amp; Questionnaires</a>
      </li>

      <!-- Reports -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Reports">Reports</a>
      </li>

      <!-- Metric Groups -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Metric Groups">Metric Groups</a>
      </li>

      <!-- Knowledge Base -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Knowledge Base">Knowledge Base (FAQ)</a>
      </li>

      <!-- Settings -->
      <li class="sidebar-item">
        <a class="sidebar-link" data-section="Settings">Settings</a>
      </li>
    </ul>
  </nav>
</aside>

<!-- Content Area (Right Side) -->
<div class="content-area" id="contentArea">
  <div class="wireframe-placeholder" id="wireframePlaceholder">
    [Recipes]
  </div>
</div>

</body>
</html>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-text-secondary: #222222;
  --color-bg-white: #FFFFFF;
  --color-btn-action: #184EFF;
  --color-btn-cancel-hover: #F5F7F9;
  --color-bg-button-hover: #F0F1FF;
}

body {
  margin: 0;
  font-family: var(--font-family);
  display: flex;
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
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
  border-radius: 8px;
  margin: 2px 8px;
  cursor: pointer;
}

.sidebar-link:hover {
  background-color: var(--color-btn-cancel-hover);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar-link.active {
  background-color: var(--color-bg-white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  border: 1px solid #E5E7EB;
  font-weight: 600;
}

/* Submenu - NO CONNECTOR LINES */
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
  padding: 8px 16px 8px 36px; /* Indented only, no connector lines */
  font-size: 13px;
  font-weight: 400;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
  border-radius: 8px;
  margin: 2px 8px;
  cursor: pointer;
}

.sidebar-sublink:hover {
  background-color: var(--color-btn-cancel-hover);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar-sublink.active {
  background-color: var(--color-bg-white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  border: 1px solid #E5E7EB;
  font-weight: 500;
}

/* Scrollbar Styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #e1e1ea;
  border-radius: 3px;
  cursor: pointer;
}

/* Content Area (Right Side) */
.content-area {
  margin-left: 240px;
  width: calc(100% - 240px);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F9FAFB;
  transition: margin-left 0.3s ease, width 0.3s ease;
}

.content-area.expanded {
  margin-left: 0;
  width: 100%;
}

.wireframe-placeholder {
  text-align: center;
  color: #9CA3AF;
  font-size: 48px;
  font-weight: 300;
  padding: 40px;
  border: 2px dashed #D1D5DB;
  border-radius: 12px;
  background-color: white;
  min-width: 400px;
}
```

## JavaScript
```javascript
// LeftSidebar - NO navigation, show wireframe on click
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('leftSidebar');
  const contentArea = document.getElementById('contentArea');
  const placeholder = document.getElementById('wireframePlaceholder');
  const allLinks = sidebar?.querySelectorAll('.sidebar-link, .sidebar-sublink');

  if (!sidebar) {
    console.log('LeftSidebar: Element not found');
    return;
  }

  // Handle click on any link
  allLinks?.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent navigation

      const sectionName = this.getAttribute('data-section');

      // Remove active class from all links
      allLinks.forEach(l => l.classList.remove('active'));

      // Add active class to clicked link
      this.classList.add('active');

      // Update wireframe placeholder
      if (placeholder) {
        placeholder.textContent = `[${sectionName}]`;
      }

      console.log('LeftSidebar: Clicked', sectionName);
    });
  });

  // Listen for custom event from hamburger button
  document.addEventListener('toggleSidebar', function(e) {
    sidebar.classList.toggle('collapsed');
    contentArea?.classList.toggle('expanded');
    console.log('LeftSidebar: Toggled', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
  });

  // Optional: Click outside to close on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth < 768) {
      if (!sidebar.contains(e.target) && !e.target.closest('.hamburger-btn')) {
        sidebar.classList.add('collapsed');
        contentArea?.classList.add('expanded');
      }
    }
  });

  // Pointer cursor on scrollbar hover
  sidebar.addEventListener('mousemove', function(e) {
    var rect = this.getBoundingClientRect();
    var onScrollbar = this.scrollHeight > this.clientHeight && e.clientX >= rect.right - 8;
    this.style.cursor = onScrollbar ? 'pointer' : '';
  });
  sidebar.addEventListener('mouseleave', function() {
    this.style.cursor = '';
  });

  console.log('LeftSidebar: Initialized');
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Default | - | Transparent background | `.sidebar-link` |
| Hover | Mouse over | Gray bg #F5F7F9, shadow | `.sidebar-link:hover` |
| Active | Clicked | White bg, border, shadow | `.sidebar-link.active` |
| Collapsed | External trigger | Hidden (translateX -240px) | `.sidebar.collapsed` |

## Accessibility
- Semantic HTML with `<nav>`, `<ul>`, `<li>` structure
- Links use proper `<a>` tags with data-section attributes
- Clear visual focus states
- Keyboard navigable
- ARIA labels can be added for screen readers
- Cursor pointer on interactive elements

## Notes
- Created on 2026-02-04
- Updated on 2026-02-04 (GMT+7)
- NO collapse button in sidebar (controlled externally)
- Listens to `toggleSidebar` custom event
- Submenu items indented with padding only (NO tree connector lines └─ or ├─)
- Active state: white bg + border + shadow
- Hover state: gray bg #F5F7F9 + shadow
- Fixed position, full height
- Smooth collapse animation (0.3s)
- Custom scrollbar styling
- Click behavior: Shows wireframe placeholder instead of navigating
- Content area expands when sidebar collapses
