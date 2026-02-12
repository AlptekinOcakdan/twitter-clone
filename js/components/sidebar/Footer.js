import { Component } from '@/core';

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
        const { links, copyright } = this.props;

        const linksHtml = links.map(link =>
            `<a href="${link.href}">${link.text}</a>`
        ).join('');

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

