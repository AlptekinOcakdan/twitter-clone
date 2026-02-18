import { Section, dataService } from '@/core';
import { SearchBox, PremiumCard, TrendsCard, TopicsCard, WhoToFollow, Footer } from '@/components/sidebar';

export class SidebarSection extends Section {
    constructor(props = {}) {
        super(props);
        this.sidebarData = null;
        this.variant = props.variant || 'home';
    }

    async loadData() {
        this.sidebarData = await dataService.load('sidebar');
    }

    renderHome() {
        const searchBox = new SearchBox();
        const premiumCard = new PremiumCard(this.sidebarData.premium);
        const trendsCard = new TrendsCard(this.sidebarData.trends);
        const whoToFollow = new WhoToFollow(this.sidebarData.whoToFollow);
        const footer = new Footer(this.sidebarData.footer);

        return `
            ${searchBox.render()}
            ${premiumCard.render()}
            ${trendsCard.render()}
            ${whoToFollow.render()}
            ${footer.render()}
        `;
    }

    renderProfile() {
        const searchBox = new SearchBox();
        const whoToFollow = new WhoToFollow(this.sidebarData.whoToFollow);
        const topicsCard = new TopicsCard(this.sidebarData.topics);
        const trendsCard = new TrendsCard(this.sidebarData.trends);
        const footer = new Footer(this.sidebarData.footer);

        return `
            ${searchBox.render()}
            ${whoToFollow.render()}
            ${topicsCard.render()}
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
                <div id="sidebar-content">
                    ${content}
                </div>
            </section>
        `;
    }
}


