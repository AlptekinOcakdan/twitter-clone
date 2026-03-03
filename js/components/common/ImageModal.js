import { Component, safeCreateFragment } from '@/core';

export class ImageModal extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            src: '',
            alt: '',
            ...props
        };
        this.overlayElement = null;
        this.close = this.close.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    open() {
        const fragment = safeCreateFragment(this.render());
        this.overlayElement = fragment.firstElementChild;
        document.body.appendChild(this.overlayElement);
        document.body.style.overflow = 'hidden';
        this.attachEventListeners();
    }

    close() {
        if (this.overlayElement) {
            this.overlayElement.remove();
            this.overlayElement = null;
        }
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') this.close();
    }

    attachEventListeners() {
        const closeBtn = this.overlayElement.querySelector('.image-modal-close');
        closeBtn?.addEventListener('click', this.close);

        this.overlayElement.addEventListener('click', (e) => {
            if (e.target === this.overlayElement) this.close();
        });

        document.addEventListener('keydown', this.handleKeyDown);
    }

    render() {
        const { src, alt } = this.props;
        return `
            <div class="image-modal-overlay">
                <button class="image-modal-close" aria-label="Kapat">
                    <svg viewBox="0 0 24 24"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg>
                </button>
                <img src="${src}" alt="${alt}" class="image-modal-img">
            </div>
        `;
    }
}
