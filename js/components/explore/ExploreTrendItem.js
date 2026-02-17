import { Component } from '@/core';

export class ExploreTrendItem extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: '',
            category: '',
            name: '',
            postCount: '',
            ...props
        };
    }

    render() {
        const { id, category, name, postCount } = this.props;

        const postCountHtml = postCount
            ? `<span class="explore-trend-posts">${postCount} gönderi</span>`
            : '';

        return `
            <div class="explore-trend-item flex justify-between" data-trend-id="${id}">
                <div class="explore-trend-info">
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
