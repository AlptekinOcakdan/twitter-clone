import { View, safeSetInnerHTML, safeSetOuterHTML } from '@/core';
import { HeaderSection, SidebarSection, PostDetailSection } from '@/sections';

export class PostDetailView extends View {
    constructor(params = {}) {
        super();
        this.postId = params.id;
        this.headerSection = new HeaderSection();
        this.postDetailSection = new PostDetailSection({ postId: this.postId });
        this.sidebarSection = new SidebarSection();
    }

    async render(container) {
        this.container = container;

        await Promise.all([
            this.headerSection.loadData(),
            this.postDetailSection.loadData(),
            this.sidebarSection.loadData()
        ]);

        this.setTitle('Gonderi');

        safeSetInnerHTML(container, `
            <div class="app-container">
                <div data-section="header"></div>
                <main class="flex">
                    <div data-section="post-detail"></div>
                    <div data-section="sidebar"></div>
                </main>
            </div>
        `);

        const headerContainer = container.querySelector('[data-section="header"]');
        const detailContainer = container.querySelector('[data-section="post-detail"]');
        const sidebarContainer = container.querySelector('[data-section="sidebar"]');

        if (headerContainer) {
            safeSetOuterHTML(headerContainer, this.headerSection.render());
            this.headerSection.element = container.querySelector('header');
        }
        if (detailContainer) {
            safeSetOuterHTML(detailContainer, this.postDetailSection.render());
            this.postDetailSection.element = container.querySelector('#post-detail');
        }
        if (sidebarContainer) {
            safeSetOuterHTML(sidebarContainer, this.sidebarSection.render());
            this.sidebarSection.element = container.querySelector('#sidebar');
        }

        this.onMount();
    }

    onMount() {
        this.headerSection.onMount();
        this.postDetailSection.onMount();
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
