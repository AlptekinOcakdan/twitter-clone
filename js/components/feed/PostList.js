import { Component } from '@/core';
import { Post } from './Post.js';

export class PostList extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            posts: [],
            ...props
        };
        this.postComponents = [];
    }

    render() {
        const { posts } = this.props;

        // Clear previous components
        this.postComponents = [];

        const postsHtml = posts.map(post => {
            const postComponent = new Post(post);
            this.postComponents.push(postComponent);
            return postComponent.render();
        }).join('');

        return `
            <div id="posts-container">
                ${postsHtml}
            </div>
        `;
    }

    onMount() {
        // Mount each post component
        const postElements = this.element.querySelectorAll('.post');
        postElements.forEach((postElement, index) => {
            if (this.postComponents[index]) {
                this.postComponents[index].element = postElement;
                this.postComponents[index].onMount();
            }
        });
    }
}

