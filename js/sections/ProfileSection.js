import { Section, dataService, postService, safeSetInnerHTML } from '@/core';
import { Tabs, PostList } from '@/components/feed';
import { ProfileCover, ProfileInfo, ProfileCarousel, ProfileEmptyState } from '@/components/profile';

export class ProfileSection extends Section {
    constructor(props = {}) {
        super(props);
        this.profileData = null;
        this.postsData = null;
        this.activeTab = 'posts';
        this.postListComponent = null;
        this.carouselComponent = null;
        this.unsubscribe = null;
    }

    async loadData() {
        const [profileData, postsData] = await Promise.all([
            dataService.load('profile'),
            dataService.load('posts')
        ]);
        this.profileData = profileData;
        this.postsData = postsData;
    }

    renderBackHeader() {
        const postCount = this.postsData?.posts?.length || 0;
        return `
            <div class="profile-back-header">
                <button class="profile-back-header__btn" data-link href="/">
                    <svg viewBox="0 0 24 24"><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></svg>
                </button>
                <div class="profile-back-header__info">
                    <span class="profile-back-header__name">${this.profileData.displayName}</span>
                    <span class="profile-back-header__count">${postCount} gönderi</span>
                </div>
            </div>
        `;
    }

    renderPostsTabContent() {
        this.postListComponent = new PostList({ posts: this.postsData?.posts || [] });

        const hasCarousel = this.profileData.carousel && this.profileData.carousel.items.length > 0;
        let carouselHtml = '';

        if (hasCarousel) {
            this.carouselComponent = new ProfileCarousel(this.profileData.carousel);
            carouselHtml = this.carouselComponent.render();
        }

        return `
            <div class="profile-tab-content" data-tab-content="posts">
                ${carouselHtml}
                ${this.postListComponent.render()}
            </div>
        `;
    }

    renderEmptyTabContent(tabId, title, description) {
        const emptyState = new ProfileEmptyState({ title, description });
        return `
            <div class="profile-tab-content" data-tab-content="${tabId}">
                ${emptyState.render()}
            </div>
        `;
    }

    renderTabContent(tabId) {
        switch (tabId) {
            case 'posts':
                return this.renderPostsTabContent();
            case 'replies':
                return this.renderEmptyTabContent(tabId, 'Henüz yanıt yok', 'Yanıtladığında burada görünür.');
            case 'highlights':
                return this.renderEmptyTabContent(tabId, 'Henüz öne çıkan içerik yok', 'Öne çıkan içeriklerin burada görünür.');
            case 'media':
                return this.renderEmptyTabContent(tabId, 'Henüz medya yok', 'Paylaştığın fotoğraf ve videolar burada görünür.');
            case 'likes':
                return this.renderEmptyTabContent(tabId, 'Henüz beğeni yok', 'Beğendiğin gönderiler burada görünür.');
            default:
                return '';
        }
    }

    render() {
        if (!this.profileData) {
            return '<section id="profile" class="w-full h-full">Yükleniyor...</section>';
        }

        const cover = new ProfileCover({
            cover: this.profileData.cover,
            avatar: this.profileData.avatar
        });

        const info = new ProfileInfo({
            displayName: this.profileData.displayName,
            handle: this.profileData.handle,
            isVerified: this.profileData.isVerified,
            bio: this.profileData.bio,
            joinDate: this.profileData.joinDate,
            location: this.profileData.location,
            website: this.profileData.website,
            following: this.profileData.following,
            followers: this.profileData.followers
        });

        const tabs = new Tabs({ tabs: this.profileData.tabs });

        return `
            <section id="profile" class="w-full h-full">
                ${this.renderBackHeader()}
                ${cover.render()}
                ${info.render()}
                ${tabs.render()}
                <div id="profile-tab-container">
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
        const container = this.element.querySelector('#profile-tab-container');
        if (!container) return;

        safeSetInnerHTML(container, this.renderTabContent(tabId));

        if (tabId === 'posts') {
            this.mountPostList();
            this.mountCarousel();
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

    mountCarousel() {
        if (this.carouselComponent) {
            const carouselEl = this.element.querySelector('.profile-carousel');
            if (carouselEl) {
                this.carouselComponent.element = carouselEl;
                this.carouselComponent.onMount();
            }
        }
    }

    onMount() {
        super.onMount();

        this.mountPostList();
        this.mountCarousel();

        this.element.addEventListener('click', (e) => {
            const tabButton = e.target.closest('.tab');
            if (tabButton && tabButton.dataset.tabId) {
                this.switchTab(tabButton.dataset.tabId);
            }
        });

        this.initScrollSync();

        this.unsubscribe = postService.subscribe((posts) => {
            if (this.activeTab === 'posts') {
                this.postsData = { posts };
                const container = this.element.querySelector('#profile-tab-container');
                if (container) {
                    safeSetInnerHTML(container, this.renderPostsTabContent());
                    this.mountPostList();
                    this.mountCarousel();
                }
            }
        });
    }

    initScrollSync() {
        const main = document.querySelector('main');
        const profile = document.getElementById('profile');
        const sidebar = document.getElementById('sidebar');

        if (main && profile && sidebar) {
            main.addEventListener('wheel', (e) => {
                e.preventDefault();
                profile.scrollTop += e.deltaY;
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
