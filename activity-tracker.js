/**
 * ===================================================================
 * QUESTION 6: USER ACTIVITY TRACKING SYSTEM
 * ===================================================================
 * This script captures all click events and page views performed by
 * a user across HTML tags and CSS Objects and prints them to console
 * ===================================================================
 */

// ===================================================================
// CONFIGURATION SECTION
// ===================================================================

const ActivityTracker = {
    // Store all tracked events
    events: [],
    
    // Session information
    session: {
        sessionId: null,
        startTime: null,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`
    },
    
    // Configuration options
    config: {
        logToConsole: true,          // Print events to console
        logDetailedInfo: true,       // Include detailed element information
        trackMouseMovement: false,   // Set to true if you want mouse tracking
        trackScrolling: true,        // Track scroll events
        trackFormInputs: true,       // Track form interactions
        groupSimilarEvents: false    // Group similar consecutive events
    }
};

// ===================================================================
// INITIALIZATION FUNCTION
// ===================================================================

/**
 * Initialize the activity tracker
 * Call this function when DOM is loaded
 */
function initActivityTracker() {
    // Generate unique session ID
    ActivityTracker.session.sessionId = generateSessionId();
    ActivityTracker.session.startTime = new Date().toISOString();
    
    console.log('%c=================================', 'color: #4CAF50; font-weight: bold;');
    console.log('%c🔍 ACTIVITY TRACKER INITIALIZED', 'color: #4CAF50; font-weight: bold; font-size: 16px;');
    console.log('%c=================================', 'color: #4CAF50; font-weight: bold;');
    console.log('Session ID:', ActivityTracker.session.sessionId);
    console.log('Start Time:', ActivityTracker.session.startTime);
    console.log('Page URL:', ActivityTracker.session.pageUrl);
    console.log('User Agent:', ActivityTracker.session.userAgent);
    console.log('Screen Resolution:', ActivityTracker.session.screenResolution);
    console.log('Viewport Size:', ActivityTracker.session.viewport);
    console.log('%c=================================\n', 'color: #4CAF50; font-weight: bold;');
    
    // Track page view
    trackPageView();
    
    // Register all event listeners
    registerEventListeners();
    
    // Track page unload
    window.addEventListener('beforeunload', handlePageUnload);
}

// ===================================================================
// SESSION ID GENERATOR
// ===================================================================

/**
 * Generate unique session ID
 * @returns {string} Unique session identifier
 */
function generateSessionId() {
    // Generate random session ID
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===================================================================
// PAGE VIEW TRACKING
// ===================================================================

/**
 * Track page view event
 */
function trackPageView() {
    const pageViewEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'PAGE_VIEW',
        event_object: 'PAGE',
        url: window.location.href,
        pathname: window.location.pathname,
        referrer: document.referrer || 'Direct',
        title: document.title,
        viewport: `${window.innerWidth}x${window.innerHeight}`
    };
    
    // Add to events array
    ActivityTracker.events.push(pageViewEvent);
    
    // Log to console
    if (ActivityTracker.config.logToConsole) {
        console.log('%c📄 PAGE VIEW', 'background: #2196F3; color: white; padding: 4px 8px; border-radius: 3px;');
        console.log('Timestamp:', pageViewEvent.timestamp);
        console.log('Event Type:', pageViewEvent.type_of_event);
        console.log('Event Object:', pageViewEvent.event_object);
        console.log('URL:', pageViewEvent.url);
        console.log('Title:', pageViewEvent.title);
        console.log('---');
    }
}

// ===================================================================
// EVENT LISTENERS REGISTRATION
// ===================================================================

/**
 * Register all event listeners for tracking
 */
function registerEventListeners() {
    // Track all click events (using event capturing)
    document.addEventListener('click', handleClickEvent, true);
    
    // Track hover events on interactive elements
    document.addEventListener('mouseover', handleHoverEvent, true);
    
    // Track scroll events
    if (ActivityTracker.config.trackScrolling) {
        window.addEventListener('scroll', throttle(handleScrollEvent, 500));
    }
    
    // Track form interactions
    if (ActivityTracker.config.trackFormInputs) {
        document.addEventListener('focus', handleFocusEvent, true);
        document.addEventListener('blur', handleBlurEvent, true);
        document.addEventListener('change', handleChangeEvent, true);
        document.addEventListener('submit', handleSubmitEvent, true);
    }
    
    // Track keyboard events
    document.addEventListener('keydown', handleKeyboardEvent, true);
    
    // Track mouse movement (optional - can generate many events)
    if (ActivityTracker.config.trackMouseMovement) {
        document.addEventListener('mousemove', throttle(handleMouseMoveEvent, 1000));
    }
    
    // Track viewport resize
    window.addEventListener('resize', throttle(handleResizeEvent, 500));
    
    console.log('✅ All event listeners registered successfully\n');
}

// ===================================================================
// CLICK EVENT HANDLER
// ===================================================================

/**
 * Handle click events on all elements
 * @param {Event} event - The click event
 */
function handleClickEvent(event) {
    const element = event.target;
    
    // Get event object type
    const eventObject = getEventObjectType(element);
    
    // Create click event object
    const clickEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'CLICK',
        event_object: eventObject,
        element: {
            tagName: element.tagName.toLowerCase(),
            id: element.id || 'N/A',
            className: element.className || 'N/A',
            text: element.innerText?.substring(0, 50) || 'N/A',
            href: element.href || 'N/A',
            type: element.type || 'N/A'
        },
        position: {
            x: event.clientX,
            y: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY
        },
        cssSelector: getCssSelector(element),
        xpath: getXPath(element),
        computedStyles: ActivityTracker.config.logDetailedInfo ? getComputedStyleInfo(element) : null
    };
    
    // Add to events array
    ActivityTracker.events.push(clickEvent);
    
    // Log to console
    if (ActivityTracker.config.logToConsole) {
        console.log('%c👆 CLICK EVENT', 'background: #FF5722; color: white; padding: 4px 8px; border-radius: 3px;');
        console.log('Timestamp:', clickEvent.timestamp);
        console.log('Event Type:', clickEvent.type_of_event);
        console.log('Event Object:', clickEvent.event_object);
        console.log('Element:', element);
        console.table({
            'Tag': clickEvent.element.tagName,
            'ID': clickEvent.element.id,
            'Class': clickEvent.element.className,
            'Text': clickEvent.element.text,
            'Position': `(${clickEvent.position.x}, ${clickEvent.position.y})`,
            'CSS Selector': clickEvent.cssSelector
        });
        
        if (ActivityTracker.config.logDetailedInfo) {
            console.log('Full Event Data:', clickEvent);
        }
        console.log('---');
    }
}

// ===================================================================
// HOVER EVENT HANDLER
// ===================================================================

/**
 * Handle hover events on elements
 * @param {Event} event - The mouseover event
 */
function handleHoverEvent(event) {
    const element = event.target;
    
    // Only track hover on interactive elements
    const interactiveTags = ['a', 'button', 'input', 'select', 'textarea'];
    if (!interactiveTags.includes(element.tagName.toLowerCase())) {
        return;
    }
    
    const eventObject = getEventObjectType(element);
    
    const hoverEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'HOVER',
        event_object: eventObject,
        element: {
            tagName: element.tagName.toLowerCase(),
            id: element.id || 'N/A',
            className: element.className || 'N/A'
        },
        cssSelector: getCssSelector(element)
    };
    
    ActivityTracker.events.push(hoverEvent);
    
    if (ActivityTracker.config.logToConsole) {
        console.log('%c🖱️ HOVER', 'background: #9C27B0; color: white; padding: 4px 8px; border-radius: 3px;');
        console.log('Timestamp:', hoverEvent.timestamp);
        console.log('Event Type:', hoverEvent.type_of_event);
        console.log('Event Object:', hoverEvent.event_object);
        console.log('Element:', element.tagName, getCssSelector(element));
        console.log('---');
    }
}

// ===================================================================
// SCROLL EVENT HANDLER
// ===================================================================

/**
 * Handle scroll events
 */
function handleScrollEvent() {
    const scrollEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'SCROLL',
        event_object: 'PAGE',
        position: {
            scrollY: window.scrollY,
            scrollX: window.scrollX,
            scrollPercentage: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
        },
        documentHeight: document.body.scrollHeight,
        viewportHeight: window.innerHeight
    };
    
    ActivityTracker.events.push(scrollEvent);
    
    if (ActivityTracker.config.logToConsole) {
        console.log('%c📜 SCROLL', 'background: #00BCD4; color: white; padding: 4px 8px; border-radius: 3px;');
        console.log('Timestamp:', scrollEvent.timestamp);
        console.log('Event Type:', scrollEvent.type_of_event);
        console.log('Event Object:', scrollEvent.event_object);
        console.log('Position:', `${scrollEvent.position.scrollY}px (${scrollEvent.position.scrollPercentage}%)`);
        console.log('---');
    }
}

// ===================================================================
// FORM EVENT HANDLERS
// ===================================================================

/**
 * Handle focus event on form elements
 * @param {Event} event - The focus event
 */
function handleFocusEvent(event) {
    const element = event.target;
    
    if (!['input', 'textarea', 'select'].includes(element.tagName.toLowerCase())) {
        return;
    }
    
    const eventObject = getEventObjectType(element);
    
    const focusEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'FOCUS',
        event_object: eventObject,
        element: {
            tagName: element.tagName.toLowerCase(),
            id: element.id || 'N/A',
            name: element.name || 'N/A',
            type: element.type || 'N/A'
        },
        cssSelector: getCssSelector(element)
    };
    
    ActivityTracker.events.push(focusEvent);
    
    if (ActivityTracker.config.logToConsole) {
        console.log('%c🎯 FOCUS', 'background: #8BC34A; color: white; padding: 4px 8px; border-radius: 3px;');
        console.log('Timestamp:', focusEvent.timestamp);
        console.log('Event Type:', focusEvent.type_of_event);
        console.log('Event Object:', focusEvent.event_object);
        console.log('Element:', `${element.tagName} - ${element.name || element.id}`);
        console.log('---');
    }
}

/**
 * Handle blur event on form elements
 * @param {Event} event - The blur event
 */
function handleBlurEvent(event) {
    const element = event.target;
    
    if (!['input', 'textarea', 'select'].includes(element.tagName.toLowerCase())) {
        return;
    }
    
    const eventObject = getEventObjectType(element);
    
    const blurEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'BLUR',
        event_object: eventObject,
        element: {
            tagName: element.tagName.toLowerCase(),
            id: element.id || 'N/A',
            name: element.name || 'N/A'
        }
    };
    
    ActivityTracker.events.push(blurEvent);
}

/**
 * Handle change event on form elements
 * @param {Event} event - The change event
 */
function handleChangeEvent(event) {
    const element = event.target;
    
    const eventObject = getEventObjectType(element);
    
    const changeEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'CHANGE',
        event_object: eventObject,
        element: {
            tagName: element.tagName.toLowerCase(),
            id: element.id || 'N/A',
            name: element.name || 'N/A',
            type: element.type || 'N/A',
            value: element.value?.substring(0, 50) || 'N/A' // Limited for privacy
        }
    };
    
    ActivityTracker.events.push(changeEvent);
    
    if (ActivityTracker.config.logToConsole) {
        console.log('%c✏️ CHANGE', 'background: #FFC107; color: black; padding: 4px 8px; border-radius: 3px;');
        console.log('Timestamp:', changeEvent.timestamp);
        console.log('Event Type:', changeEvent.type_of_event);
        console.log('Event Object:', changeEvent.event_object);
        console.log('Element:', `${element.name || element.id}`);
        console.log('---');
    }
}

/**
 * Handle form submit event
 * @param {Event} event - The submit event
 */
function handleSubmitEvent(event) {
    const form = event.target;
    
    const submitEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'FORM_SUBMIT',
        event_object: 'FORM',
        form: {
            id: form.id || 'N/A',
            name: form.name || 'N/A',
            action: form.action || 'N/A',
            method: form.method || 'N/A'
        }
    };
    
    ActivityTracker.events.push(submitEvent);
    
    if (ActivityTracker.config.logToConsole) {
        console.log('%c📤 FORM SUBMIT', 'background: #4CAF50; color: white; padding: 4px 8px; border-radius: 3px;');
        console.log('Timestamp:', submitEvent.timestamp);
        console.log('Event Type:', submitEvent.type_of_event);
        console.log('Event Object:', submitEvent.event_object);
        console.table(submitEvent.form);
        console.log('---');
    }
}

// ===================================================================
// KEYBOARD EVENT HANDLER
// ===================================================================

/**
 * Handle keyboard events
 * @param {Event} event - The keyboard event
 */
function handleKeyboardEvent(event) {
    // Only track special keys (not regular typing for privacy)
    const specialKeys = ['Enter', 'Escape', 'Tab', 'Backspace', 'Delete'];
    
    if (!specialKeys.includes(event.key)) {
        return;
    }
    
    const keyEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'KEYBOARD',
        event_object: 'KEYBOARD',
        key: event.key,
        code: event.code,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey
    };
    
    ActivityTracker.events.push(keyEvent);
    
    if (ActivityTracker.config.logToConsole) {
        console.log('%c⌨️ KEYBOARD', 'background: #607D8B; color: white; padding: 4px 8px; border-radius: 3px;');
        console.log('Timestamp:', keyEvent.timestamp);
        console.log('Event Type:', keyEvent.type_of_event);
        console.log('Event Object:', keyEvent.event_object);
        console.log('Key:', event.key);
        console.log('---');
    }
}

// ===================================================================
// MOUSE MOVEMENT HANDLER
// ===================================================================

/**
 * Handle mouse movement (throttled)
 * @param {Event} event - The mousemove event
 */
function handleMouseMoveEvent(event) {
    const moveEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'MOUSE_MOVE',
        event_object: 'MOUSE',
        position: {
            x: event.clientX,
            y: event.clientY
        }
    };
    
    ActivityTracker.events.push(moveEvent);
}

// ===================================================================
// RESIZE EVENT HANDLER
// ===================================================================

/**
 * Handle window resize event
 */
function handleResizeEvent() {
    const resizeEvent = {
        timestamp: new Date().toISOString(),
        type_of_event: 'RESIZE',
        event_object: 'WINDOW',
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    
    ActivityTracker.events.push(resizeEvent);
    
    if (ActivityTracker.config.logToConsole) {
        console.log('%c📐 RESIZE', 'background: #795548; color: white; padding: 4px 8px; border-radius: 3px;');
        console.log('Timestamp:', resizeEvent.timestamp);
        console.log('Event Type:', resizeEvent.type_of_event);
        console.log('Event Object:', resizeEvent.event_object);
        console.log('Viewport:', `${resizeEvent.viewport.width}x${resizeEvent.viewport.height}`);
        console.log('---');
    }
}

// ===================================================================
// PAGE UNLOAD HANDLER
// ===================================================================

/**
 * Handle page unload event
 */
function handlePageUnload() {
    const sessionDuration = Date.now() - new Date(ActivityTracker.session.startTime).getTime();
    
    console.log('%c=================================', 'color: #F44336; font-weight: bold;');
    console.log('%c📊 SESSION SUMMARY', 'color: #F44336; font-weight: bold; font-size: 16px;');
    console.log('%c=================================', 'color: #F44336; font-weight: bold;');
    console.log('Session Duration:', (sessionDuration / 1000).toFixed(2), 'seconds');
    console.log('Total Events Tracked:', ActivityTracker.events.length);
    console.log('Session ID:', ActivityTracker.session.sessionId);
    
    // Event breakdown
    const eventCounts = {};
    ActivityTracker.events.forEach(event => {
        eventCounts[event.type_of_event] = (eventCounts[event.type_of_event] || 0) + 1;
    });
    
    console.log('\nEvent Breakdown:');
    console.table(eventCounts);
    
    console.log('%c=================================\n', 'color: #F44336; font-weight: bold;');
}

// ===================================================================
// EVENT OBJECT TYPE DETECTION
// ===================================================================

/**
 * Determine the type of event object (drop_down/image/text etc.)
 * @param {Element} element - The DOM element
 * @returns {string} Event object type
 */
function getEventObjectType(element) {
    const tagName = element.tagName.toLowerCase();
    
    // Form elements
    if (['input', 'textarea', 'select'].includes(tagName)) {
        if (tagName === 'select') {
            return 'DROP_DOWN';
        }
        
        const type = element.type?.toLowerCase();
        switch (type) {
            case 'text':
            case 'password':
            case 'email':
            case 'search':
            case 'tel':
            case 'url':
                return 'TEXT_FIELD';
            case 'checkbox':
                return 'CHECKBOX';
            case 'radio':
                return 'RADIO_BUTTON';
            case 'file':
                return 'FILE_UPLOAD';
            case 'submit':
            case 'button':
                return 'BUTTON';
            case 'range':
                return 'SLIDER';
            case 'date':
            case 'time':
            case 'datetime-local':
                return 'DATE_PICKER';
            case 'color':
                return 'COLOR_PICKER';
            default:
                return 'INPUT_FIELD';
        }
    }
    
    // Interactive elements
    switch (tagName) {
        case 'a':
            return 'LINK';
        case 'button':
            return 'BUTTON';
        case 'img':
            return 'IMAGE';
        case 'video':
            return 'VIDEO';
        case 'audio':
            return 'AUDIO';
        case 'iframe':
            return 'IFRAME';
        case 'canvas':
            return 'CANVAS';
        case 'svg':
            return 'SVG';
        case 'table':
            return 'TABLE';
        case 'ul':
        case 'ol':
            return 'LIST';
        case 'li':
            return 'LIST_ITEM';
        case 'div':
            return 'CONTAINER';
        case 'span':
            return 'TEXT_SPAN';
        case 'p':
            return 'PARAGRAPH';
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return 'HEADING';
        case 'form':
            return 'FORM';
        case 'label':
            return 'LABEL';
        case 'nav':
            return 'NAVIGATION';
        case 'header':
            return 'HEADER';
        case 'footer':
            return 'FOOTER';
        case 'section':
            return 'SECTION';
        case 'article':
            return 'ARTICLE';
        case 'main':
            return 'MAIN_CONTENT';
        default:
            return 'ELEMENT';
    }
}

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Get detailed element information
 * @param {Element} element - The DOM element
 * @returns {Object} Element information
 */
function getElementInfo(element) {
    return {
        tagName: element.tagName.toLowerCase(),
        id: element.id,
        className: element.className,
        attributes: Array.from(element.attributes).map(attr => ({
            name: attr.name,
            value: attr.value
        }))
    };
}

/**
 * Get CSS selector for an element
 * @param {Element} element - The DOM element
 * @returns {string} CSS selector
 */
function getCssSelector(element) {
    if (element.id) {
        return `#${element.id}`;
    }
    
    if (element.className) {
        const classes = element.className.split(' ').filter(c => c).join('.');
        return `${element.tagName.toLowerCase()}.${classes}`;
    }
    
    // Build path from parent
    let path = [];
    while (element.parentElement) {
        let selector = element.tagName.toLowerCase();
        if (element.id) {
            selector += `#${element.id}`;
            path.unshift(selector);
            break;
        } else {
            let sibling = element;
            let nth = 1;
            while (sibling.previousElementSibling) {
                sibling = sibling.previousElementSibling;
                if (sibling.tagName === element.tagName) nth++;
            }
            if (nth > 1) selector += `:nth-of-type(${nth})`;
            path.unshift(selector);
        }
        element = element.parentElement;
    }
    
    return path.join(' > ');
}

/**
 * Get XPath for an element
 * @param {Element} element - The DOM element
 * @returns {string} XPath
 */
function getXPath(element) {
    if (element.id) {
        return `//*[@id="${element.id}"]`;
    }
    
    if (element === document.body) {
        return '/html/body';
    }
    
    let ix = 0;
    const siblings = element.parentNode?.childNodes || [];
    
    for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling === element) {
            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

/**
 * Get computed style information for an element
 * @param {Element} element - The DOM element
 * @returns {Object} Selected computed styles
 */
function getComputedStyleInfo(element) {
    const styles = window.getComputedStyle(element);
    return {
        display: styles.display,
        position: styles.position,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        width: styles.width,
        height: styles.height
    };
}

/**
 * Throttle function to limit event firing rate
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func.apply(this, args);
        }
    };
}

// ===================================================================
// PUBLIC API FUNCTIONS
// ===================================================================

/**
 * Get all tracked events
 * @returns {Array} Array of all events
 */
function getAllEvents() {
    return ActivityTracker.events;
}

/**
 * Get events by type
 * @param {string} eventType - Type of event to filter
 * @returns {Array} Filtered events
 */
function getEventsByType(eventType) {
    return ActivityTracker.events.filter(event => event.type_of_event === eventType);
}

/**
 * Get events by object type
 * @param {string} objectType - Type of object to filter
 * @returns {Array} Filtered events
 */
function getEventsByObjectType(objectType) {
    return ActivityTracker.events.filter(event => event.event_object === objectType);
}

/**
 * Export events as JSON
 * @returns {string} JSON string of events
 */
function exportEventsAsJSON() {
    const exportData = {
        session: ActivityTracker.session,
        events: ActivityTracker.events,
        exportTime: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
}

/**
 * Download events as JSON file
 */
function downloadEventsAsJSON() {
    const json = exportEventsAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-tracker-${ActivityTracker.session.sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Events downloaded as JSON file');
}

/**
 * Print summary report to console
 */
function printSummaryReport() {
    console.clear();
    console.log('%c╔═══════════════════════════════════════════════════╗', 'color: #2196F3; font-weight: bold;');
    console.log('%c║        ACTIVITY TRACKER - SUMMARY REPORT         ║', 'color: #2196F3; font-weight: bold;');
    console.log('%c╚═══════════════════════════════════════════════════╝', 'color: #2196F3; font-weight: bold;');
    
    console.log('\n📋 SESSION INFORMATION:');
    console.table(ActivityTracker.session);
    
    console.log('\n📊 EVENT STATISTICS:');
    const eventCounts = {};
    ActivityTracker.events.forEach(event => {
        eventCounts[event.type_of_event] = (eventCounts[event.type_of_event] || 0) + 1;
    });
    console.table(eventCounts);
    
    console.log('\n🎯 EVENT OBJECT BREAKDOWN:');
    const objectCounts = {};
    ActivityTracker.events.forEach(event => {
        objectCounts[event.event_object] = (objectCounts[event.event_object] || 0) + 1;
    });
    console.table(objectCounts);
    
    console.log('\n📝 RECENT EVENTS (Last 10):');
    console.table(ActivityTracker.events.slice(-10).map(e => ({
        'Timestamp': new Date(e.timestamp).toLocaleTimeString(),
        'Event Type': e.type_of_event,
        'Event Object': e.event_object,
        'Element': e.element?.tagName || e.key || 'N/A',
        'Details': e.cssSelector || e.position || 'N/A'
    })));
    
    console.log('\n💡 AVAILABLE COMMANDS:');
    console.log('  getAllEvents()              - Get all tracked events');
    console.log('  getEventsByType(type)       - Filter events by type');
    console.log('  getEventsByObjectType(type) - Filter events by object type');
    console.log('  exportEventsAsJSON()        - Export events as JSON string');
    console.log('  downloadEventsAsJSON()      - Download events as JSON file');
    console.log('  printSummaryReport()        - Print this report again');
}

// ===================================================================
// AUTO-INITIALIZATION
// ===================================================================

// Initialize tracker when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActivityTracker);
} else {
    initActivityTracker();
}

// ===================================================================
// EXPOSE PUBLIC API
// ===================================================================

// Make functions available globally
window.ActivityTracker = {
    getAllEvents,
    getEventsByType,
    getEventsByObjectType,
    exportEventsAsJSON,
    downloadEventsAsJSON,
    printSummaryReport,
    config: ActivityTracker.config
};

console.log('\n💡 TIP: Type ActivityTracker.printSummaryReport() to see a summary anytime!');