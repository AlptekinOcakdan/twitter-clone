import { Component } from '@/core';
import { NavigationButton } from '@/components';

export class Navigation extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            items: [],
            currentPath: '/',
            ...props
        };
    }

    render() {
        const { items, currentPath } = this.props;

        const buttons = items.map(item => {
            const button = new NavigationButton({
                ...item,
                isActive: item.href === currentPath
            });
            return button.render();
        }).join('');

        return `
            <ul id="header-navigation" class="flex flex-col">
                ${buttons}
            </ul>
        `;
    }
}

