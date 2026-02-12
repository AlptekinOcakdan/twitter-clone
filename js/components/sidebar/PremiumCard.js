import { Component } from '@/core';

export class PremiumCard extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: "Premium'a Abone Ol",
            description: '',
            buttonText: 'Abone ol',
            ...props
        };
    }

    render() {
        const { title, description, buttonText } = this.props;

        return `
            <div class="sidebar-card premium-card">
                <h2>${title}</h2>
                <p>${description}</p>
                <button class="subscribe-btn">${buttonText}</button>
            </div>
        `;
    }
}

