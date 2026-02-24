import { safeCreateFragment } from '@/core';

export class PostMoreMenu {
    constructor(props = {}) {
        this.props = {
            postId: '',
            authorHandle: '',
            anchorElement: null,
            ...props
        };
        this.popoverElement = null;
        this.boundClose = this.handleOutsideClick.bind(this);
    }

    getMenuItems() {
        const handle = this.props.authorHandle;
        return [
            { id: 'not-interested', label: 'Bu Gonderiyle Ilgilenmiyorum', path: 'M9.5 7c.828 0 1.5 1.119 1.5 2.5S10.328 12 9.5 12 8 10.881 8 9.5 8.672 7 9.5 7zm5 0c.828 0 1.5 1.119 1.5 2.5s-.672 2.5-1.5 2.5S13 10.881 13 9.5 13.672 7 14.5 7zM12 22.25C6.348 22.25 1.75 17.652 1.75 12S6.348 1.75 12 1.75 22.25 6.348 22.25 12 17.652 22.25 12 22.25zm0-18.5c-4.549 0-8.25 3.701-8.25 8.25s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25S16.549 3.75 12 3.75zM8.5 17.25l1.5-2h4l1.5 2h-7z' },
            { id: 'follow', label: `${handle} kullanicisini takip et`, path: 'M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm13 2v-2h2v2h2v2h-2v2h-2v-2h-2V8h2zM3.651 20h12.698c-.337-1.8-1.953-3-3.849-3h-5c-1.896 0-3.512 1.2-3.849 3zM7.5 15h5c3.038 0 5.5 2.46 5.5 5.5v.5h-16v-.5C2 17.46 4.462 15 7.5 15z' },
            { id: 'add-list', label: 'Listeye ekle/kaldir', path: 'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z' },
            { id: 'mute', label: `${handle} kullanicisini sustur`, path: 'M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-4.33v7.18l-6 5.19zM19.5 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4l-.83 1.82C17.49 6.56 19.5 9.04 19.5 12zm-4.22 5.42l1.53 1.53C15.34 20.25 13.72 21 12 21v-2c1.05 0 2.02-.36 2.78-.97l.5-.61z' },
            { id: 'block', label: `${handle} kullanicisini engelle`, path: 'M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.08 5.5C15.68 4.41 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.09 3.16 1.75 5.08 1.75 4.55 0 8.25-3.69 8.25-8.25 0-1.92-.66-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z' },
            { id: 'report', label: 'Gonderiyi bildir', path: 'M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.39l-2.5-5 2.5-5H5v10z' }
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
            const popoverWidth = 300;
            this.popoverElement.style.top = `${rect.bottom + 4}px`;
            this.popoverElement.style.left = `${Math.max(10, rect.right - popoverWidth)}px`;
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
