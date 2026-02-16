import { Section } from '@/core';

export class ExploreSection extends Section {
    constructor(props = {}) {
        super(props);
    }

    render() {
        return `
            <section id="explore" class="w-full h-full">
                <!-- Explore content will go here -->
            </section>
        `;
    }
}
