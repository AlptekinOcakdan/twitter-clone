import {Component} from '@/core';

export class Footer extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            links: [],
            copyright: '© 2026 X Corp.',
            ...props
        };
    }

    render() {
        const {links, copyright} = this.props;

        const linksHtml = links.map((link, index) => {
            let mainText = `<span class="main-text">${link.text}</span>`;
            let separator = `<span class="separator">&nbsp;|</span>`;
            if (index < links.length - 1) {
                return (
                    `<a href="${link.href}">${mainText + separator}</a>`
                )
            } else {
                return (
                    `<a href="${link.href}">${mainText}</a>`
                )
            }
        }).join('');

        return `
            <footer class="sidebar-footer">
                <nav class="flex flex-wrap">
                    ${linksHtml}
                </nav>
                <div class="copyright">${copyright}</div>
            </footer>
        `;
    }
}

