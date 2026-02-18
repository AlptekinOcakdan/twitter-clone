import { Component } from '@/core';

export class TopicItem extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: '',
            name: '',
            ...props
        };
    }

    render() {
        const { id, name } = this.props;

        return `
            <a href="#" class="topic-pill" data-topic-id="${id}">${name}</a>
        `;
    }
}
