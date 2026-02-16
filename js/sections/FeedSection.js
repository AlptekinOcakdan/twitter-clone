import { Section, dataService, postService } from '@/core';
import { Tabs, CreatePost, PostList } from '@/components/feed';

export class FeedSection extends Section {
    constructor(props = {}) {
        super(props);
        this.feedData = null;
        this.postsData = null;
        this.userData = null;
        this.unsubscribe = null;
        this.createPostComponent = null;
        this.postListComponent = null;
    }

    async loadData() {
        const [feedData, postsData, userData] = await Promise.all([
            dataService.load('feed'),
            dataService.load('posts'),
            dataService.load('user')
        ]);
        this.feedData = feedData;
        this.postsData = postsData;
        this.userData = userData;
    }

    render() {
        if (!this.feedData || !this.postsData) {
            return '<section id="feed" class="w-full h-full">Yükleniyor...</section>';
        }

        const tabs = new Tabs({ tabs: this.feedData.tabs });
        this.createPostComponent = new CreatePost({
            userAvatar: this.userData?.avatar || 'assets/images/header/users/user-avatar.jpg',
            placeholder: this.feedData.createPost.placeholder,
            replyPermission: this.feedData.createPost.replyPermission,
            submitButtonText: this.feedData.createPost.submitButtonText,
            actions: this.feedData.createPost.actions
        });
        this.postListComponent = new PostList({ posts: this.postsData.posts });

        return `
            <section id="feed" class="w-full h-full">
                ${tabs.render()}
                ${this.createPostComponent.render()}
                ${this.postListComponent.render()}
            </section>
        `;
    }

    refreshFeed(posts) {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;

        const postList = new PostList({ posts });

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = postList.render();

        const newPostsContainer = tempContainer.querySelector('#posts-container');
        if (newPostsContainer) {
            postsContainer.innerHTML = newPostsContainer.innerHTML;

            // Mount the PostList component to initialize like buttons
            postList.element = postsContainer;
            postList.onMount();
        }
    }

    onMount() {
        super.onMount();
        this.initScrollSync();
        this.initPostSubmit();

        // Mount CreatePost component to enable textarea auto-expansion
        if (this.createPostComponent) {
            const createPostElement = document.getElementById('create-post');
            if (createPostElement) {
                this.createPostComponent.element = createPostElement;
                this.createPostComponent.onMount();
            }
        }

        // Mount PostList component to initialize like buttons on initial load
        if (this.postListComponent) {
            const postsContainer = document.getElementById('posts-container');
            if (postsContainer) {
                this.postListComponent.element = postsContainer;
                this.postListComponent.onMount();
            }
        }

        this.unsubscribe = postService.subscribe((posts) => {
            this.refreshFeed(posts);
        });
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        super.destroy();
    }

    initScrollSync() {
        const main = document.querySelector('main');
        const feed = document.getElementById('feed');
        const sidebar = document.getElementById('sidebar');

        if (main && feed && sidebar) {
            main.addEventListener('wheel', (e) => {
                e.preventDefault();
                feed.scrollTop += e.deltaY;
                sidebar.scrollTop += e.deltaY;
            }, { passive: false });
        }
    }

    initPostSubmit() {
        const postInput = document.getElementById('post-input');
        const submitBtn = document.getElementById('btn-submit-post');

        if (postInput && submitBtn) {
            postInput.addEventListener('input', () => {
                const isEmpty = postInput.value.trim().length === 0;
                submitBtn.disabled = isEmpty;

                // Toggle opacity class based on disabled state
                if (isEmpty) {
                    submitBtn.classList.add('btn-disabled-opacity');
                } else {
                    submitBtn.classList.remove('btn-disabled-opacity');
                }
            });

            submitBtn.addEventListener('click', () => {
                if (this.createPostComponent) {
                    this.createPostComponent.handleSubmit();
                }
            });
        }
    }
}


