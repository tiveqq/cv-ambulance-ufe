import { newE2EPage } from '@stencil/core/testing';

describe('cv1karunnyi-ambulance-ufe-text', () => {
  xit('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<cv1karunnyi-ambulance-ufe-text></cv1karunnyi-ambulance-ufe-text>');

    const element = await page.find('cv1karunnyi-ambulance-ufe-text');
    expect(element).toHaveClass('hydrated');
  });
});
