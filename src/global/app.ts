import '@material/web/list/list'
import '@material/web/list/list-item'
import '@material/web/icon/icon'
import '@material/web/button/filled-button'
import '@material/web/button/outlined-button'
import '@material/web/button/text-button'
import '@material/web/checkbox/checkbox'
import '@material/web/dialog/dialog'
import '@material/web/divider/divider'
import '@material/web/fab/fab'
import '@material/web/field/filled-field'
import '@material/web/field/outlined-field'
import '@material/web/icon/icon'
import '@material/web/iconbutton/filled-icon-button'
import '@material/web/iconbutton/filled-tonal-icon-button'
import '@material/web/iconbutton/icon-button'
import '@material/web/iconbutton/outlined-icon-button'
import '@material/web/menu/menu'
import '@material/web/menu/menu-item'
import '@material/web/progress/circular-progress'
import '@material/web/progress/linear-progress'
import '@material/web/radio/radio'
import '@material/web/ripple/ripple'
import '@material/web/select/filled-select'
import '@material/web/select/outlined-select'
import '@material/web/select/select-option'
import '@material/web/slider/slider'
import '@material/web/switch/switch'
import '@material/web/tabs/primary-tab'
import '@material/web/tabs/tabs'
import '@material/web/textfield/filled-text-field'
import '@material/web/textfield/outlined-text-field'
import '../components'

// Import navigation
import { registerNavigationApi } from './navigation';
import { getCurrentRoute, Routes, navigate } from './routes';

export default function() {
  // Initialize navigation API
  registerNavigationApi();

  // Initialize with default route
  const currentRoute = getCurrentRoute();

  // If we're at the root, redirect to patients list
  if (currentRoute.path === '/' || currentRoute.path === '') {
    navigate({ path: Routes.PATIENT_LIST });
  }

  // Log navigation for debugging
  window.navigation.addEventListener('navigate', (event: any) => {
    console.log('Navigation to:', event.destination.url);
  });
}
