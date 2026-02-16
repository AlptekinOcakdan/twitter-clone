import { View } from '@/core';
import { HeaderSection, SidebarSection, ExploreSection } from '@/sections';

export class ExploreView extends View {
    constructor() {
        super();
        this.headerSection = new HeaderSection();
        this.exploreSection = new ExploreSection();
        this.sidebarSection = new SidebarSection();
    }

    async render(container) {
        this.container = container;

        await Promise.all([
            this.headerSection.loadData(),
            this.sidebarSection.loadData()
        ]);

        container.innerHTML = `
            <div class="app-container">
                <div data-section="header"></div>
                <main class="flex">
                    <div data-section="explore"></div>
                    <div data-section="sidebar"></div>
                </main>
            </div>
        `;

        const headerContainer = container.querySelector('[data-section="header"]');
        const exploreContainer = container.querySelector('[data-section="explore"]');
        const sidebarContainer = container.querySelector('[data-section="sidebar"]');

        if (headerContainer) {
            headerContainer.outerHTML = this.headerSection.render();
            this.headerSection.element = container.querySelector('header');
        }
        if (exploreContainer) {
            exploreContainer.outerHTML = this.exploreSection.render();
            this.exploreSection.element = container.querySelector('#explore');
        }
        if (sidebarContainer) {
            sidebarContainer.outerHTML = this.sidebarSection.render();
            this.sidebarSection.element = container.querySelector('#sidebar');
        }

        this.onMount();
    }

    onMount() {
        this.headerSection.onMount();
        this.exploreSection.onMount();
        this.sidebarSection.onMount();
        this.initLinkHandlers();
    }

    initLinkHandlers() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    window.history.pushState({}, '', href);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
            }
        });
    }
}
