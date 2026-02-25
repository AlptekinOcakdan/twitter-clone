import { safeCreateFragment } from '@/core';

export class RetweetPopover {
    constructor(props = {}) {
        this.props = {
            postId: '',
            anchorElement: null,
            onRepost: null,
            onQuote: null,
            ...props
        };
        this.popoverElement = null;
        this.boundClose = this.handleOutsideClick.bind(this);
    }

    getItems() {
        return [
            {
                id: 'repost',
                label: 'Yeniden gönder',
                path: 'M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z'
            },
            {
                id: 'quote',
                label: 'Alıntıla',
                path: 'M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'
            }
        ];
    }

    render() {
        const items = this.getItems();
        return `
            <div class="retweet-popover">
                ${items.map(item => `
                    <button type="button" class="retweet-popover-item" data-retweet-action="${item.id}">
                        <svg viewBox="0 0 24 24"><path d="${item.path}"></path></svg>
                        <span>${item.label}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    open() {
        const fragment = safeCreateFragment(this.render());
        this.popoverElement = fragment.firstElementChild;

        const anchor = this.props.anchorElement;
        if (anchor) {
            const rect = anchor.getBoundingClientRect();
            document.body.appendChild(this.popoverElement);
            const popoverWidth = 260;
            this.popoverElement.style.top = `${rect.bottom + 4}px`;
            this.popoverElement.style.left = `${Math.max(10, rect.left + rect.width / 2 - popoverWidth / 2)}px`;
        }

        this.attachEvents();
        setTimeout(() => {
            document.addEventListener('click', this.boundClose);
        }, 0);
    }

    close() {
        document.removeEventListener('click', this.boundClose);
        if (this.popoverElement) {
            this.popoverElement.remove();
            this.popoverElement = null;
        }
    }

    handleOutsideClick(e) {
        if (this.popoverElement && !this.popoverElement.contains(e.target)) {
            this.close();
        }
    }

    attachEvents() {
        if (!this.popoverElement) return;
        this.popoverElement.querySelectorAll('.retweet-popover-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.currentTarget.dataset.retweetAction;
                this.handleAction(action);
                this.close();
            });
        });
    }

    handleAction(action) {
        if (action === 'repost') {
            if (this.props.onRepost) {
                this.props.onRepost();
            }
        } else if (action === 'quote') {
            if (this.props.onQuote) {
                this.props.onQuote();
            }
        }
    }
}
