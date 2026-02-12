import { Component } from '@/core';
import { FollowItem } from './FollowItem.js';

export class WhoToFollow extends Component {
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
            const followItem = new FollowItem(user);
            return followItem.render();
        }).join('');

        return `
            <div class="sidebar-card who-to-follow">
                <h2>${title}</h2>
                <div class="follow-list">
                    ${usersHtml}
                </div>
                <a href="#" class="show-more">${showMoreText}</a>
            </div>
        `;
    }
}

