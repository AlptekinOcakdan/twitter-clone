export class View {
    constructor() {
        this.sections = new Map();
        this.container = null;
    }

    addSection(name, section) {
        this.sections.set(name, section);
        return this;
    }

    getSection(name) {
        return this.sections.get(name);
    }

    async render(container) {
        this.container = container;

        for (const [name, section] of this.sections) {
            const sectionContainer = container.querySelector(`[data-section="${name}"]`);
            if (sectionContainer) {
                section.mount(sectionContainer);
            }
        }

        this.onMount();
    }

    onMount() {}

    updateSection(name) {
        const section = this.sections.get(name);
        if (section && this.container) {
            const sectionContainer = this.container.querySelector(`[data-section="${name}"]`);
            if (sectionContainer) {
                section.mount(sectionContainer);
            }
        }
    }
}

