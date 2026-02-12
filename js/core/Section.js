import { Component } from './Component.js';

export class Section extends Component {
    constructor(props = {}) {
        super(props);
        this.components = [];
    }

    addComponent(component) {
        this.components.push(component);
        return this;
    }

    renderComponents() {
        return this.components.map(component => component.render()).join('');
    }

    onMount() {
        super.onMount();
        this.components.forEach(component => {
            if (component.onMount) {
                component.onMount();
            }
        });
    }
}

