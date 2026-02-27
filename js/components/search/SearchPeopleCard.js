import { Component } from '@/core';
import { SearchFollowItem } from './SearchFollowItem.js';

export class SearchPeopleCard extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: 'Kişiler',
            users: [],
            showMoreText: 'Tümünü görüntüle',
            ...props
        };
    }

    render() {
        const { title, users, showMoreText } = this.props;

        const usersHtml = users.slice(0, 3).map(user => {
            const followItem = new SearchFollowItem(user);
            return followItem.render();
        }).join('');

        return `
            <div class="search-people-card">
                <h2 class="search-people-card__title">${title}</h2>
                <div class="search-people-card__list">
                    ${usersHtml}
                </div>
                <a href="/search" class="search-people-card__show-more" data-tab-switch="people">${showMoreText}</a>
            </div>
        `;
    }
}
