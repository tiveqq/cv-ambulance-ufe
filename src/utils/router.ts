// // Router service for SPA navigation using the Navigation API
//
// // Define route types
// import { basePath } from '../global/routes';
//
// export type Route = {
//   path: string;
//   params?: Record<string, string>;
// };
//
// // Navigation state interface
// export interface NavigationState {
//   route: Route;
// }
//
// // Router class to handle navigation
// export class Router {
//   private static instance: Router;
//   private listeners: ((route: Route) => void)[] = [];
//   private basePath: string = '';
//
//   private constructor() {
//     // Determine base path from current location
//     const pathSegments = window.location.pathname.split('/');
//     if (pathSegments.length >= 3 && pathSegments[1] === 'fea') {
//       // If we're in the /fea/[app-name] path structure
//       this.basePath = `/${pathSegments[1]}/${pathSegments[2]}`;
//       console.log('Router initialized with base path:', this.basePath);
//     }
//
//     // Listen for navigation events
//     window.addEventListener('popstate', (event) => {
//       const state = event.state as NavigationState;
//       if (state && state.route) {
//         this.notifyListeners(state.route);
//       }
//     });
//   }
//
//   // Singleton pattern
//   public static getInstance(): Router {
//     if (!Router.instance) {
//       Router.instance = new Router();
//     }
//     return Router.instance;
//   }
//
//   // Navigate to a new route
//   public navigate(route: Route): void {
//     // Skip URL changes but keep state
//     console.log('Navigating to route (without URL change):', route.path);
//
//     // Notify listeners about the route change
//     this.notifyListeners(route);
//   }
//
//   // Replace current route without adding to history
//   public replace(route: Route): void {
//     // Skip URL changes but keep state
//     console.log('Replacing route (without URL change):', route.path);
//
//     // Notify listeners about the route change
//     this.notifyListeners(route);
//   }
//
//   // Helper to get full path with base path
//   // private getFullPath(path: string): string {
//   //   // If path is already absolute with our base path, return it as is
//   //   if (this.basePath && path.startsWith(this.basePath)) {
//   //     return path;
//   //   }
//   //
//   //   // Otherwise, prepend the base path
//   //   return `${this.basePath}${path}`;
//   // }
//   //
//   // // Subscribe to route changes
//   // public subscribe(listener: (route: Route) => void): () => void {
//   //   this.listeners.push(listener);
//   //
//   //   // Return unsubscribe function
//   //   return () => {
//   //     this.listeners = this.listeners.filter(l => l !== listener);
//   //   };
//   // }
//
//   // Get current route
//   public getCurrentRoute(): Route {
//     let path = window.location.pathname;
//
//     // Strip base path from the current path if it exists
//     if (this.basePath && path.startsWith(this.basePath)) {
//       path = path.substring(this.basePath.length) || '/';
//     }
//
//     const params = this.parseQueryParams();
//     console.log('Current route path (after stripping base path):', path);
//     return { path, params };
//   }
//
//   // Helper to build query parameters
//   // private buildQueryParams(params?: Record<string, string>): string {
//   //   if (!params || Object.keys(params).length === 0) {
//   //     return '';
//   //   }
//   //
//   //   const queryParams = new URLSearchParams();
//   //   Object.entries(params).forEach(([key, value]) => {
//   //     queryParams.append(key, value);
//   //   });
//   //
//   //   return `?${queryParams.toString()}`;
//   // }
//
//   // Helper to parse query parameters
//   private parseQueryParams(): Record<string, string> {
//     const params: Record<string, string> = {};
//     const searchParams = new URLSearchParams(window.location.search);
//
//     searchParams.forEach((value, key) => {
//       params[key] = value;
//     });
//
//     return params;
//   }
//
//   // Notify all listeners about route change
//   private notifyListeners(route: Route): void {
//     this.listeners.forEach(listener => listener(route));
//   }
// }
//
// // Export singleton instance
// export const router = Router.getInstance();
//
// // Define common routes
// export const Routes = {
//   HOME: `${basePath}/`,
//   PATIENT_LIST: `${basePath}patients`,
//   PATIENT_DETAIL: `${basePath}patients/:id`,
//   PATIENT_CREATE: `${basePath}patients/create`,
//
//   // Helper to generate patient detail route
//   patientDetail: (id: string) => ({
//     path: `/patients/${id}`,
//     params: { id }
//   }),
// };
//
