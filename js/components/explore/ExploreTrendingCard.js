import { Component } from '@/core';

export class ExploreTrendingCard extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            image: '',
            category: '',
            title: '',
            subtitle: '',
            buttonText: '',
            ...props
        };
    }

    render() {
        const { image, category, title, subtitle, buttonText } = this.props;

        return `
            <div class="explore-trending-card">
                <img src="${image}" alt="${title}" class="explore-trending-card__image">
                <div class="explore-trending-card__overlay">
                    <span class="explore-trending-card__title">${title}</span>
                    <span class="explore-trending-card__subtitle">${subtitle}</span>
                    <button class="explore-trending-card__btn">${buttonText}</button>
                </div>
            </div>
        `;
    }
}
