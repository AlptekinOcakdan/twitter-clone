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
                <button class="profile-back-header__btn" data-link data-href="/">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z"></path></svg>
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

    renderPremiumUpsell(title, description, buttonText) {
        return `
            <div class="profile-premium-upsell">
                <h2 class="profile-premium-upsell__title">${title}</h2>
                <p class="profile-premium-upsell__desc">${description}</p>
                <button class="profile-premium-upsell__btn">
                    ${buttonText}
                </button>
            </div>
        `;
    }

    renderMockList(posts) {
        this.postListComponent = new PostList({ posts });
        return `
            <div class="profile-tab-content" data-tab-content="list">
                ${this.postListComponent.render()}
            </div>
        `;
    }

    renderLikesTabContent() {
        const likedIds = postService.getLikedPostIds();
        const allPosts = this.postsData?.posts || [];

        const postsMap = new Map(allPosts.map(p => [p.id, p]));

        const likedPosts = likedIds
            .slice()
            .reverse()
            .map(id => postsMap.get(id))
            .filter(post => post !== undefined);

        if (likedPosts.length === 0) {
            return this.renderEmptyTabContent('likes', 'Henüz beğeni yok', 'Beğendiğin gönderiler burada görünür.');
        }

        this.postListComponent = new PostList({ posts: likedPosts });

        return `
            <div class="profile-likes-notice">
                <svg viewBox="0 0 24 24">
                    <use href="/assets/images/profile/lock.svg#lock"/>
                </svg>
                <span class="profile-likes-notice__text">
                    Beğenilerin gizli. Onları sadece sen görebilirsin.
                </span>
            </div>
            <div class="profile-tab-content" data-tab-content="likes">
                ${this.postListComponent.render()}
            </div>
        `;
    }

    renderTabContent(tabId) {
        // Reset component references when switching tabs, unless reused
        if (tabId !== 'posts' && tabId !== 'replies' && tabId !== 'media' && tabId !== 'likes') {
            this.postListComponent = null;
        }

        switch (tabId) {
            case 'posts':
                return this.renderPostsTabContent();
            case 'replies':
                return this.renderMockList(this.postsData?.posts || []);
            case 'highlights':
                return this.renderPremiumUpsell(
                    'Profilinde öne çıkar',
                    'Profilinde gönderileri öne çıkarmak için Premium abonesi olman gerekir.',
                    "Premium'a Abone Ol"
                );
            case 'articles':
                 return this.renderPremiumUpsell(
                    "X'te Makale yaz",
                    "X'te Makale yazmak için Premium abonesi olman gerekir",
                    "Premium kademesine yükselt"
                );
            case 'media':
                const mediaPosts = (this.postsData?.posts || []).filter(p => p.content?.media);
                if (mediaPosts.length === 0) {
                     return this.renderEmptyTabContent(tabId, 'Henüz medya yok', 'Paylaştığın fotoğraf ve videolar burada görünür.');
                }
                return this.renderMockList(mediaPosts);
            case 'likes':
                return this.renderLikesTabContent();
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

        if (['posts', 'replies', 'media', 'likes'].includes(tabId)) {
            this.mountPostList();
        }
        if (tabId === 'posts') {
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
