import { Section, dataService, postService, safeSetInnerHTML } from '@/core';
import { Tabs, PostList } from '@/components/feed';
import {
    ExploreSearchBox,
    ExploreTrendsSection,
    ExploreWhoToFollow,
    ExploreTrendingCard,
    ExploreNumberedTrend,
    ExploreTrendItem
} from '@/components/explore';

export class ExploreSection extends Section {
    constructor(props = {}) {
        super(props);
        this.exploreData = null;
        this.postsData = null;
        this.activeTab = 'for-you';
        this.postListComponent = null;
        this.unsubscribe = null;
    }

    async loadData() {
        const [exploreData, postsData] = await Promise.all([
            dataService.load('explore'),
            dataService.load('posts')
        ]);

        if (exploreData && !exploreData.tabContents) {
            dataService.clearStorage('explore');
            dataService.clearCache('explore');
            this.exploreData = await dataService.load('explore');
        } else {
            this.exploreData = exploreData;
        }

        this.postsData = postsData;
    }

    renderForYouContent() {
        this.postListComponent = new PostList({ posts: this.postsData?.posts || [] });
        const trendsSection = new ExploreTrendsSection(this.exploreData.forYou.trends);
        const whoToFollow = new ExploreWhoToFollow(this.exploreData.forYou.whoToFollow);

        return `
            <div class="explore-tab-content" data-tab-content="for-you">
                ${trendsSection.render()}
                ${whoToFollow.render()}
                ${this.postListComponent.render()}
            </div>
        `;
    }

    renderTrendingContent() {
        const data = this.exploreData.tabContents.trending;
        const card = new ExploreTrendingCard(data.card);

        const numberedItemsHtml = data.items.map(item => {
            const numberedTrend = new ExploreNumberedTrend(item);
            return numberedTrend.render();
        }).join('');

        return `
            <div class="explore-tab-content" data-tab-content="trending">
                ${card.render()}
                <div class="explore-numbered-list">
                    ${numberedItemsHtml}
                </div>
            </div>
        `;
    }

    renderCategoryContent(tabId) {
        const data = this.exploreData.tabContents[tabId];
        if (!data) return '<div class="explore-tab-content" data-tab-content="' + tabId + '"></div>';

        const itemsHtml = data.items.map(item => {
            const trendItem = new ExploreTrendItem(item);
            return trendItem.render();
        }).join('');

        return `
            <div class="explore-tab-content" data-tab-content="${tabId}">
                <div class="explore-category-list">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }

    renderTabContent(tabId) {
        switch (tabId) {
            case 'for-you':
                return this.renderForYouContent();
            case 'trending':
                return this.renderTrendingContent();
            case 'news':
            case 'sports':
            case 'entertainment':
                return this.renderCategoryContent(tabId);
            default:
                return '';
        }
    }

    render() {
        if (!this.exploreData) {
            return '<section id="explore" class="w-full h-full">Yükleniyor...</section>';
        }

        const searchBox = new ExploreSearchBox(this.exploreData.search);
        const tabs = new Tabs({ tabs: this.exploreData.tabs });

        return `
            <section id="explore" class="w-full h-full">
                ${searchBox.render()}
                ${tabs.render()}
                <div id="explore-tab-container">
                    ${this.renderTabContent(this.activeTab)}
                </div>
            </section>
        `;
    }

    switchTab(tabId) {
        if (tabId === this.activeTab) return;

        const tabButtons = this.element.querySelectorAll('.tab');
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tabId === tabId);
        });

        this.activeTab = tabId;
        const container = this.element.querySelector('#explore-tab-container');
        if (!container) return;

        safeSetInnerHTML(container, this.renderTabContent(tabId));

        if (tabId === 'for-you') {
            this.mountPostList();
        }
    }

    mountPostList() {
        if (this.postListComponent) {
            const postsContainer = this.element.querySelector('#posts-container');
            if (postsContainer) {
                this.postListComponent.element = postsContainer;
                this.postListComponent.onMount();
            }
        }
    }

    onMount() {
        super.onMount();

        this.mountPostList();

        this.element.addEventListener('click', (e) => {
            const tabButton = e.target.closest('.tab');
            if (tabButton && tabButton.dataset.tabId) {
                this.switchTab(tabButton.dataset.tabId);
            }
        });

        this.initScrollSync();

        this.unsubscribe = postService.subscribe((posts) => {
            if (this.activeTab === 'for-you') {
                this.postsData = { posts };
                const container = this.element.querySelector('#explore-tab-container');
                if (container) {
                    safeSetInnerHTML(container, this.renderForYouContent());
                    this.mountPostList();
                }
            }
        });
    }

    initScrollSync() {
        const main = document.querySelector('main');
        const explore = document.getElementById('explore');
        const sidebar = document.getElementById('sidebar');

        if (main && explore && sidebar) {
            main.addEventListener('wheel', (e) => {
                e.preventDefault();
                explore.scrollTop += e.deltaY;
                sidebar.scrollTop += e.deltaY;
            }, { passive: false });
        }
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        super.destroy();
    }
}
