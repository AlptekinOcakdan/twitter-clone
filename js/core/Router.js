class Router {
    constructor() {
        this.routes = new Map();
        this.currentView = null;
        this.container = null;
        this.notFoundHandler = null;
        window.addEventListener('popstate', () => this.handleRoute());
    }

    init(container) {
        this.container = container;
        void this.handleRoute();
    }

    route(path, handler) {
        this.routes.set(path, handler);
        return this;
    }

    notFound(handler) {
        this.notFoundHandler = handler;
        return this;
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        void this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        let handler = this.routes.get(path);

        if (!handler) {
            for (const [routePath, routeHandler] of this.routes) {
                const params = this.matchRoute(routePath, path);
                if (params) {
                    handler = routeHandler;
                    this.currentParams = params;
                    break;
                }
            }
        }

        if (!handler) {
            if (this.notFoundHandler) {
                handler = this.notFoundHandler;
            } else {
                console.error(`Route not found: ${path}`);
                return;
            }
        }

        try {
            const view = await handler(this.currentParams || {});
            if (view && this.container) {
                this.currentView = view;
                await view.render(this.container);
            }
        } catch (error) {
            console.error('Error rendering route:', error);
        }
    }

    matchRoute(routePath, actualPath) {
        const routeParts = routePath.split('/');
        const actualParts = actualPath.split('/');

        if (routeParts.length !== actualParts.length) {
            return null;
        }

        const params = {};

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                const paramName = routeParts[i].slice(1);
                params[paramName] = actualParts[i];
            } else if (routeParts[i] !== actualParts[i]) {
                return null;
            }
        }

        return params;
    }

    getParams() {
        return this.currentParams || {};
    }

    getCurrentPath() {
        return window.location.pathname;
    }
}

export const router = new Router();

