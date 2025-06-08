// Define common routes and navigation helpers
export type Route = {
  path: string;
  params?: Record<string, string>;
};

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

// Helper function to get current route
export function getCurrentRoute(): Route {
  let path = window.location.pathname;

  // Strip base path if it exists
  const pathSegments = window.location.pathname.split('/');
  if (pathSegments.length >= 3 && pathSegments[1] === 'fea') {
    const basePath = `/${pathSegments[1]}/${pathSegments[2]}`;
    if (path.startsWith(basePath)) {
      path = path.substring(basePath.length) || '/';
    }
  }

  const params = parseQueryParams();
  return { path, params };
}

// Helper to parse query parameters
function parseQueryParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

// Helper function to navigate using Navigation API
export function navigate(route: Route): void {
  if (window.navigation) {
    const url = route.path;
    window.navigation.navigate(url, { info: route.params });
  } else {
    window.location.href = route.path;
  }
}
