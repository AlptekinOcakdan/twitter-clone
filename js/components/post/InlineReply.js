import { Component, postService, safeSetInnerHTML } from '@/core';
import { GifPicker } from '@/components/common/GifPicker.js';
import { EmojiPicker } from '@/components/common/EmojiPicker.js';
import { ScheduleModal } from '@/components/common/ScheduleModal.js';

export class InlineReply extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            parentPost: null,
            userAvatar: '/assets/images/header/users/user-avatar.jpg',
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

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    get textarea() {
        return this.element?.querySelector('.inline-reply-textarea');
    }

    get submitBtn() {
        return this.element?.querySelector('.inline-reply-submit-btn');
    }

    expand() {
        this.element?.classList.add('is-expanded');
        setTimeout(() => {
            this.textarea?.focus();
            document.addEventListener('mousedown', this.handleOutsideClick);
        }, 0);
    }

    collapse() {
        this.element?.classList.remove('is-expanded');
        if (this.textarea) {
            this.textarea.value = '';
            this.textarea.style.height = 'auto';
        }
        this.clearMedia();
        this.scheduledDate = null;
        document.removeEventListener('mousedown', this.handleOutsideClick);
    }

    handleOutsideClick(e) {
        if (this.element && !this.element.contains(e.target)) {
            const hasContent = this.textarea?.value.trim() || this.mediaPreviewUrl || this.selectedGif;
            if (!hasContent) this.collapse();
        }
    }

    updateCharCounter() {
        const textarea = this.textarea;
        const counterFill = this.element?.querySelector('.char-counter-fill');
        const counterText = this.element?.querySelector('.char-counter-text');
        const counterSvg = this.element?.querySelector('.char-counter-svg');
        const counterWrapper = this.element?.querySelector('.char-counter-wrapper');
        const counterDivider = this.element?.querySelector('.char-counter-divider');
        const warningEl = this.element?.querySelector('.char-limit-warning');
        const warningText = this.element?.querySelector('.char-limit-warning-text');

        if (!textarea || !counterFill || !counterText) return;

        const len = textarea.value.length;
        const max = this.props.maxChars;
        const circumference = 97.39;
        const ratio = Math.min(len / max, 1);
        counterFill.style.strokeDashoffset = circumference - ratio * circumference;

        counterWrapper?.classList.toggle('hidden', len === 0);

        if (len > max) {
            const over = len - max;
            counterText.textContent = `-${over}`;
            counterText.classList.remove('hidden');
            counterText.classList.add('over');
            counterSvg?.classList.add('over-limit');
            counterFill.style.stroke = '#F4212E';
            counterDivider?.classList.remove('hidden');
            warningEl?.classList.remove('hidden');

            safeSetInnerHTML(
                warningText,
                `${this.escapeHtml(textarea.value.substring(0, max))}<span class="char-over-highlight">${this.escapeHtml(textarea.value.substring(max))}</span>`
            );
        } else {
            counterText.classList.add('hidden');
            counterText.classList.remove('over');
            counterSvg?.classList.remove('over-limit');
            counterDivider?.classList.add('hidden');
            warningEl?.classList.add('hidden');

            if (len > max - 20) {
                counterFill.style.stroke = '#FFD400';
                counterText.textContent = `${max - len}`;
                counterText.classList.remove('hidden');
                counterText.style.color = '#536471';
            } else {
                counterFill.style.stroke = '#1D9BF0';
            }
        }

        this.updateSubmitState();
    }

    updateSubmitState() {
        const hasContent = !!(this.textarea?.value.trim() || this.mediaPreviewUrl || this.selectedGif);
        const overLimit = (this.textarea?.value.length || 0) > this.props.maxChars;
        const btn = this.submitBtn;
        if (!btn) return;
        btn.disabled = !hasContent || overLimit;
        btn.classList.toggle('btn-disabled-opacity', !hasContent || overLimit);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearMedia() {
        this.mediaFile = null;
        this.mediaPreviewUrl = null;
        this.selectedGif = null;
        const preview = this.element?.querySelector('.media-preview');
        if (preview) {
            preview.classList.add('hidden');
            const img = preview.querySelector('.media-preview-img');
            if (img) img.src = '';
        }
        this.updateSubmitState();
    }

    showMediaPreview(url) {
        const preview = this.element?.querySelector('.media-preview');
        const img = this.element?.querySelector('.media-preview-img');
        if (preview && img) {
            img.src = url;
            preview.classList.remove('hidden');
        }
        this.updateSubmitState();
    }

    handleActionClick(action) {
        if (action === 'media') {
            this.element?.querySelector('.media-file-input')?.click();
        } else if (action === 'gif') {
            new GifPicker({
                onSelect: (gifUrl) => {
                    this.selectedGif = gifUrl;
                    this.mediaFile = null;
                    this.mediaPreviewUrl = null;
                    this.showMediaPreview(gifUrl);
                }
            }).open();
        } else if (action === 'emoji') {
            this.openEmojiPicker();
        } else if (action === 'schedule') {
            new ScheduleModal({
                onSchedule: (date) => { this.scheduledDate = date; }
            }).open();
        }
    }

    openEmojiPicker() {
        const emojiBtn = this.element?.querySelector('[data-action="emoji"]');
        if (!emojiBtn) return;

        const existing = this.element.querySelector('.emoji-picker-popover');
        if (existing) { existing.remove(); return; }

        new EmojiPicker({
            onSelect: (emoji) => {
                const ta = this.textarea;
                if (ta) {
                    const start = ta.selectionStart;
                    const end = ta.selectionEnd;
                    ta.value = ta.value.substring(0, start) + emoji + ta.value.substring(end);
                    ta.selectionStart = ta.selectionEnd = start + emoji.length;
                    ta.focus();
                    ta.dispatchEvent(new Event('input'));
                }
            },
            anchor: emojiBtn
        }).mount(this.element);
    }

    async handleSubmit() {
        const textarea = this.textarea;
        const submitBtn = this.submitBtn;
        if (!textarea || !submitBtn) return;

        const text = textarea.value.trim();
        if (!text && !this.mediaPreviewUrl && !this.selectedGif) return;
        if (textarea.value.length > this.props.maxChars) return;

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';

        try {
            const postData = { text, replyTo: this.props.parentPost?.id };

            if (this.mediaPreviewUrl) {
                postData.media = { type: 'image', url: this.mediaPreviewUrl, alt: '' };
            } else if (this.selectedGif) {
                postData.media = { type: 'image', url: this.selectedGif, alt: 'GIF' };
            }

            await postService.createPost(postData);
            this.collapse();
        } catch (error) {
            console.error('Failed to create reply:', error);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    renderActions() {
        return this.props.actions.map(action => {
            const disabledClass = action.disabled ? ' disabled' : '';
            return `<button class="action-btn${disabledClass}" title="${action.title}" data-action="${action.id}">
                <svg viewBox="0 0 24 24"><use href="${action.iconPath}"/></svg>
            </button>`;
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

    renderReplyingTo() {
        const post = this.props.parentPost;
        if (!post) return '';
        const handle = post.author?.handle || '';
        return `<div class="inline-reply-replying-to">
            <span class="inline-reply-replying-to-handle">${handle}</span>
            <span class="inline-reply-replying-to-text"> adlı kullanıcıya yanıt olarak</span>
        </div>`;
    }

    render() {
        const { userAvatar } = this.props;

        return `
            <div class="inline-reply">
                <div class="inline-reply-collapsed flex items-center">
                    <img src="${userAvatar}" alt="Avatar" class="user-avatar">
                    <div class="inline-reply-placeholder grow">Yanıtını gönder</div>
                    <button class="inline-reply-collapsed-btn">Yanıtla</button>
                </div>
                <div class="inline-reply-expanded-form">
                    ${this.renderReplyingTo()}
                    <div class="flex">
                        <div class="inline-reply-avatar-col">
                            <img src="${userAvatar}" alt="Avatar" class="user-avatar">
                        </div>
                        <div class="inline-reply-content grow">
                            <textarea class="inline-reply-textarea" placeholder="Yanıtını gönder"></textarea>
                            <div class="char-limit-warning hidden">
                                <span class="char-limit-warning-text"></span>
                            </div>
                            <div class="media-preview hidden">
                                <button class="media-preview-remove" type="button">&times;</button>
                                <img class="media-preview-img" src="" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="inline-reply-actions flex items-center justify-between">
                        <div class="action-icons flex items-center">
                            ${this.renderActions()}
                        </div>
                        <div class="submit-area flex items-center">
                            ${this.renderCharCounter()}
                            <button class="inline-reply-submit-btn btn-disabled-opacity" disabled>Yanıtla</button>
                        </div>
                    </div>
                </div>
                <input type="file" class="media-file-input hidden" accept="image/*">
            </div>
        `;
    }

    onMount() {
        const collapsedArea = this.element?.querySelector('.inline-reply-collapsed');
        const textarea = this.textarea;
        const submitBtn = this.submitBtn;
        const fileInput = this.element?.querySelector('.media-file-input');
        const removeBtn = this.element?.querySelector('.media-preview-remove');

        collapsedArea?.addEventListener('click', () => this.expand());

        textarea?.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
            this.updateCharCounter();
        });

        submitBtn?.addEventListener('click', this.handleSubmit);

        fileInput?.addEventListener('change', (e) => {
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

        removeBtn?.addEventListener('click', () => this.clearMedia());

        this.element?.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                if (!btn.classList.contains('disabled')) {
                    this.handleActionClick(action);
                }
            });
        });
    }

    destroy() {
        document.removeEventListener('mousedown', this.handleOutsideClick);
        super.destroy();
    }
}
