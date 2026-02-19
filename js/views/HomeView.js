import { View, safeSetInnerHTML, safeSetOuterHTML } from '@/core';
import { FeedSection, HeaderSection, SidebarSection } from '@/sections';

export class HomeView extends View {
    constructor() {
        super();
        this.headerSection = new HeaderSection();
        this.feedSection = new FeedSection();
        this.sidebarSection = new SidebarSection();
    }

    async render(container) {
        this.container = container;

        await Promise.all([
            this.headerSection.loadData(),
            this.feedSection.loadData(),
            this.sidebarSection.loadData()
        ]);

        this.setTitle('Anasayfa');

        safeSetInnerHTML(container, `
            <div class="app-container">
                <div data-section="header"></div>
                <main class="flex">
                    <div data-section="feed"></div>
                    <div data-section="sidebar"></div>
                </main>
            </div>
        `);

        const headerContainer = container.querySelector('[data-section="header"]');
        const feedContainer = container.querySelector('[data-section="feed"]');
        const sidebarContainer = container.querySelector('[data-section="sidebar"]');

        if (headerContainer) {
            safeSetOuterHTML(headerContainer, this.headerSection.render());
            this.headerSection.element = container.querySelector('header');
        }
        if (feedContainer) {
            safeSetOuterHTML(feedContainer, this.feedSection.render());
            this.feedSection.element = container.querySelector('#feed');
        }
        if (sidebarContainer) {
            safeSetOuterHTML(sidebarContainer, this.sidebarSection.render());
            this.sidebarSection.element = container.querySelector('#sidebar');
        }

        this.onMount();
    }

    onMount() {
        this.headerSection.onMount();
        this.feedSection.onMount();
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
