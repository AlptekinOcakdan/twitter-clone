import { Component } from '@/core';

export class SearchListItem extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: '',
            name: '',
            description: '',
            memberCount: 0,
            followerCount: 0,
            owner: { displayName: '', handle: '', avatar: '' },
            ...props
        };
    }

    render() {
        const { id, name, description, memberCount, followerCount, owner } = this.props;

        return `
            <div class="search-list-item" data-list-id="${id}">
                <div class="search-list-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 4h8v-2H8v2z"></path>
                    </svg>
                </div>
                <div class="search-list-content">
                    <span class="search-list-name">${name}</span>
<!--                    <p class="search-list-description">${description}</p>-->
                    <div class="search-list-meta flex items-center">
                        <img src="${owner.avatar}" alt="${owner.displayName}" class="search-list-owner-avatar">
                        <span class="search-list-owner-name">@${owner.displayName}</span>
                        <span class="search-list-stats">dahil ${followerCount} takipçi</span>
                    </div>
                </div>
            </div>
        `;
    }
}
