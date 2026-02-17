import { dataService } from './DataService.js';

class PostService {
    constructor() {
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    notify(posts) {
        this.listeners.forEach(listener => listener(posts));
    }

    generatePostId(posts) {
        if (!posts || posts.length === 0) return '1';
        const maxId = Math.max(...posts.map(post => parseInt(post.id) || 0));
        return String(maxId + 1);
    }

    async createPost(postData) {
        try {
            const postsData = await dataService.load('posts');
            const userData = await dataService.load('user');

            if (!postsData || !userData) {
                throw new Error('Failed to load required data');
            }

            const posts = postsData.posts || [];

            const newPost = {
                id: this.generatePostId(posts),
                author: {
                    displayName: userData.displayName,
                    handle: userData.handle,
                    avatar: userData.avatar,
                    isVerified: userData.isVerified || false
                },
                content: {
                    text: postData.text,
                    media: null
                },
                stats: {
                    comments: 0,
                    retweets: 0,
                    likes: 0,
                    views: 0
                },
                timestamp: new Date().toISOString()
            };

            const updatedPosts = [newPost, ...posts];

            dataService.cache.set('posts', { posts: updatedPosts });
            dataService.save('posts', { posts: updatedPosts });

            this.notify(updatedPosts);

            return newPost;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async getPosts() {
        const postsData = await dataService.load('posts');
        return postsData?.posts || [];
    }

    async toggleLike(postId) {
        try {
            const postsData = await dataService.load('posts');
            if (!postsData) {
                throw new Error('Failed to load posts data');
            }

            const posts = postsData.posts || [];
            const postIndex = posts.findIndex(post => post.id === postId);

            if (postIndex === -1) {
                throw new Error(`Post with id ${postId} not found`);
            }

            const likedPosts = JSON.parse(localStorage.getItem('twitter-clone-liked-posts') || '[]');
            const isLiked = likedPosts.includes(postId);

            if (isLiked) {
                posts[postIndex].stats.likes = Math.max(0, posts[postIndex].stats.likes - 1);
                const updatedLikedPosts = likedPosts.filter(id => id !== postId);
                localStorage.setItem('twitter-clone-liked-posts', JSON.stringify(updatedLikedPosts));
            } else {
                posts[postIndex].stats.likes += 1;
                likedPosts.push(postId);
                localStorage.setItem('twitter-clone-liked-posts', JSON.stringify(likedPosts));
            }

            const updatedPostsData = { posts };
            dataService.cache.set('posts', updatedPostsData);
            dataService.save('posts', updatedPostsData);

            this.notify(posts);

            return { liked: !isLiked, likes: posts[postIndex].stats.likes };
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    }

    isPostLiked(postId) {
        const likedPosts = JSON.parse(localStorage.getItem('twitter-clone-liked-posts') || '[]');
        return likedPosts.includes(postId);
    }
}

export const postService = new PostService();
