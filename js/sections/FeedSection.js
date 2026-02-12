import { Section, dataService } from '@/core';
import { Tabs, CreatePost, PostList } from '@/components/feed';

export class FeedSection extends Section {
    constructor(props = {}) {
        super(props);
        this.feedData = null;
        this.postsData = null;
        this.userData = null;
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
        const createPost = new CreatePost({
            userAvatar: this.userData?.avatar || 'assets/images/header/users/user-avatar.jpg',
            placeholder: this.feedData.createPost.placeholder,
            replyPermission: this.feedData.createPost.replyPermission,
            submitButtonText: this.feedData.createPost.submitButtonText,
            actions: this.feedData.createPost.actions
        });
        const postList = new PostList({ posts: this.postsData.posts });

        return `
            <section id="feed" class="w-full h-full">
                ${tabs.render()}
                ${createPost.render()}
                ${postList.render()}
            </section>
        `;
    }

    onMount() {
        super.onMount();
        this.initScrollSync();
        this.initPostSubmit();
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
                submitBtn.disabled = postInput.value.trim().length === 0;
            });
        }
    }
}


