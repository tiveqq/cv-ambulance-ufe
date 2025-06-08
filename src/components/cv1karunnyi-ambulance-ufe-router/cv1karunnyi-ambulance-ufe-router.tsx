import { Component, Host, h, State, Listen, Prop } from '@stencil/core';
import { Route, Routes, getCurrentRoute, navigate } from '../../global/routes';

declare global {
  interface Window { navigation: any; }
}

@Component({
  tag: 'cv1karunnyi-ambulance-ufe-router',
  styleUrl: 'cv1karunnyi-ambulance-ufe-router.css',
  shadow: true,
})
export class Cv1karunnyiAmbulanceUfeRouter {
  @State() currentRoute: Route;
  @Prop() apiBase: string = 'http://localhost:5000/api';
  private navigationListener: any;

  componentWillLoad() {
    // Get initial route
    this.currentRoute = getCurrentRoute();

    // Subscribe to route changes using Navigation API
    this.navigationListener = (event: any) => {
      // Update current route when navigation occurs
      this.currentRoute = getCurrentRoute();
    };

    window.navigation.addEventListener('navigate', this.navigationListener);
  }

  disconnectedCallback() {
    // Clean up event listener when component is destroyed
    if (this.navigationListener) {
      window.navigation.removeEventListener('navigate', this.navigationListener);
    }
  }

  // Listen for navigation events from child components
  @Listen('navigate')
  handleNavigate(event: CustomEvent<Route>) {
    console.log('Navigation event received:', event.detail);
    navigate(event.detail);
  }

  // Render the appropriate component based on the current route
  renderRouteContent() {
    const path = this.currentRoute.path;
    console.log('Current route path:', path);

    // Match routes
    if (path === Routes.PATIENT_LIST) {
      console.log('Rendering patient list view');
      return <cv1karunnyi-ambulance-ufe-track view="list" api-base={this.apiBase} />;
    }

    // Check if it's the create patient route - check this before patient detail route
    if (path === Routes.PATIENT_CREATE) {
      console.log('Rendering create patient view');
      return <cv1karunnyi-ambulance-ufe-track view="create" api-base={this.apiBase} />;
    }

    // Check if it's a patient detail route
    if (path.match(/^\/patients\/[^/]+$/)) {
      const patientId = path.split('/').pop();
      console.log('Rendering patient detail view for patient:', patientId);
      return <cv1karunnyi-ambulance-ufe-track view="detail" patient-id={patientId} api-base={this.apiBase} />;
    }

    // Default to patient list
    return <cv1karunnyi-ambulance-ufe-track view="list" api-base={this.apiBase} />;
  }

  render() {
    return (
      <Host>
        <div class="router-container">
          <header>
            {/*<h1>Patient Treatment Tracking System</h1>*/}
            <nav>
              <ul>
                <li>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    navigate({ path: Routes.PATIENT_LIST });
                  }}>
                    Patients
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    navigate({ path: Routes.PATIENT_CREATE });
                  }}>
                    New Patient
                  </a>
                </li>
              </ul>
            </nav>
          </header>

          <main>
            {this.renderRouteContent()}
          </main>
        </div>
      </Host>
    );
  }
}
