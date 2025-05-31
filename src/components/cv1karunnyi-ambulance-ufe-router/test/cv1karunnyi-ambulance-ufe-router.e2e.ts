import { newE2EPage } from '@stencil/core/testing';

describe('cv1karunnyi-ambulance-ufe-router', () => {
  xit('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<cv1karunnyi-ambulance-ufe-router></cv1karunnyi-ambulance-ufe-router>');

    const element = await page.find('cv1karunnyi-ambulance-ufe-router');
    expect(element).toHaveClass('hydrated');
  });
});
