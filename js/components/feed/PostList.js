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

        this.postComponents = [];

        const postsMap = new Map(posts.map(p => [p.id, p]));

        const replyChildIds = new Set();
        const parentIdsRendered = new Set();

        posts.forEach(post => {
            if (post.replyTo) {
                replyChildIds.add(post.id);
            }
        });

        const htmlParts = [];

        posts.forEach(post => {
            if (parentIdsRendered.has(post.id)) return;

            if (post.replyTo && postsMap.has(post.replyTo)) {
                const parentPost = postsMap.get(post.replyTo);

                const parentComponent = new Post({
                    ...parentPost,
                    postsMap,
                    isThreadParent: true
                });
                this.postComponents.push(parentComponent);

                const replyComponent = new Post({
                    ...post,
                    postsMap,
                    isThreadReply: true
                });
                this.postComponents.push(replyComponent);

                parentIdsRendered.add(parentPost.id);

                htmlParts.push(`
                    <div class="thread-group">
                        ${parentComponent.render()}
                        ${replyComponent.render()}
                    </div>
                `);
            } else if (!parentIdsRendered.has(post.id)) {
                const postComponent = new Post({ ...post, postsMap });
                this.postComponents.push(postComponent);
                htmlParts.push(postComponent.render());
            }
        });

        return `
            <div id="posts-container">
                ${htmlParts.join('')}
            </div>
        `;
    }

    onMount() {
        const postElements = this.element.querySelectorAll('.post');
        postElements.forEach((postElement, index) => {
            if (this.postComponents[index]) {
                this.postComponents[index].element = postElement;
                this.postComponents[index].onMount();
            }
        });
    }
}
