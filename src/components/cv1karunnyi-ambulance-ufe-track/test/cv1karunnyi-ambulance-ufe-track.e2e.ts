import { newE2EPage } from '@stencil/core/testing';

describe('cv1karunnyi-ambulance-ufe-track', () => {
  xit('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<cv1karunnyi-ambulance-ufe-track></cv1karunnyi-ambulance-ufe-track>');

    const element = await page.find('cv1karunnyi-ambulance-ufe-track');
    expect(element).toHaveClass('hydrated');
  });
});
