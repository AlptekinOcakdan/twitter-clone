import { Component } from '@/core';

export class PublishButton extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            text: 'Gönderi yayınla',
            iconPath: 'assets/images/header/icons/icon-create-post.svg#icon-create-post',
            ...props
        };
    }

    render() {
        const { text, iconPath } = this.props;

        return `
            <a id="publish" class="flex items-center justify-center" href="#">
                <span class="post-text">${text}</span>
                <svg class="post-icon" viewBox="0 0 24 24">
                    <use href="${iconPath}"/>
                </svg>
            </a>
        `;
    }
}

