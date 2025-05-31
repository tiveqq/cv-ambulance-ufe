// Router service for SPA navigation using the Navigation API

// Define route types
export type Route = {
  path: string;
  params?: Record<string, string>;
};

// Navigation state interface
export interface NavigationState {
  route: Route;
}

// Router class to handle navigation
export class Router {
  private static instance: Router;
  private listeners: ((route: Route) => void)[] = [];

  private constructor() {

    // Listen for navigation events
    window.addEventListener('popstate', (event) => {
      const state = event.state as NavigationState;
      if (state && state.route) {
        this.notifyListeners(state.route);
      }
    });
  }

  // Singleton pattern
  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  // Navigate to a new route
  public navigate(route: Route): void {
    // Update browser history
    const url = route.path + this.buildQueryParams(route.params);
    const state: NavigationState = { route };

    window.history.pushState(state, '', url);

    // Notify listeners about the route change
    this.notifyListeners(route);
  }

  // Replace current route without adding to history
  public replace(route: Route): void {
    const url = route.path + this.buildQueryParams(route.params);
    const state: NavigationState = { route };

    window.history.replaceState(state, '', url);

    this.notifyListeners(route);
  }

  // Subscribe to route changes
  public subscribe(listener: (route: Route) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current route
  public getCurrentRoute(): Route {
    const path = window.location.pathname;
    const params = this.parseQueryParams();
    return { path, params };
  }

  // Helper to build query parameters
  private buildQueryParams(params?: Record<string, string>): string {
    if (!params || Object.keys(params).length === 0) {
      return '';
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });

    return `?${queryParams.toString()}`;
  }

  // Helper to parse query parameters
  private parseQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }

  // Notify all listeners about route change
  private notifyListeners(route: Route): void {
    this.listeners.forEach(listener => listener(route));
  }
}

// Export singleton instance
export const router = Router.getInstance();

// Define common routes
export const Routes = {
  HOME: '/',
  PATIENT_LIST: '/patients',
  PATIENT_DETAIL: '/patients/:id',
  PATIENT_CREATE: '/patients/create',

  // Helper to generate patient detail route
  patientDetail: (id: string) => ({
    path: `/patients/${id}`,
    params: { id }
  }),
};
