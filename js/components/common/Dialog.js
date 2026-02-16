import {Component} from '@/core';

export class Dialog extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: '',
            contentComponent: null,
            cssClass: '',
            headerExtra: '',
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

        closeButton?.addEventListener('click', this.close);

        this.dialogElement.addEventListener('click', (e) => {
            if (e.target === this.dialogElement) {
                this.clearTextareaContent();
                this.close();
            }
        });
    }

    clearTextareaContent() {
        if (!this.dialogElement) return;

        const textarea = this.dialogElement.querySelector('textarea');
        if (textarea) {
            textarea.value = '';
            textarea.style.height = 'auto';
        }
    }

    render() {
        const { title, cssClass, headerExtra } = this.props;
        const containerClass = `dialog-container${cssClass ? ` ${cssClass}` : ''}`;

        return `
            <div class="dialog-overlay">
                <div class="${containerClass}" role="dialog" aria-labelledby="dialog-title" aria-modal="true">
                    <div class="dialog-header">
                        <button class="dialog-close" aria-label="Kapat">
                            <svg viewBox="0 0 24 24"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg>
                        </button>
                        <h2 id="dialog-title" class="dialog-title">${title}</h2>
                        ${headerExtra}
                    </div>
                    <div class="dialog-body">
                    </div>
                </div>
            </div>
        `;
    }
}
