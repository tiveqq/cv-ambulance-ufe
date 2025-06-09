export type Route = {
  path: string;
  params?: Record<string, string>;
};

export let basePath = '/'; // Will be updated when app starts

export function setBasePath(path: string) {
  basePath = path.endsWith('/') ? path : path + '/';
}

export const Routes = {
  HOME: '/',
  PATIENT_LIST: '/patients',
  PATIENT_DETAIL: '/patients/:id',
  PATIENT_CREATE: '/patients/create',

  patientDetail: (id: string) => ({
    path: `/patients/${id}`,
    params: { id }
  }),
};


export function getCurrentRoute(): Route {
  let path = window.location.pathname;

  // Remove basePath from the beginning if it exists
  const baseUri = new URL(basePath, document.baseURI).pathname;
  if (path.startsWith(baseUri)) {
    path = path.slice(baseUri.length) || '/';
  }

  const params = parseQueryParams();
  return { path, params };
}


function parseQueryParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export function navigate(route: Route): void {
  const fullPath = new URL(route.path, new URL(basePath, document.baseURI)).pathname;

  if (window.navigation) {
    window.navigation.navigate(fullPath, { info: route.params });
  } else {
    window.history.pushState({}, '', fullPath);
    // Optionally emit a custom event here if needed
  }
}
