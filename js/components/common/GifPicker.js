import { Component, safeCreateFragment, safeSetInnerHTML } from '@/core';
import { dataService } from '@/core';

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
        this.autoplay = true;
        this.close = this.close.bind(this);
        this.gifData = null;
    }

    async open() {
        this.gifData = await dataService.load('gif');
        this.currentView = 'categories';
        this.currentCategory = null;

        const html = this.renderShell();
        const fragment = safeCreateFragment(html);
        this.dialogElement = fragment.firstElementChild;
        document.body.appendChild(this.dialogElement);
        document.body.style.overflow = 'hidden';
        this.attachShellListeners();
        this.attachViewListeners();

        const searchInput = this.dialogElement.querySelector('.gif-search-input');
        if (searchInput) searchInput.focus();
    }

    close() {
        if (this.dialogElement) {
            this.dialogElement.remove();
            this.dialogElement = null;
        }
        document.body.style.overflow = '';
    }

    renderShell() {
        return `
            <div class="dialog-overlay gif-picker-overlay">
                <div class="dialog-container gif-picker-modal" role="dialog" aria-modal="true">
                    <div class="gif-picker-inner">
                        ${this.renderView()}
                    </div>
                </div>
            </div>
        `;
    }

    renderView() {
        return `
            ${this.renderHeader()}
            ${this.currentView === 'results' ? this.renderAutoplayBar() : ''}
            <div class="gif-picker-body">
                ${this.renderBody()}
            </div>
        `;
    }

    renderHeader() {
        const searchSvg = `<svg viewBox="0 0 24 24" class="gif-search-icon"><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></svg>`;
        const closeSvg = `<svg viewBox="0 0 24 24"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg>`;

        if (this.currentView === 'categories') {
            return `
                <div class="gif-header flex items-center">
                    <button class="dialog-close gif-picker-close" aria-label="Kapat">
                        ${closeSvg}
                    </button>
                    <div class="gif-search-container flex items-center grow">
                        ${searchSvg}
                        <input type="text" class="gif-search-input" placeholder="GIF Ara">
                    </div>
                </div>
            `;
        }

        return `
            <div class="gif-header flex items-center">
                <button class="gif-back-btn" aria-label="Geri">
                    <svg viewBox="0 0 24 24"><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></svg>
                </button>
                <div class="gif-search-container flex items-center grow">
                    ${searchSvg}
                    <input type="text" class="gif-search-input" value="${this.currentCategory ? this.currentCategory.name : ''}">
                    <button class="gif-search-clear" aria-label="Temizle">
                        ${closeSvg}
                    </button>
                </div>
            </div>
        `;
    }

    renderAutoplayBar() {
        return `
            <div class="gif-autoplay-bar flex items-center justify-between">
                <span class="gif-autoplay-label">GIF'leri otomatik oynat</span>
                <button class="gif-autoplay-toggle${this.autoplay ? ' active' : ''}" role="switch" aria-checked="${this.autoplay}">
                    <span class="gif-toggle-thumb"></span>
                </button>
            </div>
        `;
    }

    renderBody() {
        if (this.currentView === 'categories') {
            return this.renderCategories();
        }
        return this.renderResults();
    }

    renderCategories() {
        return `
            <div class="gif-categories-grid">
                ${this.gifData.categories.map(cat => `
                    <button class="gif-category-item" data-category-id="${cat.id}" style="background-image: url('${cat.background}')">
                        <span class="gif-category-name">${cat.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderResults() {
        const gifs = this.getGifsForCategory(this.currentCategory.id);
        return `
            <div class="gif-results-masonry">
                ${gifs.map(gif => `
                    <button class="gif-result-item" data-gif-url="${gif}">
                        <img src="${gif}" alt="GIF" loading="lazy">
                    </button>
                `).join('')}
            </div>
        `;
    }

    getGifsForCategory(categoryId) {
        if (this.gifData.sample_gifs[categoryId]) {
            return this.gifData.sample_gifs[categoryId];
        }
        const fallbackKeys = Object.keys(this.gifData.sample_gifs);
        const fallbackKey = fallbackKeys[Math.abs(categoryId.charCodeAt(0)) % fallbackKeys.length];
        return this.gifData.sample_gifs[fallbackKey];
    }

    updateView() {
        const inner = this.dialogElement?.querySelector('.gif-picker-inner');
        if (inner) {
            safeSetInnerHTML(inner, this.renderView());
            this.attachViewListeners();
        }
    }

    showCategory(categoryId) {
        const category = this.gifData.categories.find(c => c.id === categoryId);
        if (!category) return;
        this.currentView = 'results';
        this.currentCategory = category;
        this.updateView();
    }

    showCategories() {
        this.currentView = 'categories';
        this.currentCategory = null;
        this.updateView();

        const searchInput = this.dialogElement?.querySelector('.gif-search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
    }

    attachShellListeners() {
        if (!this.dialogElement) return;

        this.dialogElement.addEventListener('click', (e) => {
            if (e.target === this.dialogElement) {
                this.close();
            }
        });
    }

    attachViewListeners() {
        if (!this.dialogElement) return;

        const closeBtn = this.dialogElement.querySelector('.gif-picker-close');
        closeBtn?.addEventListener('click', this.close);

        const backBtn = this.dialogElement.querySelector('.gif-back-btn');
        backBtn?.addEventListener('click', () => this.showCategories());

        this.dialogElement.querySelectorAll('.gif-category-item').forEach(item => {
            item.addEventListener('click', () => {
                this.showCategory(item.dataset.categoryId);
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

        const searchInput = this.dialogElement.querySelector('.gif-search-input');
        if (searchInput && this.currentView === 'categories') {
            searchInput.addEventListener('input', (e) => {
                this.filterCategories(e.target.value.toLowerCase().trim());
            });
        }

        const clearBtn = this.dialogElement.querySelector('.gif-search-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                const input = this.dialogElement.querySelector('.gif-search-input');
                if (input) {
                    input.value = '';
                    input.focus();
                }
            });
        }

        const autoplayToggle = this.dialogElement.querySelector('.gif-autoplay-toggle');
        if (autoplayToggle) {
            autoplayToggle.addEventListener('click', () => {
                this.autoplay = !this.autoplay;
                autoplayToggle.classList.toggle('active', this.autoplay);
                autoplayToggle.setAttribute('aria-checked', String(this.autoplay));
            });
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
