export class Component {
    constructor(props = {}) {
        this.props = props;
        this.element = null;
    }

    render() {
        throw new Error('render() method must be implemented');
    }

    mount(container) {
        container.innerHTML = this.render();
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
        if (this.element && this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
        this.element = null;
    }

    static createElement(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }
}

