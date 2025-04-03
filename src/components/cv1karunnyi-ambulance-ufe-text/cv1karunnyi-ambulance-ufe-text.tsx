import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'cv1karunnyi-ambulance-ufe-text',
  styleUrl: 'cv1karunnyi-ambulance-ufe-text.css',
  shadow: true,
})
export class Cv1karunnyiAmbulanceUfeText {
  render() {
    console.log('Rendering cv1karunnyi-ambulance-ufe-text');

    return (
      <Host>
        <slot>Hello, world!</slot>
      </Host>
    );
  }
}
