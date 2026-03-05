import { safeSetInnerHTML, createSafeHTML } from './TrustedHTML.js';

export class Component {
    constructor(props = {}) {
        this.props = props;
        this.element = null;
        this._listeners = [];
    }

    _on(target, type, handler, options) {
        if (!target) return;
        target.addEventListener(type, handler, options);
        this._listeners.push({ target, type, handler, options });
    }

    render() {
        throw new Error('render() method must be implemented');
    }

    mount(container) {
        safeSetInnerHTML(container, this.render());
        this.element = container.firstElementChild;
        this.onMount();
        return this.element;
    }

    onMount() {}

    update(newProps) {
        this.props = { ...this.props, ...newProps };
        if (this.element && this.element.parentElement) {
            const parent = this.element.parentElement;
            this.mount(parent);
        }
    }

    destroy() {
        this._listeners.forEach(({ target, type, handler, options }) => {
            target.removeEventListener(type, handler, options);
        });
        this._listeners = [];
        if (this.element && this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
        this.element = null;
    }

    static createElement(html) {
        const template = document.createElement('template');
        template.innerHTML = createSafeHTML(html.trim());
        return template.content.firstChild;
    }
}
