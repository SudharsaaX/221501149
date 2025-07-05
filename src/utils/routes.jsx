import Home from '../pages/Home';
import Stats from '../pages/Stats';
import RedirectHandler from '../components/RedirectHandler';

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/stats',
    element: <Stats />,
  },
  {
    path: '/:shortcode',
    element: <RedirectHandler />,
  },
];