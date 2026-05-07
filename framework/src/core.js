export function createElement(tag, props = {}, ...children) {
    return {
        tag,
        props: props || {},
        children: children.flat(),
    };
}

export function render(vnode){
    if (vnode === null || vnode === undefined || typeof vnode === 'boolean') {
        return document.createTextNode('');
    }
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return document.createTextNode(String(vnode));
    }
     if (vnode instanceof Node) {
        return vnode;
    }
    if (typeof vnode.tag === 'function') {
        const componentVnode = vnode.tag(vnode.props);
        return render(componentVnode);
    }

    const el = document.createElement(vnode.tag);

    applyProps(el, vnode.props);

    for (const child of vnode.children) {
        el.appendChild(render(child));
    }

    return el;
}

function applyProps(el, props) {
    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            el.addEventListener(eventName, value);
            continue;
        }
        if (key === 'className') {
            el.className = value;
            continue;
        }
        if (key === 'style' && typeof value === 'object') {
            Object.assign(el.style, value);
            continue;
        }
        if (key === 'htmlFor') {
            el.setAttribute('for', value);
            continue;
        }
        if (typeof value === 'boolean') {
            if (value) el.setAttribute(key, '');
            else el.removeAttribute(key);
            continue;
        }
        el.setAttribute(key, value);
    }
}

export function mount(vnode, container) {
    container.innerHTML = '';
    container.appendChild(render(vnode));
}