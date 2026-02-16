import { Component } from '@/core';

export class Dialog extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: '',
            contentComponent: null,
            ...props
        };
        this.isOpen = false;
        this.dialogElement = null;

        this.close = this.close.bind(this);
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;

        const dialogHtml = this.render();
        const fragment = document.createRange().createContextualFragment(dialogHtml);
        this.dialogElement = fragment.firstElementChild;

        const { contentComponent } = this.props;
        if (contentComponent) {
            const contentHtml = contentComponent.render();
            const contentFragment = document.createRange().createContextualFragment(contentHtml);
            const contentElement = contentFragment.firstElementChild;

            const dialogBody = this.dialogElement.querySelector('.dialog-body');
            if (dialogBody) {
                dialogBody.appendChild(contentElement);
                contentComponent.element = contentElement;
                contentComponent.onMount();
            }
        }

        document.body.appendChild(this.dialogElement);
        document.body.style.overflow = 'hidden';
        this.attachEventListeners();
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        if (this.dialogElement) {
            this.dialogElement.remove();
            this.dialogElement = null;
        }
        document.body.style.overflow = '';
    }

    attachEventListeners() {
        if (!this.dialogElement) return;

        const closeButton = this.dialogElement.querySelector('.dialog-close');
        const overlay = this.dialogElement.querySelector('.dialog-overlay');

        closeButton?.addEventListener('click', this.close);
        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
            }
        });
    }

    render() {
        const { title } = this.props;

        const dialogHtml = `
            <div class="dialog-overlay">
                <div class="dialog-container" role="dialog" aria-labelledby="dialog-title" aria-modal="true">
                    <div class="dialog-header">
                        <button class="dialog-close" aria-label="Kapat">
                            <svg viewBox="0 0 24 24"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg>
                        </button>
                        <h2 id="dialog-title" class="dialog-title">${title}</h2>
                    </div>
                    <div class="dialog-body">
                    </div>
                </div>
            </div>
        `;

        return dialogHtml;
    }
}
