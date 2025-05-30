import { newSpecPage } from '@stencil/core/testing';
import { Cv1karunnyiAmbulanceUfeTrack } from '../cv1karunnyi-ambulance-ufe-track';

describe('cv1karunnyi-ambulance-ufe-track', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Cv1karunnyiAmbulanceUfeTrack],
      html: `<cv1karunnyi-ambulance-ufe-track></cv1karunnyi-ambulance-ufe-track>`,
    });
    expect(page.root).toEqualHtml(`
      <cv1karunnyi-ambulance-ufe-track>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cv1karunnyi-ambulance-ufe-track>
    `);
  });
});
