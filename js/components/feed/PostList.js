import { Component } from '@/core';
import { Post } from './Post.js';

export class PostList extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            posts: [],
            ...props
        };
    }

    render() {
        const { posts } = this.props;

        const postsHtml = posts.map(post => {
            const postComponent = new Post(post);
            return postComponent.render();
        }).join('');

        return `
            <div id="posts-container">
                ${postsHtml}
            </div>
        `;
    }
}

