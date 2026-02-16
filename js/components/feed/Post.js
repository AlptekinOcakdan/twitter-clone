import { Component, postService } from '@/core';
import { formatRelativeTime } from '@/utils/timeUtils';

export class Post extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: '',
            author: {
                displayName: '',
                handle: '',
                avatar: '',
                isVerified: false
            },
            content: {
                text: '',
                media: null
            },
            stats: {
                comments: 0,
                retweets: 0,
                likes: 0,
                views: 0
            },
            timestamp: '',
            ...props
        };
        this.isLiked = false;

        this.handleLikeClick = this.handleLikeClick.bind(this);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace('.0', '') + ' M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + ' B';
        }
        return num.toString();
    }

    renderVerifiedIcon() {
        if (!this.props.author.isVerified) return '';

        return `
            <svg class="verified-icon" viewBox="0 0 24 24">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.01s-2.62-1.27-4.01-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.98-.2-4.02.81s-1.27 2.62-.81 4.01c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 4.01s2.62 1.27 4.01.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.98.2 4.02-.81s1.27-2.62.81-4.01c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.35-6.2 6.78z"></path>
            </svg>
        `;
    }

    formatTimestamp(timestamp) {
        if (!timestamp) return '';

        if (!timestamp.includes('T') && !timestamp.includes('Z')) {
            return timestamp;
        }

        return formatRelativeTime(timestamp);
    }

    async handleLikeClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const { id } = this.props;
        const likeButton = this.element.querySelector('.like .interaction-btn');
        const likeCount = this.element.querySelector('.like .interaction-count');

        if (!likeButton || !likeCount) return;

        try {
            const result = await postService.toggleLike(id);

            // Update UI
            this.isLiked = result.liked;
            likeButton.classList.toggle('liked', this.isLiked);
            likeCount.textContent = this.formatNumber(result.likes);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    }

    renderMedia() {
        const { media } = this.props.content;
        if (!media) return '';

        if (media.type === 'image') {
            return `
                <div class="post-media">
                    <img src="${media.url}" alt="${media.alt || ''}" class="post-image">
                </div>
            `;
        }

        return '';
    }

    onMount() {
        // Check if post is liked when mounting
        this.isLiked = postService.isPostLiked(this.props.id);

        // Add like button event listener
        const likeButton = this.element.querySelector('.like .interaction-btn');
        if (likeButton) {
            // Set initial liked state
            if (this.isLiked) {
                likeButton.classList.add('liked');
            }

            likeButton.addEventListener('click', this.handleLikeClick);
        }
    }

    render() {
        const { id, author, content, stats, timestamp } = this.props;

        return `
            <article class="post flex" data-post-id="${id}">
                <div class="post-avatar-col">
                    <img src="${author.avatar}" alt="${author.displayName}" class="user-avatar">
                </div>
                <div class="post-content-col grow">
                    <div class="post-header flex justify-between">
                        <div class="post-user-info flex">
                            <span class="post-display-name">${author.displayName}</span>
                            ${this.renderVerifiedIcon()}
                            <span class="post-handle">${author.handle}</span>
                            <span class="post-dot">·</span>
                            <span class="post-time">${this.formatTimestamp(timestamp)}</span>
                        </div>
                        <div class="post-more-btn flex">
                            <button>
                                <svg viewBox="0 0 24 24"><use href="assets/images/main/post/grok.svg#grok"/></svg>
                            </button>
                            <button>
                                <svg viewBox="0 0 24 24"><use href="assets/images/main/post/more.svg#more"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="post-text">
                        ${content.text}
                    </div>
                    ${this.renderMedia()}
                    <div class="post-interactions flex items-center justify-between">
                        <div class="interaction-group comment">
                            <button class="interaction-btn">
                                <svg viewBox="0 0 24 24"><use href="assets/images/main/post/comment.svg#comment"/></svg>
                            </button>
                            <span class="interaction-count">${this.formatNumber(stats.comments)}</span>
                        </div>
                        <div class="interaction-group retweet">
                            <button class="interaction-btn">
                                <svg viewBox="0 0 24 24"><use href="assets/images/main/post/retweet.svg#retweet"/></svg>
                            </button>
                            <span class="interaction-count">${this.formatNumber(stats.retweets)}</span>
                        </div>
                        <div class="interaction-group like">
                            <button class="interaction-btn">
                                <svg viewBox="0 0 24 24"><use href="assets/images/main/post/like.svg#like"/></svg>
                            </button>
                            <span class="interaction-count">${this.formatNumber(stats.likes)}</span>
                        </div>
                        <div class="interaction-group views">
                            <button class="interaction-btn">
                                <svg viewBox="0 0 24 24"><use href="assets/images/main/post/statics.svg#statics"/></svg>
                            </button>
                            <span class="interaction-count">${this.formatNumber(stats.views)}</span>
                        </div>
                        <div class="interaction-icons-right flex items-center">
                            <button class="interaction-btn save" title="Kaydet">
                                <svg viewBox="0 0 24 24"><use href="assets/images/main/post/save.svg#save"/></svg>
                            </button>
                            <button class="interaction-btn share" title="Paylaş">
                                <svg viewBox="0 0 24 24"><use href="assets/images/main/post/share.svg#share"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }
}

