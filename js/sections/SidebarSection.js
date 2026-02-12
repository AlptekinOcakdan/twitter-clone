import { Section, dataService } from '@/core';
import { SearchBox, PremiumCard, TrendsCard, WhoToFollow, Footer } from '@/components/sidebar';

export class SidebarSection extends Section {
    constructor(props = {}) {
        super(props);
        this.sidebarData = null;
    }

    async loadData() {
        this.sidebarData = await dataService.load('sidebar');
    }

    render() {
        if (!this.sidebarData) {
            return '<section id="sidebar" class="h-full">Yükleniyor...</section>';
        }

        const searchBox = new SearchBox();
        const premiumCard = new PremiumCard(this.sidebarData.premium);
        const trendsCard = new TrendsCard(this.sidebarData.trends);
        const whoToFollow = new WhoToFollow(this.sidebarData.whoToFollow);
        const footer = new Footer(this.sidebarData.footer);

        return `
            <section id="sidebar" class="h-full">
                <div id="sidebar-content">
                    ${searchBox.render()}
                    ${premiumCard.render()}
                    ${trendsCard.render()}
                    ${whoToFollow.render()}
                    ${footer.render()}
                </div>
            </section>
        `;
    }
}


