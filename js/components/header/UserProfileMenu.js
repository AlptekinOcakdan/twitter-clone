import { safeCreateFragment } from '@/core';

export class UserProfileMenu {
    constructor(props = {}) {
        this.props = {
            handle: '',
            anchorElement: null,
            ...props
        };
        this.popoverElement = null;
        this.boundClose = this.handleOutsideClick.bind(this);
    }

    render() {
        const { handle } = this.props;

        return `
            <div class="user-profile-menu">
                <button type="button" class="user-profile-menu-item" data-action="add-account">
                    <span>Var olan bir hesap ekle</span>
                </button>
                <button type="button" class="user-profile-menu-item" data-action="logout">
                    <span>${handle} hesabından çıkış yap</span>
                </button>
            </div>
        `;
    }

    open() {
        const fragment = safeCreateFragment(this.render());
        this.popoverElement = fragment.firstElementChild;

        document.body.appendChild(this.popoverElement);
        this.position();
        this.attachEvents();

        setTimeout(() => {
            document.addEventListener('click', this.boundClose);
        }, 0);
    }

    position() {
        const anchor = this.props.anchorElement;
        if (!anchor || !this.popoverElement) return;

        const anchorRect = anchor.getBoundingClientRect();
        const popoverWidth = this.popoverElement.offsetWidth;

        this.popoverElement.style.left = `${anchorRect.left}px`;
        this.popoverElement.style.bottom = `${window.innerHeight - anchorRect.top + 10}px`;
        this.popoverElement.style.minWidth = `${Math.max(anchorRect.width, 300)}px`;
    }

    close() {
        document.removeEventListener('click', this.boundClose);
        if (this.popoverElement) {
            this.popoverElement.remove();
            this.popoverElement = null;
        }
    }

    handleOutsideClick(e) {
        const anchor = this.props.anchorElement;
        if (this.popoverElement && !this.popoverElement.contains(e.target)) {
            if (!anchor || !anchor.contains(e.target)) {
                this.close();
            }
        }
    }

    attachEvents() {
        if (!this.popoverElement) return;
        this.popoverElement.querySelectorAll('.user-profile-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
        });
    }
}
