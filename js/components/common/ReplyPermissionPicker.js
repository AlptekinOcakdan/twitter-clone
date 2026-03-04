export class ReplyPermissionPicker {
    static OPTIONS = [
        {
            id: 'everyone',
            label: 'Herkes',
            iconPath: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>`
        },
        {
            id: 'following',
            label: 'Takip ettiğin hesaplar',
            iconPath: `<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>`
        },
        {
            id: 'verified',
            label: 'Onaylanmış hesaplar',
            iconPath: `<path d="M22.25 12c0-1.43-.56-2.729-1.47-3.69.21-.699.332-1.43.332-2.31 0-3.453-2.31-4.858-4.2-5.046C15.37.36 13.93 0 12 0c-1.93 0-3.37.36-4.916.954-1.89.188-4.2 1.593-4.2 5.046 0 .88.123 1.612.335 2.31C2.31 9.27 1.75 10.57 1.75 12c0 1.43.56 2.73 1.47 3.69-.21.7-.333 1.43-.333 2.31 0 3.453 2.31 4.858 4.2 5.046 1.547.594 2.987.954 4.916.954 1.93 0 3.37-.36 4.916-.954 1.89-.188 4.2-1.593 4.2-5.046 0-.88-.122-1.61-.333-2.31.91-.96 1.47-2.26 1.47-3.69zm-6.47 3.47L12 13.06l-3.78 2.41 1-4.28-3.32-2.88 4.38-.38L12 4.19l1.72 3.74 4.38.38-3.32 2.88 1 4.28z"/>`
        },
        {
            id: 'mentioned',
            label: 'Yalnızca bahsettiğin hesaplar',
            iconPath: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>`
        }
    ];

    static getLabelById(id) {
        const opt = ReplyPermissionPicker.OPTIONS.find(o => o.id === id);
        return opt ? opt.label : 'Herkes';
    }

    static getButtonLabelById(id) {
        return `${ReplyPermissionPicker.getLabelById(id)} yanıtlayabilir`;
    }

    static getIconPathById(id) {
        const opt = ReplyPermissionPicker.OPTIONS.find(o => o.id === id);
        return opt ? opt.iconPath : ReplyPermissionPicker.OPTIONS[0].iconPath;
    }

    constructor(props = {}) {
        this.props = {
            selected: 'everyone',
            onSelect: null,
            ...props
        };
        this.element = null;
        this.isOpen = false;
        this.anchor = null;
        this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
        this.boundPosition = this.position.bind(this);
    }

    render() {
        const selected = this.props.selected;
        const optionsHtml = ReplyPermissionPicker.OPTIONS.map(opt => `
            <button type="button" class="reply-permission-option" data-permission="${opt.id}">
                <div class="reply-permission-option-icon">
                    <svg viewBox="0 0 24 24">${opt.iconPath}</svg>
                </div>
                <span class="reply-permission-option-label">${opt.label}</span>
                ${opt.id === selected ? `<svg class="reply-permission-check" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>` : ''}
            </button>
        `).join('');

        return `
            <div class="reply-permission-picker">
                <div class="reply-permission-picker-header">
                    <p class="reply-permission-picker-title">Kimler yanıtlayabilir?</p>
                    <p class="reply-permission-picker-desc">Bu gönderiyi kimlerin yanıtlayabileceğini seç. Bahsedilen herkes yanıt verebilir.</p>
                </div>
                <div class="reply-permission-picker-options">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }

    open(anchor) {
        if (this.isOpen) {
            this.close();
            return;
        }

        this.anchor = anchor;

        const div = document.createElement('div');
        div.innerHTML = this.render();
        this.element = div.firstElementChild;
        document.body.appendChild(this.element);

        this.position();
        this.isOpen = true;

        this.element.querySelectorAll('.reply-permission-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.permission;
                this.props.selected = id;
                if (this.props.onSelect) {
                    this.props.onSelect(id);
                }
                this.close();
            });
        });

        setTimeout(() => {
            document.addEventListener('click', this.boundHandleOutsideClick);
            window.addEventListener('resize', this.boundPosition);
            window.addEventListener('scroll', this.boundPosition, true);
        }, 0);
    }

    close() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        this.isOpen = false;
        document.removeEventListener('click', this.boundHandleOutsideClick);
        window.removeEventListener('resize', this.boundPosition);
        window.removeEventListener('scroll', this.boundPosition, true);
    }

    position() {
        if (!this.element || !this.anchor) return;

        const rect = this.anchor.getBoundingClientRect();
        const popoverHeight = this.element.offsetHeight;
        const popoverWidth = this.element.offsetWidth || 320;

        let top, left;

        if (rect.top > popoverHeight + 8) {
            top = rect.top - popoverHeight - 8;
        } else {
            top = rect.bottom + 8;
        }

        left = rect.left;

        if (left + popoverWidth > window.innerWidth - 10) {
            left = window.innerWidth - popoverWidth - 10;
        }
        if (left < 10) left = 10;

        this.element.style.top = `${top}px`;
        this.element.style.left = `${left}px`;
    }

    handleOutsideClick(e) {
        if (this.element && !this.element.contains(e.target)) {
            if (!this.anchor || !this.anchor.contains(e.target)) {
                this.close();
            }
        }
    }
}
