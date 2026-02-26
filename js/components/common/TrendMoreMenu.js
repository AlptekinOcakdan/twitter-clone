import { safeCreateFragment } from '@/core';

export class TrendMoreMenu {
    static activeInstance = null;
    static activeAnchor = null;

    static ICON_HREF = '/assets/images/explore/unhappy-face.svg#icon-unhappy-face';

    constructor(props = {}) {
        this.props = {
            trendId: '',
            trendName: '',
            promoted: false,
            onAction: null,
            ...props
        };
        this.menuElement = null;
        this.scrollParent = null;
        this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
        this.boundHandleScroll = this.handleScroll.bind(this);
    }

    static closeActive() {
        if (TrendMoreMenu.activeInstance) {
            TrendMoreMenu.activeInstance.close();
        }
    }

    getMenuItems() {
        const items = [
            { id: 'not-relevant', label: 'İlişkili içerik alakalı değil' },
            { id: 'spam', label: 'Bu gündem spam' },
            { id: 'harmful', label: 'Bu gündem taciz içeriyor veya zararlı' },
            { id: 'not-interested', label: 'İlgimi çekmiyor' },
            { id: 'duplicate', label: 'Bu gündem yineleniyor' },
            { id: 'title-harmful', label: 'Bu gündem başlığı zararlı veya spam içeriyor' }
        ];

        if (this.props.promoted) {
            items.push({ id: 'no-ad', label: "Don't want to see this ad" });
        }

        return items;
    }

    render() {
        const items = this.getMenuItems();
        const iconHref = TrendMoreMenu.ICON_HREF;
        return `
            <div class="trend-more-menu" data-trend-id="${this.props.trendId}">
                ${items.map(item => `
                    <button type="button" class="trend-more-menu__item" data-action="${item.id}">
                        <svg viewBox="0 0 24 24"><use href="${iconHref}"></use></svg>
                        <span>${item.label}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    open(anchorElement) {
        if (TrendMoreMenu.activeAnchor === anchorElement) {
            TrendMoreMenu.closeActive();
            return;
        }

        TrendMoreMenu.closeActive();

        const fragment = safeCreateFragment(this.render());
        this.menuElement = fragment.firstElementChild;
        document.body.appendChild(this.menuElement);

        const rect = anchorElement.getBoundingClientRect();
        const menuWidth = this.menuElement.offsetWidth || 300;
        const menuHeight = this.menuElement.offsetHeight || 100;

        let top = rect.bottom + 4;
        let left = rect.right - menuWidth;

        if (left < 10) left = 10;
        if (top + menuHeight > window.innerHeight) {
            top = rect.top - menuHeight - 4;
        }

        this.menuElement.style.top = `${top}px`;
        this.menuElement.style.left = `${left}px`;

        this.attachItemEvents();
        TrendMoreMenu.activeInstance = this;
        TrendMoreMenu.activeAnchor = anchorElement;

        this.scrollParent = anchorElement.closest('#sidebar') || anchorElement.closest('#explore');
        if (this.scrollParent) {
            this.scrollParent.addEventListener('scroll', this.boundHandleScroll);
        }

        setTimeout(() => {
            document.addEventListener('click', this.boundHandleOutsideClick);
        }, 0);
    }

    close() {
        document.removeEventListener('click', this.boundHandleOutsideClick);
        if (this.scrollParent) {
            this.scrollParent.removeEventListener('scroll', this.boundHandleScroll);
            this.scrollParent = null;
        }
        if (this.menuElement) {
            this.menuElement.remove();
            this.menuElement = null;
        }
        if (TrendMoreMenu.activeInstance === this) {
            TrendMoreMenu.activeInstance = null;
            TrendMoreMenu.activeAnchor = null;
        }
    }

    handleOutsideClick(e) {
        if (this.menuElement && !this.menuElement.contains(e.target)) {
            this.close();
        }
    }

    handleScroll() {
        this.close();
    }

    attachItemEvents() {
        if (!this.menuElement) return;
        this.menuElement.querySelectorAll('.trend-more-menu__item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const actionId = e.currentTarget.dataset.action;
                if (this.props.onAction) {
                    this.props.onAction(actionId, this.props.trendId);
                }
                this.close();
            });
        });
    }
}
