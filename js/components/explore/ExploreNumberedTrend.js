import { Component } from '@/core';

export class ExploreNumberedTrend extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: '',
            rank: 0,
            category: '',
            name: '',
            postCount: '',
            ...props
        };
    }

    render() {
        const { id, rank, category, name, postCount } = this.props;

        const postCountHtml = postCount
            ? `<span class="explore-trend-posts">${postCount} gönderi</span>`
            : '';

        return `
            <div class="explore-numbered-trend flex" data-trend-id="${id}">
                <span class="explore-numbered-trend__rank">${rank}</span>
                <div class="explore-numbered-trend__content">
                    <span class="explore-trend-meta">${category}</span>
                    <span class="explore-trend-name">${name}</span>
                    ${postCountHtml}
                </div>
                <button class="explore-trend-more">
                    <svg viewBox="0 0 24 24"><use href="assets/images/main/sidebar/more.svg#more"/></svg>
                </button>
            </div>
        `;
    }
}
