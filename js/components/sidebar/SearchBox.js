import { Component, safeSetInnerHTML } from '@/core';

const STORAGE_KEY = 'twitter-clone-recent-searches';
const MAX_RECENT = 5;

export class SearchBox extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            placeholder: 'Ara',
            searchData: { profiles: [], trends: [] },
            ...props
        };
        this.recentSearches = [];
    }

    loadRecentSearches() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            this.recentSearches = stored ? JSON.parse(stored) : [];
        } catch {
            this.recentSearches = [];
        }
    }

    saveRecentSearches() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recentSearches));
    }

    addRecentSearch(item) {
        this.recentSearches = this.recentSearches.filter(r =>
            !(r.type === item.type && r.id === item.id)
        );
        this.recentSearches.unshift(item);
        if (this.recentSearches.length > MAX_RECENT) {
            this.recentSearches = this.recentSearches.slice(0, MAX_RECENT);
        }
        this.saveRecentSearches();
    }

    clearRecentSearches() {
        this.recentSearches = [];
        localStorage.removeItem(STORAGE_KEY);
        this.updatePopover('');
    }

    renderVerifiedIcon(verifiedType) {
        const style = verifiedType === 'gray' ? ' style="fill: #536471;"' : '';
        return `
            <svg class="verified-icon"${style} viewBox="0 0 24 24">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.01s-2.62-1.27-4.01-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.98-.2-4.02.81s-1.27 2.62-.81 4.01c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 4.01s2.62 1.27 4.01.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.98.2 4.02-.81s1.27-2.62.81-4.01c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.35-6.2 6.78z"></path>
            </svg>
        `;
    }

    renderProfileItem(profile) {
        const verified = profile.isVerified ? this.renderVerifiedIcon(profile.verifiedType) : '';
        return `
            <div class="search-result-item" data-type="profile" data-id="${profile.id}">
                <img src="${profile.avatar}" alt="${profile.displayName}" class="search-result-avatar">
                <div class="search-result-info">
                    <div class="search-result-name flex items-center">
                        <span class="search-result-displayname">${profile.displayName}</span>
                        ${verified}
                    </div>
                    <span class="search-result-handle">${profile.handle}</span>
                </div>
            </div>
        `;
    }

    renderTrendItem(trend) {
        return `
            <div class="search-result-item search-result-trend" data-type="trend" data-id="${trend.id}">
                <svg class="search-result-trend-icon" viewBox="0 0 24 24">
                    <use href="assets/images/main/sidebar/search.svg#search"/>
                </svg>
                <span class="search-result-trend-name">${trend.name}</span>
            </div>
        `;
    }

    renderRecentContent() {
        if (this.recentSearches.length === 0) {
            return `<p class="search-popover-text">Kişileri, arama terimlerini veya grupları aramayı dene</p>`;
        }

        const items = this.recentSearches.map(item => {
            if (item.type === 'profile') {
                return this.renderProfileItem(item);
            }
            return this.renderTrendItem(item);
        }).join('');

        return `
            <div class="search-popover-header">
                <h3 class="search-popover-title">Son aramalar</h3>
                <button class="search-popover-clear" id="clear-recent">Temizle</button>
            </div>
            <div class="search-popover-list">
                ${items}
            </div>
        `;
    }

    renderSearchResults(query) {
        const q = query.toLowerCase();
        const { profiles, trends } = this.props.searchData;

        const matchedProfiles = profiles.filter(p =>
            p.displayName.toLowerCase().includes(q) ||
            p.handle.toLowerCase().includes(q)
        ).slice(0, 5);

        const matchedTrends = trends.filter(t =>
            t.name.toLowerCase().includes(q)
        ).slice(0, 3);

        if (matchedProfiles.length === 0 && matchedTrends.length === 0) {
            return `<p class="search-popover-text">"${query}" için sonuç bulunamadı</p>`;
        }

        const trendItems = matchedTrends.map(t => this.renderTrendItem(t)).join('');
        const profileItems = matchedProfiles.map(p => this.renderProfileItem(p)).join('');

        return `
            <div class="search-popover-list">
                ${trendItems}
                ${profileItems}
            </div>
        `;
    }

    updatePopover(query) {
        const popover = this.element?.querySelector('.search-popover');
        if (!popover) return;

        const html = query.trim()
            ? this.renderSearchResults(query)
            : this.renderRecentContent();

        safeSetInnerHTML(popover, html);
        this.bindPopoverEvents();
    }

    bindPopoverEvents() {
        const clearBtn = this.element?.querySelector('#clear-recent');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearRecentSearches();
            });
        }

        const resultItems = this.element?.querySelectorAll('.search-result-item');
        if (resultItems) {
            resultItems.forEach(item => {
                item.addEventListener('click', () => {
                    const type = item.dataset.type;
                    const id = item.dataset.id;
                    const { profiles, trends } = this.props.searchData;

                    let searchItem;
                    if (type === 'profile') {
                        const profile = profiles.find(p => p.id === id) ||
                            this.recentSearches.find(r => r.id === id && r.type === 'profile');
                        if (profile) {
                            searchItem = { ...profile, type: 'profile' };
                        }
                    } else {
                        const trend = trends.find(t => t.id === id) ||
                            this.recentSearches.find(r => r.id === id && r.type === 'trend');
                        if (trend) {
                            searchItem = { ...trend, type: 'trend' };
                        }
                    }

                    if (searchItem) {
                        this.addRecentSearch(searchItem);
                    }
                });
            });
        }
    }

    render() {
        const { placeholder } = this.props;

        return `
            <div class="sidebar-search sticky">
                <div class="search-wrapper">
                    <div class="search-container flex items-center">
                        <svg>
                            <use href="assets/images/main/sidebar/search.svg#search"/>
                        </svg>
                        <label for="search-input" hidden></label>
                        <input type="text" placeholder="${placeholder}" id="search-input">
                    </div>
                    <div class="search-popover">
                        <p class="search-popover-text">Kişileri, arama terimlerini veya grupları aramayı dene</p>
                    </div>
                </div>
            </div>
        `;
    }

    onMount() {
        this.loadRecentSearches();

        const input = this.element?.querySelector('#search-input');
        if (input) {
            input.addEventListener('input', (e) => {
                this.updatePopover(e.target.value);
            });

            input.addEventListener('focus', () => {
                this.updatePopover(input.value);
            });
        }
    }
}
