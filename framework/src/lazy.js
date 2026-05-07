import { render } from './core.js';

export function lazyRender(vnodeFn, options = {}) {
    const placeholder = document.createElement('div');
    placeholder.style.minHeight = '40px';
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const realElement = render(vnodeFn());
                placeholder.replaceWith(realElement);
                observer.disconnect();
            }
        });
    }, { rootMargin: '100px', ...options });

    observer.observe(placeholder);
    return placeholder;

}

export function lazyList(items, renderFn) {
    const container = document.createElement('div');

    items.forEach(item => {
        const placeholder = lazyRender(() => renderFn(item));
        container.appendChild(placeholder);
    });
    return container;
}