import {Component, postService, safeSetInnerHTML} from '@/core';
import {GifPicker} from '@/components/common/GifPicker.js';
import {EmojiPicker} from '@/components/common/EmojiPicker.js';
import {ScheduleModal} from '@/components/common/ScheduleModal.js';
import {ReplyPermissionPicker} from '@/components/common/ReplyPermissionPicker.js';

export class DialogPostCreate extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            userAvatar: '/assets/images/header/users/user-avatar.jpg',
            placeholder: 'Neler oluyor?',
            replyPermission: 'Herkes yanıtlayabilir',
            submitButtonText: 'Gönderi yayınla',
            onPostCreated: null,
            maxChars: 150,
            actions: [
                { id: 'media', title: 'Medya', iconPath: '/assets/images/main/feed/upload-image.svg#upload-image' },
                { id: 'gif', title: 'GIF', iconPath: '/assets/images/main/feed/upload-gif.svg#upload-gif' },
                { id: 'poll', title: 'Anket', iconPath: '/assets/images/main/feed/create-poll.svg#create-poll', disabled: true },
                { id: 'emoji', title: 'İfade', iconPath: '/assets/images/main/feed/emoji.svg#emoji' },
                { id: 'schedule', title: 'Zamanla', iconPath: '/assets/images/main/feed/calendar-plan.svg#calendar-plan' },
                { id: 'location', title: 'Konum', iconPath: '/assets/images/main/feed/location.svg#location', disabled: true }
            ],
            ...props
        };

        this.mediaFile = null;
        this.mediaPreviewUrl = null;
        this.selectedGif = null;
        this.scheduledDate = null;
        this.selectedPermission = 'everyone';
        this.permissionPicker = null;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    renderActions() {
        return this.props.actions.map(action => {
            const disabledClass = action.disabled ? ' disabled' : '';
            return `
                <button class="action-btn${disabledClass}" title="${action.title}" data-action="${action.id}">
                    <svg viewBox="0 0 24 24"><use href="${action.iconPath}"/></svg>
                </button>
            `;
        }).join('');
    }

    renderCharCounter() {
        return `<div class="char-counter-wrapper hidden">
            <span class="char-counter-text hidden"></span>
            <svg class="char-counter-svg" viewBox="0 0 36 36" width="30" height="30">
                <circle class="char-counter-bg" cx="18" cy="18" r="15.5" fill="none" stroke-width="2"></circle>
                <circle class="char-counter-fill" cx="18" cy="18" r="15.5" fill="none" stroke-width="2"
                    stroke-dasharray="97.39" stroke-dashoffset="97.39"></circle>
            </svg>
            <div class="char-counter-divider hidden"></div>
        </div>`;
    }

    render() {
        const { userAvatar, placeholder, replyPermission, submitButtonText } = this.props;

        return `
            <div class="dialog-post-create">
                <div class="dialog-post-input-row flex">
                    <div class="post-avatar-container">
                        <img src="${userAvatar}" alt="User Avatar" class="user-avatar">
                    </div>
                    <div class="dialog-post-textarea-container grow">
                        <label for="dialog-post-input" hidden></label>
                        <textarea id="dialog-post-input" placeholder="${placeholder}"></textarea>
                        <div class="char-limit-warning hidden">
                            <span class="char-limit-warning-text"></span>
                            <a href="#" class="char-limit-premium-link">Twitter Premium'a abone ol</a>
                        </div>
                        <div class="media-preview hidden">
                            <button class="media-preview-remove" type="button">&times;</button>
                            <img class="media-preview-img" src="" alt="">
                        </div>
                    </div>
                </div>

                <button type="button" class="dialog-reply-permission flex items-center">
                    <svg viewBox="0 0 24 24">
                        ${ReplyPermissionPicker.getIconPathById(this.selectedPermission)}
                    </svg>
                    <span>${ReplyPermissionPicker.getButtonLabelById(this.selectedPermission)}</span>
                </button>

                <div class="dialog-post-actions flex items-center justify-between">
                    <div class="action-icons flex items-center">
                        ${this.renderActions()}
                    </div>
                    <div class="submit-area flex items-center">
                        ${this.renderCharCounter()}
                        <div class="submit-post">
                            <button id="btn-submit-dialog-post" class="btn-disabled-opacity" disabled>${submitButtonText}</button>
                        </div>
                    </div>
                </div>
                <input type="file" class="media-file-input hidden" accept="image/*">
            </div>
        `;
    }

    updateCharCounter() {
        const textarea = this.element.querySelector('#dialog-post-input');
        const counterFill = this.element.querySelector('.char-counter-fill');
        const counterText = this.element.querySelector('.char-counter-text');
        const counterSvg = this.element.querySelector('.char-counter-svg');
        const counterWrapper = this.element.querySelector('.char-counter-wrapper');
        const counterDivider = this.element.querySelector('.char-counter-divider');
        const warningEl = this.element.querySelector('.char-limit-warning');
        const warningText = this.element.querySelector('.char-limit-warning-text');
        const submitButton = this.element.querySelector('#btn-submit-dialog-post');

        if (!textarea || !counterFill || !counterText) return;

        const len = textarea.value.length;
        const max = this.props.maxChars;
        const circumference = 97.39;
        const ratio = Math.min(len / max, 1);
        counterFill.style.strokeDashoffset = circumference - (ratio * circumference);

        if (len === 0) {
            counterWrapper.classList.add('hidden');
        } else {
            counterWrapper.classList.remove('hidden');
        }

        if (len > max) {
            const over = len - max;
            counterText.textContent = `-${over}`;
            counterText.classList.remove('hidden');
            counterText.classList.add('over');
            counterSvg.classList.add('over-limit');
            counterFill.style.stroke = '#F4212E';
            counterDivider?.classList.remove('hidden');
            warningEl.classList.remove('hidden');

            const overStart = max;
            const text = textarea.value;
            const beforeOver = text.substring(0, overStart);
            const overText = text.substring(overStart);
            safeSetInnerHTML(warningText, `${this.escapeHtml(beforeOver)}<span class="char-over-highlight">${this.escapeHtml(overText)}</span>`);

            submitButton.disabled = true;
            submitButton.classList.add('btn-disabled-opacity');
        } else {
            counterText.classList.add('hidden');
            counterText.classList.remove('over');
            counterSvg.classList.remove('over-limit');
            counterDivider?.classList.add('hidden');
            warningEl.classList.add('hidden');

            if (len > max - 20) {
                counterFill.style.stroke = '#FFD400';
                counterText.textContent = `${max - len}`;
                counterText.classList.remove('hidden');
                counterText.style.color = '#536471';
            } else {
                counterFill.style.stroke = '#1D9BF0';
            }

            const hasContent = textarea.value.trim().length > 0 || this.mediaPreviewUrl || this.selectedGif;
            submitButton.disabled = !hasContent;
            if (hasContent) {
                submitButton.classList.remove('btn-disabled-opacity');
            } else {
                submitButton.classList.add('btn-disabled-opacity');
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async handleSubmit() {
        const textarea = this.element.querySelector('#dialog-post-input');
        const submitButton = this.element.querySelector('#btn-submit-dialog-post');

        if (!textarea || !submitButton) return;

        const text = textarea.value.trim();
        if (!text && !this.mediaPreviewUrl && !this.selectedGif) return;
        if (textarea.value.length > this.props.maxChars) return;

        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Gönderiliyor...';

        try {
            const postData = { text };

            if (this.mediaPreviewUrl) {
                postData.media = { type: 'image', url: this.mediaPreviewUrl, alt: '' };
            } else if (this.selectedGif) {
                postData.media = { type: 'image', url: this.selectedGif, alt: 'GIF' };
            }

            if (this.scheduledDate) {
                postData.scheduledDate = this.scheduledDate;
            }

            await postService.createPost(postData);

            textarea.value = '';
            textarea.style.height = 'auto';
            this.clearMedia();
            this.scheduledDate = null;

            if (this.props.onPostCreated) {
                this.props.onPostCreated();
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Gönderi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    clearMedia() {
        this.mediaFile = null;
        this.mediaPreviewUrl = null;
        this.selectedGif = null;
        const preview = this.element.querySelector('.media-preview');
        if (preview) {
            preview.classList.add('hidden');
            preview.querySelector('.media-preview-img').src = '';
        }
        this.updateCharCounter();
    }

    showMediaPreview(url) {
        const preview = this.element.querySelector('.media-preview');
        const img = this.element.querySelector('.media-preview-img');
        if (preview && img) {
            img.src = url;
            preview.classList.remove('hidden');
        }
        this.updateCharCounter();
    }

    handleActionClick(action) {
        if (action === 'media') {
            const fileInput = this.element.querySelector('.media-file-input');
            if (fileInput) fileInput.click();
        } else if (action === 'gif') {
            this.openGifPicker();
        } else if (action === 'emoji') {
            this.openEmojiPicker();
        } else if (action === 'schedule') {
            this.openScheduleModal();
        }
    }

    openGifPicker() {
        const gifPicker = new GifPicker({
            onSelect: (gifUrl) => {
                this.selectedGif = gifUrl;
                this.mediaFile = null;
                this.mediaPreviewUrl = null;
                this.showMediaPreview(gifUrl);
            }
        });
        gifPicker.open();
    }

    openEmojiPicker() {
        const emojiBtn = this.element.querySelector('[data-action="emoji"]');
        if (!emojiBtn) return;

        const existing = this.element.querySelector('.emoji-picker-popover');
        if (existing) {
            existing.remove();
            return;
        }

        const picker = new EmojiPicker({
            onSelect: (emoji) => {
                const textarea = this.element.querySelector('#dialog-post-input');
                if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    textarea.value = text.substring(0, start) + emoji + text.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
                    textarea.focus();
                    textarea.dispatchEvent(new Event('input'));
                }
            },
            anchor: emojiBtn
        });
        picker.mount(this.element);
    }

    openScheduleModal() {
        const modal = new ScheduleModal({
            onSchedule: (date) => {
                this.scheduledDate = date;
            }
        });
        modal.open();
    }

    openPermissionPicker() {
        const btn = this.element.querySelector('.dialog-reply-permission');
        if (!btn) return;

        if (!this.permissionPicker) {
            this.permissionPicker = new ReplyPermissionPicker({
                selected: this.selectedPermission,
                onSelect: (id) => {
                    this.selectedPermission = id;
                    this.permissionPicker.props.selected = id;
                    this.updatePermissionDisplay();
                }
            });
        }

        this.permissionPicker.open(btn);
    }

    updatePermissionDisplay() {
        const btn = this.element.querySelector('.dialog-reply-permission');
        if (!btn) return;

        const span = btn.querySelector('span');
        if (span) span.textContent = ReplyPermissionPicker.getButtonLabelById(this.selectedPermission);

        const svg = btn.querySelector('svg');
        if (svg) svg.innerHTML = ReplyPermissionPicker.getIconPathById(this.selectedPermission);
    }

    onMount() {
        const textarea = this.element.querySelector('#dialog-post-input');
        const submitButton = this.element.querySelector('#btn-submit-dialog-post');
        const fileInput = this.element.querySelector('.media-file-input');

        if (textarea && submitButton) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
                this.updateCharCounter();
            });

            submitButton.addEventListener('click', this.handleSubmit);
            textarea.focus();
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.mediaFile = file;
                    this.selectedGif = null;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        this.mediaPreviewUrl = ev.target.result;
                        this.showMediaPreview(this.mediaPreviewUrl);
                    };
                    reader.readAsDataURL(file);
                }
                fileInput.value = '';
            });
        }

        const removeBtn = this.element.querySelector('.media-preview-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => this.clearMedia());
        }

        this.element.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                if (!btn.classList.contains('disabled')) {
                    this.handleActionClick(action);
                }
            });
        });

        const permissionBtn = this.element.querySelector('.dialog-reply-permission');
        if (permissionBtn) {
            permissionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openPermissionPicker();
            });
        }
    }
}
