import { Component } from '@/core';

export class Logo extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            href: '/',
            iconPath: 'assets/images/brand/logo.svg#icon-x-logo',
            width: 40,
            height: 40,
            ...props
        };
    }

    render() {
        const { href, iconPath, width, height } = this.props;

        return `
            <a id="header-logo" href="${href}" data-link>
                <svg id="logo" width="${width}" height="${height}">
                    <use href="${iconPath}"></use>
                </svg>
            </a>
        `;
    }
}

