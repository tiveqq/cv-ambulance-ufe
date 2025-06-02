import { newSpecPage } from '@stencil/core/testing';
import { Cv1karunnyiAmbulanceUfeText } from '../cv1karunnyi-ambulance-ufe-text';

xdescribe('cv1karunnyi-ambulance-ufe-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Cv1karunnyiAmbulanceUfeText],
      html: `<cv1karunnyi-ambulance-ufe-text></cv1karunnyi-ambulance-ufe-text>`,
    });
    expect(page.root).toEqualHtml(`
      <cv1karunnyi-ambulance-ufe-text>
        <mock:shadow-root>
          <slot>Hello, world!</slot>
        </mock:shadow-root>
      </cv1karunnyi-ambulance-ufe-text>
    `);
  });
});
