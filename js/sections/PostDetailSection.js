import { Section, dataService, postService, safeSetInnerHTML } from '@/core';
import { Post, PostList } from '@/components/feed';

export class PostDetailSection extends Section {
    constructor(props = {}) {
        super(props);
        this.postId = props.postId;
        this.postsData = null;
        this.mainPost = null;
        this.replies = [];
        this.mainPostComponent = null;
        this.repliesListComponent = null;
        this.unsubscribe = null;
    }

    async loadData() {
        this.postsData = await dataService.load('posts');
        this.processPostData();
    }

    processPostData() {
        if (!this.postsData) return;
        const posts = this.postsData.posts || [];
        this.mainPost = posts.find(p => p.id === this.postId);
        this.replies = posts.filter(p => p.replyTo === this.postId);
    }

    render() {
        if (!this.mainPost) {
            return '<section id="post-detail" class="w-full h-full">Gonderi bulunamadi.</section>';
        }

        const postsMap = new Map((this.postsData?.posts || []).map(p => [p.id, p]));

        this.mainPostComponent = new Post({
            ...this.mainPost,
            postsMap
        });

        this.repliesListComponent = new PostList({ posts: this.replies });

        return `
            <section id="post-detail" class="w-full h-full">
                <div class="post-detail-header flex items-center">
                    <button class="back-btn">
                        <svg viewBox="0 0 24 24"><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></svg>
                    </button>
                    <h2 class="post-detail-title">Gonderi</h2>
                </div>
                <div class="post-detail-main">
                    ${this.mainPostComponent.render()}
                </div>
                <div class="post-detail-replies">
                    ${this.repliesListComponent.render()}
                </div>
            </section>
        `;
    }

    refreshReplies(posts) {
        this.postsData = { posts };
        this.processPostData();

        const repliesContainer = this.element?.querySelector('.post-detail-replies');
        if (!repliesContainer) return;

        const postList = new PostList({ posts: this.replies });
        const tempContainer = document.createElement('div');
        safeSetInnerHTML(tempContainer, postList.render());

        const newContainer = tempContainer.querySelector('#posts-container');
        const existingContainer = repliesContainer.querySelector('#posts-container');
        if (newContainer && existingContainer) {
            safeSetInnerHTML(existingContainer, newContainer.innerHTML);
            postList.element = existingContainer;
            postList.onMount();
        }
    }

    onMount() {
        super.onMount();

        const mainPostEl = this.element?.querySelector('.post-detail-main .post');
        if (mainPostEl && this.mainPostComponent) {
            this.mainPostComponent.element = mainPostEl;
            this.mainPostComponent.onMount();
        }

        const repliesContainer = this.element?.querySelector('#posts-container');
        if (repliesContainer && this.repliesListComponent) {
            this.repliesListComponent.element = repliesContainer;
            this.repliesListComponent.onMount();
        }

        const backBtn = this.element?.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.back();
            });
        }

        this.unsubscribe = postService.subscribe((posts) => {
            this.refreshReplies(posts);
        });
    }

    destroy() {
        if (this.unsubscribe) this.unsubscribe();
        super.destroy();
    }
}
