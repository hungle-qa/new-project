import { useMemo } from 'react'

/**
 * Custom hook to generate preview HTML with embedded styles and JavaScript
 *
 * @param html - Standard HTML code
 * @param css - CSS styles
 * @param tailwindHtml - Tailwind CSS version of HTML
 * @param javascript - JavaScript code
 * @returns Complete HTML document ready for iframe preview
 */
export function usePreviewHtml(
  html: string,
  css: string,
  tailwindHtml: string,
  javascript: string
): string {
  return useMemo(() => {
    if (!html && !tailwindHtml) return ''

    const componentHtml = tailwindHtml || html

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      min-height: 100vh;
      margin: 0;
      padding: 30px;
      background: #f9fafb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
    .component-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    /* Dynamic positioning: small components start at 1/3, large components start at top */
    body.small-component {
      padding-top: calc(100vh / 3 - 100px);
    }
    body.large-component {
      padding-top: 30px;
    }
    ${css}
  </style>
</head>
<body>
  <div class="component-wrapper">${componentHtml}</div>
  ${javascript ? `<script>${javascript}</script>` : ''}
  <script>
    // Auto-detect component size and apply appropriate class
    (function() {
      const wrapper = document.querySelector('.component-wrapper');
      if (!wrapper) return;

      function updateBodyClass() {
        const componentHeight = wrapper.scrollHeight;
        const viewportHeight = window.innerHeight;
        const threshold = viewportHeight * 0.5; // 50% of viewport

        if (componentHeight > threshold) {
          document.body.classList.remove('small-component');
          document.body.classList.add('large-component');
        } else {
          document.body.classList.remove('large-component');
          document.body.classList.add('small-component');
        }
      }

      // Initial check
      updateBodyClass();

      // Re-check on resize and mutations
      window.addEventListener('resize', updateBodyClass);

      // Observe DOM changes (for expanding components)
      const observer = new MutationObserver(updateBodyClass);
      observer.observe(wrapper, { childList: true, subtree: true, attributes: true });
    })();
  </script>
</body>
</html>`
  }, [html, css, tailwindHtml, javascript])
}
