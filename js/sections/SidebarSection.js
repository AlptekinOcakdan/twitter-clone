import { Section, dataService } from '@/core';
import { SearchBox, PremiumCard, TrendsCard, TopicsCard, WhoToFollow, Footer } from '@/components/sidebar';

export class SidebarSection extends Section {
    constructor(props = {}) {
        super(props);
        this.sidebarData = null;
        this.searchData = null;
        this.variant = props.variant || 'home';
        this.searchBoxComponent = null;
    }

    async loadData() {
        const [sidebarData, searchData] = await Promise.all([
            dataService.load('sidebar'),
            dataService.load('search')
        ]);
        this.sidebarData = sidebarData;
        this.searchData = searchData;
    }

    renderHome() {
        this.searchBoxComponent = new SearchBox({ searchData: this.searchData });
        const premiumCard = new PremiumCard(this.sidebarData.premium);
        const trendsCard = new TrendsCard(this.sidebarData.trends);
        const whoToFollow = new WhoToFollow(this.sidebarData.whoToFollow);
        const footer = new Footer(this.sidebarData.footer);

        return `
            ${this.searchBoxComponent.render()}
            ${premiumCard.render()}
            ${trendsCard.render()}
            ${whoToFollow.render()}
            ${footer.render()}
        `;
    }

    renderProfile() {
        this.searchBoxComponent = new SearchBox({ searchData: this.searchData });
        const youMightLike = new WhoToFollow(this.sidebarData.youMightLike);
        const trendsCard = new TrendsCard(this.sidebarData.trends);
        const footer = new Footer(this.sidebarData.footer);

        return `
            ${this.searchBoxComponent.render()}
            ${youMightLike.render()}
            ${trendsCard.render()}
            ${footer.render()}
        `;
    }

    renderExplore() {
        const whoToFollow = new WhoToFollow(this.sidebarData.whoToFollow);
        const footer = new Footer(this.sidebarData.footer);

        return `
            ${whoToFollow.render()}
            ${footer.render()}
        `;
    }

    render() {
        if (!this.sidebarData) {
            return '<section id="sidebar" class="h-full">Yükleniyor...</section>';
        }

        let content;
        switch (this.variant) {
            case 'profile':
                content = this.renderProfile();
                break;
            case 'explore':
                content = this.renderExplore();
                break;
            default:
                content = this.renderHome();
                break;
        }

        return `
            <section id="sidebar" class="h-full sidebar--${this.variant}">
            <div id="sidebar-separator"></div>
                <div id="sidebar-content">
                    ${content}
                </div>
            </section>
        `;
    }

    onMount() {
        super.onMount();
        if (this.searchBoxComponent) {
            const searchEl = this.element?.querySelector('.sidebar-search');
            if (searchEl) {
                this.searchBoxComponent.element = searchEl;
                this.searchBoxComponent.onMount();
            }
        }
    }
}
