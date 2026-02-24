import { Component, safeCreateFragment, safeSetInnerHTML } from '@/core';

const GIF_CATEGORIES = [
    { id: 'agree', name: 'Katılıyorum', preview: 'https://media.tenor.com/images/agree.gif', color: '#FF6B6B' },
    { id: 'applause', name: 'Alkış', preview: 'https://media.tenor.com/images/applause.gif', color: '#4ECDC4' },
    { id: 'aww', name: 'Aaa', preview: 'https://media.tenor.com/images/aww.gif', color: '#45B7D1' },
    { id: 'dance', name: 'Dans', preview: 'https://media.tenor.com/images/dance.gif', color: '#96CEB4' },
    { id: 'deal-with-it', name: 'Hallederim', preview: 'https://media.tenor.com/images/dealwithit.gif', color: '#FFEAA7' },
    { id: 'do-not-want', name: 'İstemiyorum', preview: 'https://media.tenor.com/images/donotwant.gif', color: '#DDA0DD' },
    { id: 'eww', name: 'İğrenç', preview: 'https://media.tenor.com/images/eww.gif', color: '#98D8C8' },
    { id: 'eye-roll', name: 'Göz Devirmek', preview: 'https://media.tenor.com/images/eyeroll.gif', color: '#F7DC6F' },
    { id: 'facepalm', name: 'Yüz Avuçlama', preview: 'https://media.tenor.com/images/facepalm.gif', color: '#BB8FCE' },
    { id: 'fist-bump', name: 'Yumruk', preview: 'https://media.tenor.com/images/fistbump.gif', color: '#85C1E9' },
    { id: 'good-luck', name: 'İyi Şanslar', preview: 'https://media.tenor.com/images/goodluck.gif', color: '#82E0AA' },
    { id: 'happy-dance', name: 'Mutlu Dans', preview: 'https://media.tenor.com/images/happydance.gif', color: '#F1948A' },
    { id: 'hearts', name: 'Kalpler', preview: 'https://media.tenor.com/images/hearts.gif', color: '#E74C3C' },
    { id: 'high-five', name: 'Çak Bir Beşlik', preview: 'https://media.tenor.com/images/highfive.gif', color: '#F0B27A' },
    { id: 'hug', name: 'Sarılma', preview: 'https://media.tenor.com/images/hug.gif', color: '#AED6F1' },
    { id: 'idk', name: 'Bilmiyorum', preview: 'https://media.tenor.com/images/idk.gif', color: '#D5DBDB' },
    { id: 'lol', name: 'LOL', preview: 'https://media.tenor.com/images/lol.gif', color: '#F9E79F' },
    { id: 'mic-drop', name: 'Mikrofon Bırakma', preview: 'https://media.tenor.com/images/micdrop.gif', color: '#A569BD' },
    { id: 'no', name: 'Hayır', preview: 'https://media.tenor.com/images/no.gif', color: '#E57373' },
    { id: 'omg', name: 'OMG', preview: 'https://media.tenor.com/images/omg.gif', color: '#FFB74D' },
    { id: 'oops', name: 'Oops', preview: 'https://media.tenor.com/images/oops.gif', color: '#CE93D8' },
    { id: 'please', name: 'Lütfen', preview: 'https://media.tenor.com/images/please.gif', color: '#81D4FA' },
    { id: 'popcorn', name: 'Patlamış Mısır', preview: 'https://media.tenor.com/images/popcorn.gif', color: '#FFF176' },
    { id: 'sad', name: 'Üzgün', preview: 'https://media.tenor.com/images/sad.gif', color: '#90CAF9' },
    { id: 'scared', name: 'Korkmuş', preview: 'https://media.tenor.com/images/scared.gif', color: '#A5D6A7' },
    { id: 'shocked', name: 'Şok', preview: 'https://media.tenor.com/images/shocked.gif', color: '#FFCC80' },
    { id: 'slow-clap', name: 'Yavaş Alkış', preview: 'https://media.tenor.com/images/slowclap.gif', color: '#B0BEC5' },
    { id: 'snl', name: 'SNL', preview: 'https://media.tenor.com/images/snl.gif', color: '#FFAB91' },
    { id: 'sorry', name: 'Özür', preview: 'https://media.tenor.com/images/sorry.gif', color: '#80CBC4' },
    { id: 'thank-you', name: 'Teşekkürler', preview: 'https://media.tenor.com/images/thankyou.gif', color: '#C5E1A5' },
    { id: 'thumbs-down', name: 'Beğenmedim', preview: 'https://media.tenor.com/images/thumbsdown.gif', color: '#EF9A9A' },
    { id: 'thumbs-up', name: 'Beğendim', preview: 'https://media.tenor.com/images/thumbsup.gif', color: '#A5D6A7' },
    { id: 'want', name: 'İstiyorum', preview: 'https://media.tenor.com/images/want.gif', color: '#CE93D8' },
    { id: 'win', name: 'Kazandım', preview: 'https://media.tenor.com/images/win.gif', color: '#FFD54F' },
    { id: 'wink', name: 'Göz Kırpma', preview: 'https://media.tenor.com/images/wink.gif', color: '#F48FB1' },
    { id: 'yolo', name: 'YOLO', preview: 'https://media.tenor.com/images/yolo.gif', color: '#80DEEA' }
];

const SAMPLE_GIFS = {
    'agree': [
        'https://media.tenor.com/lCPKdFbgJx8AAAAM/nod-yes.gif',
        'https://media.tenor.com/EPm3LHMx2FIAAAAM/yes-agree.gif',
        'https://media.tenor.com/bm8Q6Fy4GOMAAAAM/jack-nicholson-yes.gif',
        'https://media.tenor.com/TKpmDEMFKWoAAAAM/agree-nod.gif',
        'https://media.tenor.com/Z1n8VnpQkEgAAAAM/yes-baby.gif',
        'https://media.tenor.com/E3DEPypgAfMAAAAM/agree.gif'
    ],
    'applause': [
        'https://media.tenor.com/ZQTGLanYcCAAAAAM/clapping.gif',
        'https://media.tenor.com/a4RRv0EaxVkAAAAM/clap-applause.gif',
        'https://media.tenor.com/lSWRGx_BVQEAAAAM/standing-ovation.gif',
        'https://media.tenor.com/tXYQU6E1MZYAAAAM/wow-clap.gif',
        'https://media.tenor.com/5sHqAjGqz30AAAAM/bravo-applause.gif',
        'https://media.tenor.com/fnfOWq5d7BIAAAAM/clapping-leonardo-dicaprio.gif'
    ],
    'dance': [
        'https://media.tenor.com/oLAh99MHmJQAAAAM/dance-moves.gif',
        'https://media.tenor.com/DBt_wPdVi5EAAAAM/dance-happy.gif',
        'https://media.tenor.com/gN6BO_WGJeoAAAAM/happy-dance.gif',
        'https://media.tenor.com/OxlgObwUNNAAAAAM/carlton-dance.gif',
        'https://media.tenor.com/FkqSEcIqy2oAAAAM/dancing-happy.gif',
        'https://media.tenor.com/W7q0QUG4dxoAAAAM/party-dance.gif'
    ],
    'lol': [
        'https://media.tenor.com/nYC_6L1zLHMAAAAM/laughing.gif',
        'https://media.tenor.com/tH3LasD7YeAAAAAM/lol-laugh.gif',
        'https://media.tenor.com/sMF6pHfgqxYAAAAM/dying-laughing.gif',
        'https://media.tenor.com/DqU9gqBNBMYAAAAM/laugh-hysterical.gif',
        'https://media.tenor.com/OHeBKOA77yIAAAAM/lmao-lol.gif',
        'https://media.tenor.com/_gSo6bwlEVwAAAAM/crying-laughing.gif'
    ],
    'hearts': [
        'https://media.tenor.com/gvNRIKD4q3IAAAAM/hearts-love.gif',
        'https://media.tenor.com/Szt5dBFR3UcAAAAM/heart-love.gif',
        'https://media.tenor.com/VmQ_1gFtZiIAAAAM/love-hearts.gif',
        'https://media.tenor.com/u1fZgxF0T8MAAAAM/cute-love.gif',
        'https://media.tenor.com/2I_R5LQSergAAAAM/heart-hearts.gif',
        'https://media.tenor.com/VgfC3mxFdX4AAAAM/love-you.gif'
    ],
    'sad': [
        'https://media.tenor.com/5uE-h_mbONAAAAAM/sad-crying.gif',
        'https://media.tenor.com/8RJH0NRhxhQAAAAM/cry-sad.gif',
        'https://media.tenor.com/vnwVu64kFn0AAAAM/sad-pablo.gif',
        'https://media.tenor.com/fUvfwePH7GkAAAAM/crying-sad.gif',
        'https://media.tenor.com/J-VWx_dHWNgAAAAM/sad-cat.gif',
        'https://media.tenor.com/GTq7IvKQzEIAAAAM/depressed-sad.gif'
    ],
    'thumbs-up': [
        'https://media.tenor.com/izz1PLmE_5EAAAAM/thumbs-up.gif',
        'https://media.tenor.com/6fRE09YK578AAAAM/ok-thumbsup.gif',
        'https://media.tenor.com/INjRYfnIqh4AAAAM/nice-good.gif',
        'https://media.tenor.com/sYjAcI5K4OYAAAAM/thumbs-up-great.gif',
        'https://media.tenor.com/S8Xwf-7OcUUAAAAM/good-job.gif',
        'https://media.tenor.com/J_Y3zPzJcFAAAAAM/thumbs-up-ok.gif'
    ],
    'shocked': [
        'https://media.tenor.com/kG9WtQ7QlJUAAAAM/shocked-omg.gif',
        'https://media.tenor.com/R9gI12P45JQAAAAM/shock-surprise.gif',
        'https://media.tenor.com/mfhS8IG7NVIAAAAM/shocked-face.gif',
        'https://media.tenor.com/AK-X2hGW4DUAAAAM/gasp-surprise.gif',
        'https://media.tenor.com/TG0iYpahBQMAAAAM/omg-shocked.gif',
        'https://media.tenor.com/gJ6q8PCZR1QAAAAM/shocked-what.gif'
    ]
};

function getGifsForCategory(categoryId) {
    if (SAMPLE_GIFS[categoryId]) {
        return SAMPLE_GIFS[categoryId];
    }
    const fallbackKeys = Object.keys(SAMPLE_GIFS);
    const fallbackKey = fallbackKeys[Math.abs(categoryId.charCodeAt(0)) % fallbackKeys.length];
    return SAMPLE_GIFS[fallbackKey];
}

export class GifPicker extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            onSelect: null,
            ...props
        };
        this.dialogElement = null;
        this.currentView = 'categories';
        this.currentCategory = null;
        this.close = this.close.bind(this);
    }

    open() {
        this.currentView = 'categories';
        this.currentCategory = null;

        const html = this.renderDialog();
        const fragment = safeCreateFragment(html);
        this.dialogElement = fragment.firstElementChild;
        document.body.appendChild(this.dialogElement);
        document.body.style.overflow = 'hidden';
        this.attachEventListeners();
    }

    close() {
        if (this.dialogElement) {
            this.dialogElement.remove();
            this.dialogElement = null;
        }
        document.body.style.overflow = '';
    }

    renderDialog() {
        return `
            <div class="dialog-overlay gif-picker-overlay">
                <div class="dialog-container gif-picker-modal" role="dialog" aria-modal="true">
                    <div class="dialog-header">
                        <button class="dialog-close gif-picker-close" aria-label="Kapat">
                            <svg viewBox="0 0 24 24"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg>
                        </button>
                        <div class="gif-search-container flex items-center grow">
                            <svg viewBox="0 0 24 24" class="gif-search-icon"><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></svg>
                            <input type="text" class="gif-search-input" placeholder="GIF Ara">
                        </div>
                    </div>
                    <div class="dialog-body gif-picker-body">
                        ${this.renderContent()}
                    </div>
                </div>
            </div>
        `;
    }

    renderContent() {
        if (this.currentView === 'categories') {
            return this.renderCategories();
        }
        return this.renderGifList();
    }

    renderCategories() {
        return `
            <div class="gif-categories-grid">
                ${GIF_CATEGORIES.map(cat => `
                    <button class="gif-category-item" data-category-id="${cat.id}" style="background-color: ${cat.color}">
                        <span class="gif-category-name">${cat.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderGifList() {
        const gifs = getGifsForCategory(this.currentCategory);
        const category = GIF_CATEGORIES.find(c => c.id === this.currentCategory);

        return `
            <div class="gif-list-header flex items-center">
                <button class="gif-back-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20"><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></svg>
                </button>
                <span class="gif-list-title">${category ? category.name : 'GIF'}</span>
            </div>
            <div class="gif-results-grid">
                ${gifs.map(gif => `
                    <button class="gif-result-item" data-gif-url="${gif}">
                        <img src="${gif}" alt="GIF" loading="lazy">
                    </button>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        if (!this.dialogElement) return;

        const closeBtn = this.dialogElement.querySelector('.gif-picker-close');
        closeBtn?.addEventListener('click', this.close);

        this.dialogElement.addEventListener('click', (e) => {
            if (e.target === this.dialogElement) {
                this.close();
            }
        });

        this.attachContentListeners();

        const searchInput = this.dialogElement.querySelector('.gif-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                if (this.currentView === 'categories') {
                    this.filterCategories(query);
                }
            });
        }
    }

    attachContentListeners() {
        if (!this.dialogElement) return;

        this.dialogElement.querySelectorAll('.gif-category-item').forEach(item => {
            item.addEventListener('click', () => {
                const categoryId = item.dataset.categoryId;
                this.showCategory(categoryId);
            });
        });

        this.dialogElement.querySelectorAll('.gif-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const gifUrl = item.dataset.gifUrl;
                if (this.props.onSelect) {
                    this.props.onSelect(gifUrl);
                }
                this.close();
            });
        });

        const backBtn = this.dialogElement.querySelector('.gif-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.currentView = 'categories';
                this.currentCategory = null;
                this.updateBody();
            });
        }
    }

    showCategory(categoryId) {
        this.currentView = 'gifs';
        this.currentCategory = categoryId;
        this.updateBody();
    }

    updateBody() {
        const body = this.dialogElement.querySelector('.gif-picker-body');
        if (body) {
            safeSetInnerHTML(body, this.renderContent());
            this.attachContentListeners();
        }
    }

    filterCategories(query) {
        if (!this.dialogElement) return;
        const items = this.dialogElement.querySelectorAll('.gif-category-item');
        items.forEach(item => {
            const name = item.querySelector('.gif-category-name').textContent.toLowerCase();
            item.style.display = name.includes(query) ? '' : 'none';
        });
    }
}
