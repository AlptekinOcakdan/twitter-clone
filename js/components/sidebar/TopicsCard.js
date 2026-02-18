import { Component } from '@/core';
import { TopicItem } from './TopicItem.js';

export class TopicsCard extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            title: 'İlgini çekebilecek konular',
            items: [],
            showMoreText: 'Daha fazla göster',
            ...props
        };
    }

    render() {
        const { title, items, showMoreText } = this.props;

        const topicsHtml = items.map(item => {
            const topicItem = new TopicItem(item);
            return topicItem.render();
        }).join('');

        return `
            <div class="sidebar-card topics-card">
                <h2>${title}</h2>
                <div class="topics-list flex flex-wrap">
                    ${topicsHtml}
                </div>
                <a href="#" class="show-more">${showMoreText}</a>
            </div>
        `;
    }
}
