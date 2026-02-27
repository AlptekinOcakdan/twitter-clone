import { router } from '@/core';
import { ExploreView, HomeView, ProfileView, PostDetailView, SearchView } from '@/views';

class App {
    constructor() {
        this.container = document.body;
    }

    init() {
        this.setupRoutes();
        router.init(this.container);
    }

    setupRoutes() {
        router.route('/', async () => new HomeView());
        router.route('/index.html', async () => new HomeView());
        router.route('/explore', async () => new ExploreView());
        router.route('/search', async () => new SearchView());
        router.route('/follow', async () => new HomeView());
        router.route('/notifications', async () => new HomeView());
        router.route('/profile', async () => new ProfileView());
        router.route('/post/:id', async (params) => new PostDetailView(params));
        router.notFound(async () => new HomeView());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

