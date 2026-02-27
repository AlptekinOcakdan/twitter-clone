import { Section, dataService, postService, safeSetInnerHTML, router } from '@/core';
import { Tabs, PostList } from '@/components/feed';
import { SearchSearchBox, SearchMediaGrid, SearchListItem, SearchPeopleCard, SearchFollowItem } from '@/components/search';

export class SearchSection extends Section {
    constructor(props = {}) {
        super(props);
        this.query = props.query || '';
        this.searchResultsData = null;
        this.postsData = null;
        this.searchData = null;
        this.activeTab = 'popular';
        this.postListComponent = null;
        this.searchBoxComponent = null;
        this.unsubscribe = null;
    }

    async loadData() {
        const [searchResultsData, postsData, searchData] = await Promise.all([
            dataService.load('search-results'),
            dataService.load('posts'),
            dataService.load('search')
        ]);
        this.searchResultsData = searchResultsData;
        this.postsData = postsData;
        this.searchData = searchData;
    }

    getPostsSortedByPopularity() {
        const posts = this.postsData?.posts || [];
        return [...posts].sort((a, b) => b.stats.likes - a.stats.likes);
    }

    getPostsSortedByLatest() {
        const posts = this.postsData?.posts || [];
        return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    getProfiles() {
        return this.searchData?.profiles || [];
    }

    getMediaItems() {
        const posts = this.postsData?.posts || [];
        return posts
            .filter(post => post.content.media)
            .map(post => post.content.media);
    }

    getLists() {
        return this.searchResultsData?.lists || [];
    }

    renderPopularContent() {
        const posts = this.getPostsSortedByPopularity();
        const profiles = this.getProfiles();
        this.postListComponent = new PostList({ posts });
        const peopleCard = new SearchPeopleCard({ users: profiles });

        return `
            <div class="search-tab-content" data-tab-content="popular">
                ${peopleCard.render()}
                ${this.postListComponent.render()}
            </div>
        `;
    }

    renderLatestContent() {
        const posts = this.getPostsSortedByLatest();
        this.postListComponent = new PostList({ posts });

        return `
            <div class="search-tab-content" data-tab-content="latest">
                ${this.postListComponent.render()}
            </div>
        `;
    }

    renderPeopleContent() {
        const profiles = this.getProfiles();

        if (profiles.length === 0) {
            return `
                <div class="search-tab-content" data-tab-content="people">
                    <div class="search-empty-state">
                        <p>"${this.query}" ile eşleşen kişi bulunamadı</p>
                    </div>
                </div>
            `;
        }

        const profilesHtml = profiles.map(profile => {
            const followItem = new SearchFollowItem(profile);
            return followItem.render();
        }).join('');

        return `
            <div class="search-tab-content" data-tab-content="people">
                <div class="search-people-list">
                    ${profilesHtml}
                </div>
            </div>
        `;
    }

    renderMediaContent() {
        const mediaItems = this.getMediaItems();
        const mediaGrid = new SearchMediaGrid({ items: mediaItems });

        return `
            <div class="search-tab-content" data-tab-content="media">
                ${mediaGrid.render()}
            </div>
        `;
    }

    renderListsContent() {
        const lists = this.getLists();

        if (lists.length === 0) {
            return `
                <div class="search-tab-content" data-tab-content="lists">
                    <div class="search-empty-state">
                        <p>"${this.query}" ile eşleşen liste bulunamadı</p>
                    </div>
                </div>
            `;
        }

        const listsHtml = lists.map(list => {
            const listItem = new SearchListItem(list);
            return listItem.render();
        }).join('');

        return `
            <div class="search-tab-content" data-tab-content="lists">
                <div class="search-lists-container">
                    ${listsHtml}
                </div>
            </div>
        `;
    }

    renderTabContent(tabId) {
        switch (tabId) {
            case 'popular':
                return this.renderPopularContent();
            case 'latest':
                return this.renderLatestContent();
            case 'people':
                return this.renderPeopleContent();
            case 'media':
                return this.renderMediaContent();
            case 'lists':
                return this.renderListsContent();
            default:
                return '';
        }
    }

    render() {
        if (!this.searchResultsData) {
            return '<section id="search-results" class="w-full h-full">Yükleniyor...</section>';
        }

        this.searchBoxComponent = new SearchSearchBox({ query: this.query });
        const tabs = new Tabs({ tabs: this.searchResultsData.tabs });

        return `
            <section id="search-results" class="w-full h-full">
                ${this.searchBoxComponent.render()}
                ${tabs.render()}
                <div id="search-tab-container">
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
        const container = this.element.querySelector('#search-tab-container');
        if (!container) return;

        safeSetInnerHTML(container, this.renderTabContent(tabId));

        if (tabId === 'popular' || tabId === 'latest') {
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

        if (this.searchBoxComponent) {
            const searchBoxEl = this.element?.querySelector('.search-results-search');
            if (searchBoxEl) {
                this.searchBoxComponent.element = searchBoxEl;
                this.searchBoxComponent.onMount();
            }
        }

        this.mountPostList();

        this.element.addEventListener('click', (e) => {
            const tabButton = e.target.closest('.tab');
            if (tabButton && tabButton.dataset.tabId) {
                this.switchTab(tabButton.dataset.tabId);
                return;
            }

            const tabSwitchLink = e.target.closest('[data-tab-switch]');
            if (tabSwitchLink) {
                e.preventDefault();
                this.switchTab(tabSwitchLink.dataset.tabSwitch);
            }
        });

        this.initScrollSync();

        this.unsubscribe = postService.subscribe((posts) => {
            if (this.activeTab === 'popular' || this.activeTab === 'latest') {
                this.postsData = { posts };
                const container = this.element.querySelector('#search-tab-container');
                if (container) {
                    safeSetInnerHTML(container, this.renderTabContent(this.activeTab));
                    this.mountPostList();
                }
            }
        });
    }

    initScrollSync() {
        const main = document.querySelector('main');
        const searchResults = document.getElementById('search-results');
        const sidebar = document.getElementById('sidebar');

        if (main && searchResults && sidebar) {
            main.addEventListener('wheel', (e) => {
                e.preventDefault();
                searchResults.scrollTop += e.deltaY;
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
