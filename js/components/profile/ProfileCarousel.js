import { Component } from '@/core';

export class ProfileCarousel extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: '',
            subtitle: '',
            items: [],
            ...props
        };
        this.scrollLeft = 0;
    }

    renderIcon(iconType) {
        const icons = {
            camera: '<path d="M9.697 3H14.303l1.5 2H19.5c.828 0 1.5.672 1.5 1.5v11c0 .828-.672 1.5-1.5 1.5h-15c-.828 0-1.5-.672-1.5-1.5v-11c0-.828.672-1.5 1.5-1.5h3.697l1.5-2zM12 17.5c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0-2c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"></path>',
            pen: '<path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>',
            person: '<path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path>',
            at: '<path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10 1.826 0 3.548-.498 5.025-1.36l-.922-1.812C14.88 19.587 13.49 20 12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8v1c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5V8h-2v.166C14.264 7.443 13.19 7 12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5c1.45 0 2.758-.626 3.674-1.617.757.858 1.848 1.407 3.076 1.407C20.552 16.79 22 15.34 22 13.54V12c0-5.523-4.477-10-10-10zm0 13c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"></path>',
            bell: '<path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.858 16H5.134z"></path>'
        };

        return `<svg class="profile-carousel-card__icon" viewBox="0 0 24 24">${icons[iconType] || ''}</svg>`;
    }

    renderCards() {
        return this.props.items.map(item => {
            const completedClass = item.completed ? ' completed' : '';
            return `
                <div class="profile-carousel-card${completedClass}" data-card-id="${item.id}">
                    <div class="profile-carousel-card__icon-wrapper">
                        ${this.renderIcon(item.icon)}
                    </div>
                    <h4 class="profile-carousel-card__title">${item.title}</h4>
                    <p class="profile-carousel-card__desc">${item.description}</p>
                </div>
            `;
        }).join('');
    }

    render() {
        const { title, subtitle } = this.props;

        return `
            <div class="profile-carousel">
                <div class="profile-carousel__header">
                    <h3 class="profile-carousel__title">${title}</h3>
                    <p class="profile-carousel__subtitle">${subtitle}</p>
                </div>
                <div class="profile-carousel__track-wrapper">
                    <button class="profile-carousel__arrow profile-carousel__arrow--left" aria-label="Sola kaydır">
                        <svg viewBox="0 0 24 24"><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></svg>
                    </button>
                    <div class="profile-carousel__track">
                        ${this.renderCards()}
                    </div>
                    <button class="profile-carousel__arrow profile-carousel__arrow--right" aria-label="Sağa kaydır">
                        <svg viewBox="0 0 24 24"><path d="M16.586 11L11.543 5.96l1.414-1.42L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586z"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }

    onMount() {
        const track = this.element.querySelector('.profile-carousel__track');
        const leftArrow = this.element.querySelector('.profile-carousel__arrow--left');
        const rightArrow = this.element.querySelector('.profile-carousel__arrow--right');

        if (!track || !leftArrow || !rightArrow) return;

        const updateArrows = () => {
            const atStart = track.scrollLeft <= 0;
            const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
            leftArrow.style.display = atStart ? 'none' : 'flex';
            rightArrow.style.display = atEnd ? 'none' : 'flex';
        };

        leftArrow.addEventListener('click', () => {
            track.scrollBy({ left: -200, behavior: 'smooth' });
        });

        rightArrow.addEventListener('click', () => {
            track.scrollBy({ left: 200, behavior: 'smooth' });
        });

        track.addEventListener('scroll', updateArrows);
        updateArrows();
    }
}
