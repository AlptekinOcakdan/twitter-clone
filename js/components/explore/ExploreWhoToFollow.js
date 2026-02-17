import { Component } from '@/core';
import { ExploreFollowItem } from './ExploreFollowItem.js';

export class ExploreWhoToFollow extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: 'Kimi takip etmeli',
            users: [],
            showMoreText: 'Daha fazla göster',
            ...props
        };
    }

    render() {
        const { title, users, showMoreText } = this.props;

        const usersHtml = users.map(user => {
            const followItem = new ExploreFollowItem(user);
            return followItem.render();
        }).join('');

        return `
            <div class="explore-who-to-follow">
                <h2 class="explore-section-title">${title}</h2>
                <div class="explore-follow-list">
                    ${usersHtml}
                </div>
                <a href="#" class="explore-show-more">${showMoreText}</a>
            </div>
        `;
    }
}
