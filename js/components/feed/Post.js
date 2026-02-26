import { Component, postService, router, safeCreateFragment } from '@/core';
import { formatRelativeTime } from '@/utils/timeUtils';
import { PostMoreMenu } from './PostMoreMenu.js';
import { SharePopover } from './SharePopover.js';
import { RetweetPopover } from './RetweetPopover.js';

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
            quoteOf: null,
            replyTo: null,
            isRepost: false,
            isThreadParent: false,
            isThreadReply: false,
            postsMap: new Map(),
            ...props
        };
        this.isLiked = false;
        this.isRetweeted = false;
        this.isBookmarked = false;

        this.handleLikeClick = this.handleLikeClick.bind(this);
        this.handleRetweetClick = this.handleRetweetClick.bind(this);
        this.handleShareClick = this.handleShareClick.bind(this);
        this.handleBookmarkClick = this.handleBookmarkClick.bind(this);
        this.handleCommentClick = this.handleCommentClick.bind(this);
        this.handleMoreClick = this.handleMoreClick.bind(this);
        this.handlePostClick = this.handlePostClick.bind(this);
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

    renderQuotedVerifiedIcon(author) {
        if (!author.isVerified) return '';

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
            this.isLiked = result.liked;
            likeButton.classList.toggle('liked', this.isLiked);
            likeCount.textContent = this.formatNumber(result.likes);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    }

    handleRetweetClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const retweetGroup = this.element.querySelector('.retweet');
        if (!retweetGroup) return;

        const popover = new RetweetPopover({
            postId: this.props.id,
            anchorElement: retweetGroup,
            onRepost: () => this.toggleRepost(),
            onQuote: () => this.openQuoteDialog()
        });
        popover.open();
    }

    async toggleRepost() {
        const { id } = this.props;
        const retweetButton = this.element.querySelector('.retweet .interaction-btn');
        const retweetCount = this.element.querySelector('.retweet .interaction-count');

        if (!retweetButton || !retweetCount) return;

        try {
            const result = await postService.toggleRetweet(id);
            this.isRetweeted = result.retweeted;
            retweetButton.classList.toggle('retweeted', this.isRetweeted);
            retweetCount.textContent = this.formatNumber(result.retweets);

            const feedContainer = document.getElementById('posts-container');
            if (!feedContainer) return;

            if (this.isRetweeted) {
                const repostComponent = new Post({
                    ...this.props,
                    isRepost: true,
                    isThreadParent: false,
                    isThreadReply: false
                });

                const fragment = safeCreateFragment(repostComponent.render());
                const repostElement = fragment.firstElementChild;
                feedContainer.prepend(repostElement);
                repostComponent.element = repostElement;
                repostComponent.onMount();
            } else {
                const existingRepost = feedContainer.querySelector(
                    `.post[data-post-id="${id}"][data-repost="true"]`
                );
                if (existingRepost) {
                    existingRepost.remove();
                }
            }
        } catch (error) {
            console.error('Failed to toggle retweet:', error);
        }
    }

    openQuoteDialog() {
        Promise.all([
            import('@/components/post/DialogQuoteCreate.js'),
            import('@/components/common/Dialog.js')
        ]).then(([{ DialogQuoteCreate }, { Dialog }]) => {
            const quoteCreate = new DialogQuoteCreate({
                quotedPost: this.props,
                onQuoteCreated: () => {
                    quoteDialog.close();
                }
            });
            const quoteDialog = new Dialog({
                title: '',
                cssClass: 'dialog-post-modal',
                contentComponent: quoteCreate
            });
            quoteDialog.open();
        });
    }

    handleShareClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const shareBtn = this.element.querySelector('.share');
        if (!shareBtn) return;

        const popover = new SharePopover({
            postId: this.props.id,
            anchorElement: shareBtn
        });
        popover.open();
    }

    handleBookmarkClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const saveBtn = this.element.querySelector('.save');
        if (!saveBtn) return;

        this.isBookmarked = !this.isBookmarked;
        saveBtn.classList.toggle('bookmarked', this.isBookmarked);

        const useEl = saveBtn.querySelector('use');
        if (useEl) {
            useEl.setAttribute('href', this.isBookmarked
                ? '/assets/images/header/icons/icon-bookmark-filled.svg#icon-bookmark-filled'
                : '/assets/images/main/post/save.svg#save'
            );
        }
    }

    handleCommentClick(e) {
        e.preventDefault();
        e.stopPropagation();

        Promise.all([
            import('@/components/post/DialogReplyCreate.js'),
            import('@/components/common/Dialog.js')
        ]).then(([{ DialogReplyCreate }, { Dialog }]) => {
            const replyCreate = new DialogReplyCreate({
                parentPost: this.props,
                onReplyCreated: () => {
                    replyDialog.close();
                }
            });
            const replyDialog = new Dialog({
                title: '',
                cssClass: 'dialog-post-modal',
                headerExtra: '<button class="dialog-drafts-btn">Taslaklar</button>',
                contentComponent: replyCreate
            });
            replyDialog.open();
        });
    }

    handleMoreClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const moreBtn = this.element.querySelector('.post-more-btn button:last-child');
        if (!moreBtn) return;

        const menu = new PostMoreMenu({
            postId: this.props.id,
            username: this.props.author.handle,
            anchorElement: moreBtn
        });
        menu.open();
    }

    handlePostClick(e) {
        if (e.target.closest('.interaction-btn') ||
            e.target.closest('.interaction-group') ||
            e.target.closest('.interaction-icons-right') ||
            e.target.closest('.post-more-btn') ||
            e.target.closest('.quoted-post') ||
            e.target.closest('a')) {
            return;
        }

        router.navigate(`/post/${this.props.id}`);
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

    renderQuote() {
        const { quoteOf, postsMap } = this.props;
        if (!quoteOf) return '';

        const quotedPost = postsMap.get(quoteOf);
        if (!quotedPost) return '';

        const { author, content, timestamp } = quotedPost;

        let mediaHtml = '';
        if (content.media && content.media.type === 'image') {
            mediaHtml = `
                <div class="quoted-post-media">
                    <img src="${content.media.url}" alt="${content.media.alt || ''}">
                </div>
            `;
        }

        return `
            <div class="quoted-post" data-quoted-id="${quotedPost.id}">
                <div class="quoted-post-header flex items-center">
                    <img src="${author.avatar}" alt="${author.displayName}" class="quoted-post-avatar">
                    <span class="quoted-post-name">${author.displayName}</span>
                    ${this.renderQuotedVerifiedIcon(author)}
                    <span class="quoted-post-handle">${author.handle}</span>
                    <span class="post-dot">·</span>
                    <span class="quoted-post-time">${this.formatTimestamp(timestamp)}</span>
                </div>
                <div class="quoted-post-text">${content.text}</div>
                ${mediaHtml}
            </div>
        `;
    }

    renderReplyingTo() {
        const { replyTo, postsMap } = this.props;
        if (!replyTo) return '';

        const parentPost = postsMap.get(replyTo);
        if (!parentPost) return '';

        return `
            <div class="replying-to">
                <span class="replying-to-text">${parentPost.author.handle} kullanicisina yanit olarak</span>
            </div>
        `;
    }

    onMount() {
        this.isLiked = postService.isPostLiked(this.props.id);
        this.isRetweeted = postService.isPostRetweeted(this.props.id);

        const likeButton = this.element.querySelector('.like .interaction-btn');
        if (likeButton) {
            if (this.isLiked) likeButton.classList.add('liked');
            likeButton.addEventListener('click', this.handleLikeClick);
        }

        const retweetButton = this.element.querySelector('.retweet .interaction-btn');
        if (retweetButton) {
            if (this.isRetweeted) retweetButton.classList.add('retweeted');
            retweetButton.addEventListener('click', this.handleRetweetClick);
        }

        const commentButton = this.element.querySelector('.comment .interaction-btn');
        if (commentButton) {
            commentButton.addEventListener('click', this.handleCommentClick);
        }

        const saveButton = this.element.querySelector('.save');
        if (saveButton) {
            saveButton.addEventListener('click', this.handleBookmarkClick);
        }

        const shareButton = this.element.querySelector('.share');
        if (shareButton) {
            shareButton.addEventListener('click', this.handleShareClick);
        }

        const moreButton = this.element.querySelector('.post-more-btn button:last-child');
        if (moreButton) {
            moreButton.addEventListener('click', this.handleMoreClick);
        }

        this.element.addEventListener('click', this.handlePostClick);
    }

    renderContextHeader() {
        if (!this.props.isRepost) return '';

        return `
            <div class="tweet-context-header">
                <svg viewBox="0 0 24 24">
                    <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                </svg>
                <span>Yeniden gönderi yayınladın</span>
            </div>
        `;
    }

    render() {
        const { id, author, content, stats, timestamp, isRepost, isThreadParent, isThreadReply } = this.props;

        let threadClass = '';
        if (isThreadParent) threadClass = ' post--thread-parent';
        if (isThreadReply) threadClass = ' post--thread-reply';

        const repostAttr = isRepost ? ' data-repost="true"' : '';

        return `
            <article class="post flex${threadClass}" data-post-id="${id}"${repostAttr}>
                ${this.renderContextHeader()}
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
                                <svg viewBox="0 0 24 24"><use href="/assets/images/main/post/grok.svg#grok"/></svg>
                            </button>
                            <button>
                                <svg viewBox="0 0 24 24"><use href="/assets/images/main/post/more.svg#more"/></svg>
                            </button>
                        </div>
                    </div>
                    ${this.renderReplyingTo()}
                    <div class="post-text">
                        ${content.text}
                    </div>
                    ${this.renderMedia()}
                    ${this.renderQuote()}
                    <div class="post-interactions flex items-center justify-between">
                        <div class="interaction-group comment">
                            <button class="interaction-btn">
                                <svg viewBox="0 0 24 24"><use href="/assets/images/main/post/comment.svg#comment"/></svg>
                            </button>
                            <span class="interaction-count">${this.formatNumber(stats.comments)}</span>
                        </div>
                        <div class="interaction-group retweet">
                            <button class="interaction-btn">
                                <svg viewBox="0 0 24 24"><use href="/assets/images/main/post/retweet.svg#retweet"/></svg>
                            </button>
                            <span class="interaction-count">${this.formatNumber(stats.retweets)}</span>
                        </div>
                        <div class="interaction-group like">
                            <button class="interaction-btn">
                                <svg viewBox="0 0 24 24"><use href="/assets/images/main/post/like.svg#like"/></svg>
                            </button>
                            <span class="interaction-count">${this.formatNumber(stats.likes)}</span>
                        </div>
                        <div class="interaction-group views">
                            <button class="interaction-btn">
                                <svg viewBox="0 0 24 24"><use href="/assets/images/main/post/statics.svg#statics"/></svg>
                            </button>
                            <span class="interaction-count">${this.formatNumber(stats.views)}</span>
                        </div>
                        <div class="interaction-icons-right flex items-center">
                            <button class="interaction-btn save" title="Kaydet">
                                <svg viewBox="0 0 24 24"><use href="/assets/images/main/post/save.svg#save"/></svg>
                            </button>
                            <button class="interaction-btn share" title="Paylas">
                                <svg viewBox="0 0 24 24"><use href="/assets/images/main/post/share.svg#share"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }
}
