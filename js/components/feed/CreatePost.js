import { Component, postService } from '@/core';

export class CreatePost extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            userAvatar: 'assets/images/header/users/user-avatar.jpg',
            placeholder: 'Neler oluyor?',
            replyPermission: 'Herkes yanıtlayabilir',
            submitButtonText: 'Gönderi yayınla',
            actions: [],
            ...props
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit() {
        const textarea = document.getElementById('post-input');
        const submitButton = document.getElementById('btn-submit-post');

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
            submitButton.textContent = originalText;
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Gönderi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    onMount() {
        const textarea = document.getElementById('post-input');
        if (textarea) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            });
        }
    }

    renderActions() {
        const { actions } = this.props;

        return actions.map(action => {
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
            <div id="create-post" class="flex">
                <div class="post-avatar-container">
                    <img src="${userAvatar}" alt="User Avatar" class="user-avatar">
                </div>
                <div id="post-content-area" class="flex flex-col grow">
                    <div id="post-textarea-container">
                        <label for="post-input" hidden></label>
                        <textarea id="post-input" placeholder="${placeholder}"></textarea>
                    </div>

                    <div id="reply-permission" class="flex items-center">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
                        </svg>
                        <span>${replyPermission}</span>
                    </div>

                    <div id="post-actions" class="flex items-center justify-between">
                        <div class="action-icons flex items-center">
                            ${this.renderActions()}
                        </div>
                        <div class="submit-post">
                            <button id="btn-submit-post" class="btn-disabled-opacity" disabled>${submitButtonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
