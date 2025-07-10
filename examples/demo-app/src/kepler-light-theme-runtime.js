// Runtime CSS injection to override dark filter selector backgrounds
// This ensures the overrides work even with styled-components high specificity

const injectLightThemeStyles = () => {
  // Create a style element with high specificity rules
  const styleElement = document.createElement('style');
  styleElement.id = 'kepler-light-theme-overrides';
  
  // CSS with very high specificity to override styled-components
  const css = `
    /* Runtime overrides for dark filter selector backgrounds */
    
    /* Target StyledSourceContainer with highest specificity */
    .kepler-gl .kepler-gl .kepler-gl [class*="StyledSourceContainer"] {
      background-color: #ffffff !important;
    }
    
    /* Target any element with dark background colors - highest specificity */
    .kepler-gl .kepler-gl .kepler-gl [style*="background-color: rgb(28, 34, 51)"],
    .kepler-gl .kepler-gl .kepler-gl [style*="background-color: #1c2233"],
    .kepler-gl .kepler-gl .kepler-gl [style*="background-color: rgb(36, 39, 48)"], 
    .kepler-gl .kepler-gl .kepler-gl [style*="background-color: #242730"],
    .kepler-gl .kepler-gl .kepler-gl [style*="background-color: rgb(41, 50, 60)"],
    .kepler-gl .kepler-gl .kepler-gl [style*="background-color: #29323c"],
    .kepler-gl .kepler-gl .kepler-gl [style*="background-color: rgb(41, 46, 54)"],
    .kepler-gl .kepler-gl .kepler-gl [style*="background-color: #292e36"] {
      background-color: #ffffff !important;
    }
    
    /* High specificity for filter panel components */
    .kepler-gl .kepler-gl .filter-panel .source-selector,
    .kepler-gl .kepler-gl .filter-panel > div > div:first-child,
    .kepler-gl .kepler-gl .new-filter-panel > div:first-child {
      background-color: #ffffff !important;
    }
    
    /* High specificity for item selector dropdowns */
    .kepler-gl .kepler-gl .item-selector__dropdown {
      background-color: #f7f7f7 !important;
      border: 1px solid #d3d8e0 !important;
      color: #545454 !important;
    }
    
    /* High specificity for dropdown lists */
    .kepler-gl .kepler-gl .list-selector {
      background-color: #ffffff !important;
      border-top: 1px solid #d3d8e0 !important;
    }
    
    /* High specificity for styled components */
    .kepler-gl .kepler-gl [class*="styled__"],
    .kepler-gl .kepler-gl [class*="Styled"] {
      background-color: #ffffff !important;
    }
  `;
  
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
};

// Function to watch for dynamically added elements and override their styles
const watchForDarkElements = () => {
  // Use MutationObserver to watch for dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the element has a dark background
            const computedStyle = window.getComputedStyle(node);
            const bgColor = computedStyle.backgroundColor;
            
            // List of dark background colors to override
            const darkColors = [
              'rgb(28, 34, 51)',   // #1c2233
              'rgb(36, 39, 48)',   // #242730
              'rgb(41, 50, 60)',   // #29323c
              'rgb(41, 46, 54)',   // #292e36
            ];
            
            // If it's a dark background in the filter area, override it
            if (darkColors.includes(bgColor) && 
                (node.closest('.filter-panel') || node.closest('.kepler-gl'))) {
              node.style.backgroundColor = '#ffffff';
            }
            
            // Also check child elements
            const darkElements = node.querySelectorAll('*');
            darkElements.forEach((element) => {
              const elemStyle = window.getComputedStyle(element);
              const elemBgColor = elemStyle.backgroundColor;
              
              if (darkColors.includes(elemBgColor) && 
                  (element.closest('.filter-panel') || element.closest('.kepler-gl'))) {
                element.style.backgroundColor = '#ffffff';
              }
            });
          }
        });
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
};

// Initialize the runtime overrides
const initializeRuntimeOverrides = () => {
  // Inject high-specificity CSS
  injectLightThemeStyles();
  
  // Watch for dynamically added elements
  const observer = watchForDarkElements();
  
  // Initial scan of existing elements
  setTimeout(() => {
    const darkElements = document.querySelectorAll('[style*="background-color: rgb(28, 34, 51)"], [style*="background-color: #1c2233"], [style*="background-color: rgb(36, 39, 48)"], [style*="background-color: #242730"], [style*="background-color: rgb(41, 50, 60)"], [style*="background-color: #29323c"], [style*="background-color: rgb(41, 46, 54)"], [style*="background-color: #292e36"]');
    
    darkElements.forEach((element) => {
      if (element.closest('.filter-panel') || element.closest('.kepler-gl')) {
        element.style.backgroundColor = '#ffffff';
      }
    });
  }, 1000); // Wait 1 second after page load
  
  return observer;
};

// Export for use in main.js
export { initializeRuntimeOverrides };

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRuntimeOverrides);
} else {
  initializeRuntimeOverrides();
} 