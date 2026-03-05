import { View, safeSetInnerHTML, safeSetOuterHTML } from '@/core';
import { HeaderSection, SidebarSection, SearchSection } from '@/sections';

export class SearchView extends View {
    constructor() {
        super();
        const params = new URLSearchParams(window.location.search);
        this.query = params.get('q') || '';

        this.headerSection = new HeaderSection();
        this.searchSection = new SearchSection({ query: this.query });
        this.sidebarSection = new SidebarSection({ variant: 'search' });
    }

    async render(container) {
        this.container = container;

        await Promise.all([
            this.headerSection.loadData(),
            this.searchSection.loadData(),
            this.sidebarSection.loadData()
        ]);

        this.setTitle(`${this.query} - Ara`);

        safeSetInnerHTML(container, `
            <div class="app-container">
                <div data-section="header"></div>
                <main class="flex">
                    <div data-section="search"></div>
                    <div data-section="sidebar"></div>
                </main>
            </div>
        `);

        const headerContainer = container.querySelector('[data-section="header"]');
        const searchContainer = container.querySelector('[data-section="search"]');
        const sidebarContainer = container.querySelector('[data-section="sidebar"]');

        if (headerContainer) {
            safeSetOuterHTML(headerContainer, this.headerSection.render());
            this.headerSection.element = container.querySelector('header');
        }
        if (searchContainer) {
            safeSetOuterHTML(searchContainer, this.searchSection.render());
            this.searchSection.element = container.querySelector('#search-results');
        }
        if (sidebarContainer) {
            safeSetOuterHTML(sidebarContainer, this.sidebarSection.render());
            this.sidebarSection.element = container.querySelector('#sidebar');
        }

        this.onMount();
    }

    onMount() {
        this.headerSection.onMount();
        this.searchSection.onMount();
        this.sidebarSection.onMount();
    }
}
