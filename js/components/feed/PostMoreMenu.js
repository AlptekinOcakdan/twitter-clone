import { safeCreateFragment } from '@/core';

export class PostMoreMenu {
    constructor(props = {}) {
        this.props = {
            postId: '',
            username: '',
            anchorElement: null,
            ...props
        };
        this.popoverElement = null;
        this.boundClose = this.handleOutsideClick.bind(this);
    }

    getMenuItems() {
        const { username } = this.props;
        return [
            { id: 'follow',     label: `${username} adlı kişiyi takip et` },
            { id: 'add-list',   label: 'Listelere ekle/Listelerden kaldır' },
            { id: 'mute',       label: 'Sessize al' },
            { id: 'block',      label: `${username} adlı kişiyi engelle` },
            { id: 'statics',    label: 'gönderi etkinliğini görüntüle' },
            { id: 'embed',      label: 'gönderi öğesini yerleştir' },
            { id: 'edit-image', label: 'Resmi düzenle' },
            { id: 'report',     label: 'gönderi öğesini bildir' },
            { id: 'announce',   label: 'Topluluk Notu iste' },
        ];
    }

    render() {
        const items = this.getMenuItems();
        return `
            <div class="post-more-menu">
                ${items.map(item => `
                    <button type="button" class="post-more-menu-item" data-more-action="${item.id}">
                        <svg viewBox="0 0 24 24"><use href="/assets/images/main/post/more-menu/icon-${item.id}.svg#icon-${item.id}"></use></svg>
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

            // Hide the popover to measure it without causing a flicker
            this.popoverElement.style.visibility = 'hidden';

            const popoverWidth = this.popoverElement.offsetWidth;
            const popoverHeight = this.popoverElement.offsetHeight;

            let top = rect.bottom + 4;
            const left = Math.max(10, rect.right - popoverWidth);

            // Adjust vertical position if it overflows the bottom of the viewport
            if (top + popoverHeight > window.innerHeight) {
                top = rect.top - popoverHeight - 4;
            }

            this.popoverElement.style.top = `${top}px`;
            this.popoverElement.style.left = `${left}px`;

            // Make the popover visible now that it's positioned
            this.popoverElement.style.visibility = 'visible';
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
        this.popoverElement.querySelectorAll('.post-more-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
        });
    }
}
