export function delegate(parent, eventType, selector, handler) {
    function listener(event) {
        const target = event.target.closest(selector);

        if (!target) return;

        if (!parent.contains(target)) return;

        handler(event, target);
    }

    parent.addEventListener(eventType, listener);
    return () => parent.removeEventListener(eventType, listener);
}

export function preventDefault(handler) {
    return function(event) {
        event.preventDefault();
        handler(event);
    };
}

export function stopBubbling(handler) {
    return function(event) {
        event.stopPropagation();
        handler(event);
    };
}
export function on(element, eventType, handler) {
    element.addEventListener(eventType, handler);
    return () => element.removeEventListener(eventType, handler);
}