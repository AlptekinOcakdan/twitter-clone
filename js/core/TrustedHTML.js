let policy = null;

if (window.trustedTypes && window.trustedTypes.createPolicy) {
    policy = window.trustedTypes.createPolicy('default', {
        createHTML: (input) => input,
        createScript: () => '',
        createScriptURL: () => ''
    });
}

export function createSafeHTML(htmlString) {
    if (policy) {
        return policy.createHTML(htmlString);
    }
    return htmlString;
}

export function safeSetInnerHTML(element, htmlString) {
    element.innerHTML = createSafeHTML(htmlString);
}

export function safeSetOuterHTML(element, htmlString) {
    element.outerHTML = createSafeHTML(htmlString);
}

export function safeCreateFragment(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = createSafeHTML(htmlString);
    return template.content;
}
