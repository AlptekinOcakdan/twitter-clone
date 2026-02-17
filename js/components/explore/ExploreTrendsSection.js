import { Component } from '@/core';
import { ExploreTrendItem } from './ExploreTrendItem.js';

export class ExploreTrendsSection extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: 'Senin için gündemler',
            items: [],
            showMoreText: 'Daha fazla göster',
            ...props
        };
    }

    render() {
        const { title, items, showMoreText } = this.props;

        const trendsHtml = items.map(item => {
            const trendItem = new ExploreTrendItem(item);
            return trendItem.render();
        }).join('');

        return `
            <div class="explore-trends">
                <h2 class="explore-section-title">${title}</h2>
                <div class="explore-trend-list">
                    ${trendsHtml}
                </div>
                <a href="#" class="explore-show-more">${showMoreText}</a>
            </div>
        `;
    }
}
