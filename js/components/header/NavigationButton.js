import { Component } from '@/core';

export class NavigationButton extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: '',
            label: '',
            href: '#',
            iconPath: '',
            isActive: false,
            isButton: false,
            ...props
        };
    }

    render() {
        const { id, label, href, iconPath, isActive, isButton } = this.props;
        const activeClass = isActive ? ' active' : '';

        if (isButton) {
            return `
                <li>
                    <button class="header-button${activeClass}" data-nav-id="${id}">
                        <svg viewBox="0 0 24 24">
                            <use href="${iconPath}"/>
                        </svg>
                        <span>${label}</span>
                    </button>
                </li>
            `;
        }

        return `
            <li>
                <a class="header-button${activeClass}" href="${href}" data-nav-id="${id}" data-link>
                    <svg viewBox="0 0 24 24">
                        <use href="${iconPath}"/>
                    </svg>
                    <span>${label}</span>
                </a>
            </li>
        `;
    }
}

