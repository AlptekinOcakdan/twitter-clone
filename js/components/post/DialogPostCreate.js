import { Component, postService } from '@/core';

export class DialogPostCreate extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            userAvatar: 'assets/images/header/users/user-avatar.jpg',
            placeholder: 'Neler oluyor?',
            replyPermission: 'Herkes yanıtlayabilir',
            submitButtonText: 'Gönderi yayınla',
            onPostCreated: null,
            actions: [
                { id: 'media', title: 'Medya', iconPath: 'assets/images/main/feed/upload-image.svg#upload-image' },
                { id: 'gif', title: 'GIF', iconPath: 'assets/images/main/feed/upload-gif.svg#upload-gif' },
                { id: 'poll', title: 'Anket', iconPath: 'assets/images/main/feed/create-poll.svg#create-poll', disabled: true },
                { id: 'emoji', title: 'İfade', iconPath: 'assets/images/main/feed/emoji.svg#emoji' },
                { id: 'schedule', title: 'Zamanla', iconPath: 'assets/images/main/feed/calendar-plan.svg#calendar-plan', disabled: true },
                { id: 'location', title: 'Konum', iconPath: 'assets/images/main/feed/location.svg#location', disabled: true }
            ],
            ...props
        };

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
                    </div>
                </div>

                <div class="dialog-reply-permission flex items-center">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
                    </svg>
                    <span>${replyPermission}</span>
                </div>

                <div class="dialog-post-actions flex items-center justify-between">
                    <div class="action-icons flex items-center">
                        ${this.renderActions()}
                    </div>
                    <div class="submit-post">
                        <button id="btn-submit-dialog-post" class="btn-disabled-opacity" disabled>${submitButtonText}</button>
                    </div>
                </div>
            </div>
        `;
    }

    async handleSubmit() {
        const textarea = this.element.querySelector('#dialog-post-input');
        const submitButton = this.element.querySelector('#btn-submit-dialog-post');

        if (!textarea || !submitButton) return;

        const text = textarea.value.trim();
        if (!text) return;

        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Gönderiliyor...';

        try {
            await postService.createPost({ text });

            textarea.value = '';
            textarea.style.height = 'auto';

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

    onMount() {
        const textarea = this.element.querySelector('#dialog-post-input');
        const submitButton = this.element.querySelector('#btn-submit-dialog-post');

        if (textarea && submitButton) {
            textarea.addEventListener('input', () => {
                const isEmpty = textarea.value.trim() === '';
                submitButton.disabled = isEmpty;

                if (isEmpty) {
                    submitButton.classList.add('btn-disabled-opacity');
                } else {
                    submitButton.classList.remove('btn-disabled-opacity');
                }

                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            });

            submitButton.addEventListener('click', this.handleSubmit);

            textarea.focus();
        }
    }
}
