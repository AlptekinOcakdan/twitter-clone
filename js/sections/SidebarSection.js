import { Section, dataService, router } from '@/core';
import { SearchBox, PremiumCard, TrendsCard, TopicsCard, WhoToFollow, Footer } from '@/components/sidebar';
import { TrendMoreMenu } from '@/components/common';

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

    renderSearch() {
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
            case 'search':
                content = this.renderSearch();
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
        this.initTrendMoreMenus();
        this.initTrendClickNavigation();
    }

    initTrendClickNavigation() {
        this.element?.addEventListener('click', (e) => {
            if (e.target.closest('.trend-more')) return;

            const trendItem = e.target.closest('.trend-item');
            if (trendItem) {
                const trendName = trendItem.querySelector('.trend-name')?.textContent || '';
                if (trendName) {
                    router.navigate(`/search?q=${encodeURIComponent(trendName)}`);
                }
            }
        });
    }

    initTrendMoreMenus() {
        this.element?.addEventListener('click', (e) => {
            const moreBtn = e.target.closest('.trend-more');
            if (moreBtn) {
                e.preventDefault();
                e.stopPropagation();
                const trendItem = moreBtn.closest('.trend-item');
                const trendId = trendItem?.dataset.trendId || '';
                const trendName = trendItem?.querySelector('.trend-name')?.textContent || '';
                const menu = new TrendMoreMenu({ trendId, trendName });
                menu.open(moreBtn);
            }
        });
    }
}
