import { Component } from '@/core';

export class SearchMediaGrid extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            items: [],
            ...props
        };
    }

    render() {
        const { items } = this.props;

        if (items.length === 0) {
            return `
                <div class="search-empty-state">
                    <p>Medya bulunamadı</p>
                </div>
            `;
        }

        const mediaHtml = items.map(item => `
            <div class="search-media-item">
                <img src="${item.url}" alt="${item.alt || ''}">
            </div>
        `).join('');

        return `
            <div class="search-media-grid">
                ${mediaHtml}
            </div>
        `;
    }
}
