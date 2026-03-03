import { Component } from '@/core';

const SORT_OPTIONS = [
    { id: 'relevant', label: 'Alakalı' },
    { id: 'newest', label: 'En yeni' },
    { id: 'likes', label: 'Beğeni' }
];

export class ReplySortBar extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            currentSort: 'relevant',
            onChange: null,
            ...props
        };

        this.currentSort = this.props.currentSort;
        this.isOpen = false;

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    get currentLabel() {
        return SORT_OPTIONS.find(o => o.id === this.currentSort)?.label || 'Alakalı';
    }

    openPopover() {
        this.isOpen = true;
        this.element?.querySelector('.sort-popover')?.classList.add('open');
        setTimeout(() => document.addEventListener('click', this.handleOutsideClick), 0);
    }

    closePopover() {
        this.isOpen = false;
        this.element?.querySelector('.sort-popover')?.classList.remove('open');
        document.removeEventListener('click', this.handleOutsideClick);
    }

    toggle() {
        this.isOpen ? this.closePopover() : this.openPopover();
    }

    handleOutsideClick(e) {
        if (this.element && !this.element.contains(e.target)) {
            this.closePopover();
        }
    }

    selectSort(sortId) {
        this.currentSort = sortId;

        const label = this.element?.querySelector('.sort-trigger-label');
        if (label) label.textContent = this.currentLabel;

        this.element?.querySelectorAll('.sort-option').forEach(opt => {
            const check = opt.querySelector('.sort-check');
            if (check) check.classList.toggle('visible', opt.dataset.sortId === sortId);
        });

        this.closePopover();
        this.props.onChange?.(sortId);
    }

    render() {
        return `
            <div class="reply-sort-bar">
                <div class="sort-trigger-wrapper">
                    <button class="sort-trigger-btn">
                        <span class="sort-trigger-label">${this.currentLabel}</span>
                        <svg class="sort-chevron" viewBox="0 0 24 24">
                            <path d="M3.543 8.96l1.414-1.42L12 14.59l6.543-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                        </svg>
                    </button>
                    <div class="sort-popover">
                        <div class="sort-popover-title">Yanıtları sırala</div>
                        ${SORT_OPTIONS.map(opt => `
                            <button class="sort-option" data-sort-id="${opt.id}">
                                <span>${opt.label}</span>
                                <svg class="sort-check ${opt.id === this.currentSort ? 'visible' : ''}" viewBox="0 0 24 24">
                                    <path d="M9 20c-.264 0-.52-.104-.707-.293l-4.785-4.785c-.39-.39-.39-1.023 0-1.414s1.023-.39 1.414 0l3.946 3.945L18.075 4.41c.32-.45.94-.558 1.395-.24.45.318.56.942.24 1.394L9.817 19.577c-.17.24-.438.395-.728.42C9.057 20 9.028 20 9 20z"></path>
                                </svg>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    onMount() {
        const triggerBtn = this.element?.querySelector('.sort-trigger-btn');
        triggerBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        this.element?.querySelectorAll('.sort-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectSort(opt.dataset.sortId);
            });
        });
    }

    destroy() {
        document.removeEventListener('click', this.handleOutsideClick);
        super.destroy();
    }
}
