import { safeCreateFragment } from '@/core';

export class SharePopover {
    constructor(props = {}) {
        this.props = {
            postId: '',
            anchorElement: null,
            ...props
        };
        this.popoverElement = null;
        this.boundClose = this.handleOutsideClick.bind(this);
        this.boundScroll = this.close.bind(this);
    }

    getItems() {
        return [
            { id: 'copy-link', label: 'Bağlantıyı kopyala', path: 'M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02 .71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z' },
            { id: 'share-via', label: 'Gönderiyi şununla paylaş ...', path: 'M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z' },
            { id: 'send-dm', label: 'Sohbet ile gönder', path: 'M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z' }
        ];
    }

    render() {
        const items = this.getItems();
        return `
            <div class="share-popover">
                ${items.map(item => `
                    <button type="button" class="share-popover-item" data-share-action="${item.id}">
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
            this.popoverElement.style.left = `${Math.max(10, rect.right - popoverWidth)}px`;
        }

        this.attachEvents();
        setTimeout(() => {
            document.addEventListener('click', this.boundClose);
            window.addEventListener('scroll', this.boundScroll, true);
        }, 0);
    }

    close() {
        document.removeEventListener('click', this.boundClose);
        window.removeEventListener('scroll', this.boundScroll, true);
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
        this.popoverElement.querySelectorAll('.share-popover-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.currentTarget.dataset.shareAction;
                this.handleAction(action);
                this.close();
            });
        });
    }

    async handleAction(action) {
        if (action === 'copy-link') {
            const url = `${window.location.origin}/post/${this.props.postId}`;
            try {
                await navigator.clipboard.writeText(url);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        }
    }
}
