import { Component, safeCreateFragment } from '@/core';

const EMOJI_CATEGORIES = [
    {
        name: 'Yüzler ve İnsanlar',
        emojis: [
            '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
            '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
            '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫',
            '🤔', '🫡', '🤐', '🤨', '😐', '😑', '😶', '🫥', '😏', '😒',
            '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒',
            '🤕', '🤢', '🤮', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳',
            '🥸', '😎', '🤓', '🧐', '😕', '🫤', '😟', '🙁', '😮', '😯',
            '😲', '😳', '🥺', '🥹', '😦', '😧', '😨', '😰', '😥', '😢',
            '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤',
            '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹',
            '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼'
        ]
    },
    {
        name: 'El Hareketleri',
        emojis: [
            '👋', '🤚', '🖐️', '✋', '🖖', '🫱', '🫲', '🫳', '🫴', '👌',
            '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉',
            '👆', '🖕', '👇', '☝️', '🫵', '👍', '👎', '✊', '👊', '🤛',
            '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏', '✍️', '💅',
            '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠'
        ]
    },
    {
        name: 'Kalpler ve Semboller',
        emojis: [
            '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
            '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
            '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️',
            '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑',
            '⭐', '🌟', '💫', '✨', '☀️', '🌈', '🔥', '💥', '⚡', '❄️'
        ]
    },
    {
        name: 'Hayvanlar ve Doğa',
        emojis: [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨',
            '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
            '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
            '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞',
            '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱'
        ]
    },
    {
        name: 'Yiyecek ve İçecek',
        emojis: [
            '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
            '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑',
            '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
            '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆',
            '☕', '🍵', '🫖', '🍶', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂'
        ]
    },
    {
        name: 'Aktiviteler',
        emojis: [
            '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
            '🏓', '🏸', '🏒', '🥍', '🏑', '🥅', '⛳', '🏹', '🎣', '🤿',
            '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️',
            '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🥁',
            '🎸', '🪕', '🎺', '🎷', '🎻', '🪗', '🎯', '🎲', '🧩', '🎮'
        ]
    },
    {
        name: 'Nesneler',
        emojis: [
            '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💿', '📀', '📷', '📸',
            '📹', '🎥', '📽️', '📞', '☎️', '📺', '📻', '🎙️', '⏰', '⌚',
            '💡', '🔦', '🕯️', '🪔', '💰', '💵', '💴', '💶', '💷', '💎',
            '🔑', '🗝️', '🔨', '🪓', '⛏️', '🔧', '🔩', '🪛', '🔗', '📎',
            '✂️', '📌', '📍', '🖊️', '✏️', '📝', '📚', '📖', '📰', '📦'
        ]
    },
    {
        name: 'Bayraklar',
        emojis: [
            '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇹🇷', '🇺🇸',
            '🇬🇧', '🇩🇪', '🇫🇷', '🇪🇸', '🇮🇹', '🇯🇵', '🇰🇷', '🇨🇳', '🇧🇷', '🇦🇺',
            '🇨🇦', '🇮🇳', '🇷🇺', '🇲🇽', '🇦🇷', '🇳🇱', '🇧🇪', '🇸🇪', '🇳🇴', '🇩🇰'
        ]
    }
];

export class EmojiPicker extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            onSelect: null,
            anchor: null,
            ...props
        };
        this.popoverElement = null;
        this.boundClose = this.handleOutsideClick.bind(this);
    }

    mount(parentElement) {
        const html = this.render();
        const fragment = safeCreateFragment(html);
        this.popoverElement = fragment.firstElementChild;
        parentElement.appendChild(this.popoverElement);
        this.position();
        this.attachEventListeners();

        setTimeout(() => {
            document.addEventListener('click', this.boundClose);
        }, 0);
    }

    position() {
        if (!this.popoverElement || !this.props.anchor) return;

        const anchorRect = this.props.anchor.getBoundingClientRect();
        const parentRect = this.popoverElement.parentElement.getBoundingClientRect();
        const popoverWidth = 320;
        const popoverHeight = 360;

        const anchorCenterX = anchorRect.left + anchorRect.width / 2;
        let left = anchorCenterX - parentRect.left - popoverWidth / 2;
        let top = anchorRect.bottom - parentRect.top + 4;

        const maxLeft = parentRect.width - popoverWidth;
        if (left < 0) left = 0;
        if (left > maxLeft) left = maxLeft;

        if (anchorRect.bottom + popoverHeight > window.innerHeight) {
            top = anchorRect.top - parentRect.top - popoverHeight - 4;
        }

        this.popoverElement.style.left = `${left}px`;
        this.popoverElement.style.top = `${top}px`;
    }

    render() {
        return `
            <div class="emoji-picker-popover">
                <div class="emoji-picker-header">
                    <div class="emoji-category-tabs flex">
                        ${EMOJI_CATEGORIES.map((cat, i) => `
                            <button class="emoji-cat-tab${i === 0 ? ' active' : ''}" data-cat-index="${i}" title="${cat.name}">
                                ${cat.emojis[0]}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="emoji-picker-body">
                    ${EMOJI_CATEGORIES.map((cat, i) => `
                        <div class="emoji-category-section" data-section-index="${i}">
                            <div class="emoji-category-title">${cat.name}</div>
                            <div class="emoji-grid">
                                ${cat.emojis.map(emoji => `
                                    <button class="emoji-item" data-emoji="${emoji}">${emoji}</button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        if (!this.popoverElement) return;

        this.popoverElement.querySelectorAll('.emoji-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const emoji = item.dataset.emoji;
                if (this.props.onSelect) {
                    this.props.onSelect(emoji);
                }
                this.close();
            });
        });

        this.popoverElement.querySelectorAll('.emoji-cat-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = tab.dataset.catIndex;
                const section = this.popoverElement.querySelector(`[data-section-index="${index}"]`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                this.popoverElement.querySelectorAll('.emoji-cat-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    handleOutsideClick(e) {
        if (this.popoverElement && !this.popoverElement.contains(e.target) && e.target !== this.props.anchor) {
            this.close();
        }
    }

    close() {
        document.removeEventListener('click', this.boundClose);
        if (this.popoverElement) {
            this.popoverElement.remove();
            this.popoverElement = null;
        }
    }
}
