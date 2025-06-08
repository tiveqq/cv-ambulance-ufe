import { Component, Host, h, State, Listen, Prop } from '@stencil/core';
import {Route, Routes } from '../../utils/router';

@Component({
  tag: 'cv1karunnyi-ambulance-ufe-router',
  styleUrl: 'cv1karunnyi-ambulance-ufe-router.css',
  shadow: true,
})
export class Cv1karunnyiAmbulanceUfeRouter {
  @State() currentRoute: Route;

  @Prop() apiBase: string = 'http://localhost:5000/api';
  @Prop() basePath: string = '/'; // NEW: basePath prop

  private unsubscribe: () => void;

  componentWillLoad() {
    const fullPath = window.location.pathname;
    const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;

    const relativePath = fullPath.startsWith(baseUri)
      ? fullPath.slice(baseUri.length)
      : '/';

    // Initialize current route using relative path
    this.currentRoute = { path: '/' + relativePath.replace(/^\/+/, '') };

    // OPTIONAL: subscribe to custom router updates (e.g., if you implement custom pub-sub)
    // this.unsubscribe = router.subscribe(route => {
    //   this.currentRoute = route;
    // });
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Listen for navigation events from child components
  @Listen('navigate')
  handleNavigate(event: CustomEvent<Route>) {
    const newRelativePath = event.detail.path;
    const baseUri = new URL(this.basePath, document.baseURI).pathname;
    const absolutePath = new URL(newRelativePath, baseUri).pathname;

    console.log('Navigating to absolute path:', absolutePath);

    window.history.pushState({}, '', absolutePath);
    this.currentRoute = { path: newRelativePath };
  }

  renderRouteContent() {
    const path = this.currentRoute.path;
    console.log('Current route path:', path);

    if (path === Routes.PATIENT_LIST) {
      return <cv1karunnyi-ambulance-ufe-track view="list" api-base={this.apiBase} />;
    }

    if (path === Routes.PATIENT_CREATE) {
      return <cv1karunnyi-ambulance-ufe-track view="create" api-base={this.apiBase} />;
    }

    if (path.match(/^\/patients\/[^/]+$/)) {
      const patientId = path.split('/').pop();
      return <cv1karunnyi-ambulance-ufe-track view="detail" patient-id={patientId} api-base={this.apiBase} />;
    }

    return <cv1karunnyi-ambulance-ufe-track view="list" api-base={this.apiBase} />;
  }

  // NEW: navigate helper that respects basePath
  private navigateWithBase(relativePath: string) {
    const baseUri = new URL(this.basePath, document.baseURI).pathname;
    const absolutePath = new URL(relativePath, baseUri).pathname;

    console.log('navigateWithBase:', absolutePath);

    window.history.pushState({}, '', absolutePath);
    this.currentRoute = { path: relativePath };
  }

  render() {
    return (
      <Host>
        <div class="router-container">
          <header>
            <nav>
              <ul>
                <li>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    this.navigateWithBase(Routes.PATIENT_LIST);
                  }}>
                    Patients
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    this.navigateWithBase(Routes.PATIENT_CREATE);
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
