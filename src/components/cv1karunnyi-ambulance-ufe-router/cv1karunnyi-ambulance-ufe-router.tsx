import { Component, Host, h, State, Listen, Prop } from '@stencil/core';
import {Route, Routes } from '../../utils/router';


declare global {
  interface Window { navigation: any; }
}

@Component({
  tag: 'cv1karunnyi-ambulance-ufe-router',
  styleUrl: 'cv1karunnyi-ambulance-ufe-router.css',
  shadow: true,
})
export class Cv1karunnyiAmbulanceUfeRouter {
  //
  @State() currentRoute: Route;

  @Prop() apiBase: string = 'http://localhost:5001/api';
  @Prop() basePath: string = '/'; // NEW: basePath prop

  private unsubscribe: () => void;

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
      } else {
      }
    }

    window.navigation?.addEventListener("navigate", (ev: Event) => {
      if ((ev as any).canIntercept) { (ev as any).intercept(); }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname)
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
      console.log("Rendering Route Content " + this.apiBase)
      return <cv1karunnyi-ambulance-ufe-track view="create" api-base={this.apiBase} />;
    }

    if (path.match(/^\/patients\/[^/]+$/)) {
      const patientId = path.split('/').pop();
      return <cv1karunnyi-ambulance-ufe-track view="detail" patient-id={patientId} api-base={this.apiBase} />;
    }

    return <cv1karunnyi-ambulance-ufe-track view="list" api-base={this.apiBase} />;
  }


  render() {

    const navigate = (path:string) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute)
    }
    return (
      <Host>
        <div class="router-container">
          <header>
            <nav>
              <ul>
                <li>
                  <a api-base={this.apiBase} onClick={(e) => {
                    e.preventDefault();
                    navigate(Routes.PATIENT_LIST);
                  }}>
                    Patients
                  </a>
                </li>
                <li>
                  <a api-base={this.apiBase} onClick={(e) => {
                    e.preventDefault();
                    navigate(Routes.PATIENT_CREATE);
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
