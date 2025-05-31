import { newSpecPage } from '@stencil/core/testing';
import { Cv1karunnyiAmbulanceUfeRouter } from '../cv1karunnyi-ambulance-ufe-router';

describe('cv1karunnyi-ambulance-ufe-router', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Cv1karunnyiAmbulanceUfeRouter],
      html: `<cv1karunnyi-ambulance-ufe-router></cv1karunnyi-ambulance-ufe-router>`,
    });
    expect(page.root).toEqualHtml(`
      <cv1karunnyi-ambulance-ufe-router>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cv1karunnyi-ambulance-ufe-router>
    `);
  });
});
