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
            { id: 'follow', label: `@${username} adlı kişiyi takip et`, path: 'M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm13 2v-2h2v2h2v2h-2v2h-2v-2h-2V8h2zM3.651 20h12.698c-.337-1.8-1.953-3-3.849-3h-5c-1.896 0-3.512 1.2-3.849 3zM7.5 15h5c3.038 0 5.5 2.46 5.5 5.5v.5h-16v-.5C2 17.46 4.462 15 7.5 15z' },
            { id: 'add-list', label: 'Listelere ekle/Listelerden kaldır', path: 'M3 4.5C3 3.67 3.67 3 4.5 3H10v2H4.5c-.28 0-.5.22-.5.5v14.5c0 .28.22.5.5.5H10v2H4.5C3.67 22 3 21.33 3 20.5V4.5zm14.5-1.5h-5v2h5c.28 0 .5.22.5.5v14.5c0 .28-.22.5-.5.5h-5v2h5c.83 0 1.5-.67 1.5-1.5V4.5c0-.83-.67-1.5-1.5-1.5zM12 11H8v2h4v-2z' },
            { id: 'mute', label: 'Sessize al', path: 'M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-4.33v7.18l-6 5.19zM19.5 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4l-.83 1.82C17.49 6.56 19.5 9.04 19.5 12zm-4.22 5.42l1.53 1.53C15.34 20.25 13.72 21 12 21v-2c1.05 0 2.02-.36 2.78-.97l.5-.61z' },
            { id: 'block', label: `@${username} adlı kişiyi engelle`, path: 'M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.08 5.5C15.68 4.41 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.09 3.16 1.75 5.08 1.75 4.55 0 8.25-3.69 8.25-8.25 0-1.92-.66-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z' },
            { id: 'view-activity', label: 'gönderi etkinliğini görüntüle', path: 'M3 20h18v2H3v-2zM5 18h2V8H5v10zm4 0h2V4h-2v14zm4 0h2V12h-2v6zm4 0h2V6h-2v12z' },
            { id: 'embed', label: 'gönderi öğesini yerleştir', path: 'M9.64 18.36l-6-6 6-6L8.23 5.05l-6 6a1.5 1.5 0 0 0 0 2.12l6 6 1.41-1.41zM14.36 5.64l6 6-6 6 1.41 1.41 6-6a1.5 1.5 0 0 0 0-2.12l-6-6-1.41 1.41z' },
            { id: 'report', label: 'gönderi öğesini bildir', path: 'M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.39l-2.5-5 2.5-5H5v10z' },
            { id: 'community-note', label: 'Topluluk Notu iste', path: 'M14.25 2.75c-.83 0-1.5.67-1.5 1.5v1.25h-1.5V4.25c0-.83-.67-1.5-1.5-1.5H8.25c-.83 0-1.5.67-1.5 1.5v1.25H5.25V4.25c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v15.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V18h1.5v1.75c0 .83.67 1.5 1.5 1.5h1.5c.83 0 1.5-.67 1.5-1.5V18h1.5v1.75c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V4.25c0-.83-.67-1.5-1.5-1.5zm-4.5 12.5h-1.5V8.75h1.5v6.5zm-3-1.5h-1.5V10.25h1.5v3.5zm9-1.5h-1.5V8.75h1.5v5zM21.81 9.32c.23-.5.03-1.08-.44-1.33l-2.3-1.2c-.49-.26-1.08-.05-1.33.44-.26.49-.05 1.08.44 1.33l2.3 1.2c.49.25 1.08.05 1.33-.44zM2.19 9.32c-.23-.5-.03-1.08.44-1.33l2.3-1.2c.49-.26 1.08-.05 1.33.44.26.49.05 1.08-.44 1.33l-2.3 1.2c-.49.25-1.08.05-1.33-.44z' }
        ];
    }

    render() {
        const items = this.getMenuItems();
        return `
            <div class="post-more-menu">
                ${items.map(item => `
                    <button type="button" class="post-more-menu-item" data-more-action="${item.id}">
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
