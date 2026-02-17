import { Component } from '@/core';

export class ProfileEmptyState extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: '',
            description: '',
            ...props
        };
    }

    render() {
        const { title, description } = this.props;

        return `
            <div class="profile-empty-state">
                <h2 class="profile-empty-state__title">${title}</h2>
                <p class="profile-empty-state__desc">${description}</p>
            </div>
        `;
    }
}
