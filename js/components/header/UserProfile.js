import { Component } from '@/core';
import { UserProfileMenu } from './UserProfileMenu.js';

export class UserProfile extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            displayName: '',
            handle: '',
            avatar: '/assets/images/header/users/user-avatar.jpg',
            ...props
        };
        this.menu = null;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.menu && this.menu.popoverElement) {
            this.menu.close();
            this.menu = null;
            return;
        }

        this.menu = new UserProfileMenu({
            handle: this.props.handle,
            anchorElement: this.element
        });
        this.menu.open();
    }

    onMount() {
        if (this.element) {
            this.element.addEventListener('click', this.handleClick);
        }
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
                    <use href="/assets/images/header/icons/icon-dropdown.svg#icon-dropdown"/>
                </svg>
            </div>
        `;
    }
}

