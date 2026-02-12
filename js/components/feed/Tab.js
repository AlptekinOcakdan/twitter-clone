import { Component } from '@/core';

export class Tab extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: '',
            label: '',
            active: false,
            hasDropdown: false,
            ...props
        };
    }

    render() {
        const { id, label, active, hasDropdown } = this.props;
        const activeClass = active ? ' active' : '';

        const dropdownIcon = hasDropdown ? `
            <svg class="tab-arrow">
                <use href="assets/images/main/feed/arrow-down.svg#arrow-down"/>
            </svg>
        ` : '';

        return `
            <button class="tab${activeClass}" data-tab-id="${id}">
                <div class="tab-label">
                    ${label}
                    ${dropdownIcon}
                </div>
            </button>
        `;
    }
}

