import { Component } from '@/core';
import { TrendItem } from './TrendItem.js';

export class TrendsCard extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: 'Neler oluyor?',
            items: [],
            showMoreText: 'Daha fazla göster',
            ...props
        };
    }

    render() {
        const { title, items, showMoreText } = this.props;

        const trendsHtml = items.map(item => {
            const trendItem = new TrendItem(item);
            return trendItem.render();
        }).join('');

        return `
            <div class="sidebar-card trends-card">
                <h2>${title}</h2>
                <div class="trend-list">
                    ${trendsHtml}
                </div>
                <a href="#" class="show-more">${showMoreText}</a>
            </div>
        `;
    }
}

