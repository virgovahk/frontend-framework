import { render, mount } from './core.js';

export class Component {
    constructor(props = {}) {
        this.props = props;
        this._container = null;
    }
    render() {
        throw new Error (`${this.constructor.name} must implement render() method`);
    }
    mount(container) {
        this._container = container;
        this._update();
    }
    _update() {
        if (!this._container) return;
        const vnode = this.render();
        mount(vnode, this._container);
    }
    setState(newProps) {
        this.props = { ...this.props, ...newProps };
        this._update();
    }
}