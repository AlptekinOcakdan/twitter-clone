import { Component } from '@/core';

export class ProfileCover extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            cover: '',
            avatar: '',
            ...props
        };
    }

    render() {
        const { cover, avatar } = this.props;

        const coverContent = cover
            ? `<img src="${cover}" alt="Kapak fotoğrafı" class="profile-cover__image">`
            : `<div class="profile-cover__placeholder"></div>`;

        return `
            <div class="profile-cover">
                <div class="profile-cover__banner">
                    ${coverContent}
                </div>
                <div class="profile-cover__avatar-wrapper">
                    <img src="${avatar}" alt="Profil fotoğrafı" class="profile-cover__avatar">
                </div>
            </div>
        `;
    }
}
