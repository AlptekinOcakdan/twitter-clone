import { Component } from '@/core';

export class UserProfile extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            displayName: '',
            handle: '',
            avatar: 'assets/images/header/users/user-avatar.jpg',
            ...props
        };
    }

    render() {
        const { displayName, handle, avatar } = this.props;

        return `
            <div id="user-profile" class="flex flex-row items-center">
                <img src="${avatar}" alt="${displayName}">
                <div class="user-info">
                    <span class="user-name">${displayName}</span>
                    <span class="user-handle">${handle}</span>
                </div>
                <svg>
                    <use href="./assets/images/header/icons/icon-dropdown.svg#icon-dropdown"/>
                </svg>
            </div>
        `;
    }
}

