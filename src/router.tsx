import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';
import SidebarLayout from 'src/layouts/SidebarLayout';
import jwt_decode from "jwt-decode";
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';
import { Auth } from './types/User';
import { JwtToken } from './types/Login';
import { setIsLogged } from './feautures/authSlice'

let authorities = [];
console.log('router');

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );


const RequireAuth = ({ children, redirectTo }) => {
  const auth : Auth = useSelector((state : RootState) => state.auth)
  let expiresIn = 0
  if (auth.isLogged) {
    const decoded_token : JwtToken = jwt_decode(auth.accessToken)
    expiresIn = decoded_token.exp - decoded_token.iat
    
  }
  return auth.isLogged && expiresIn > 0 ? children : <Navigate to={redirectTo} />;
}

const NoAuthRequired = ({ children, redirectTo }) => {
  const auth : Auth = useSelector((state : RootState) => state.auth)
  let expiresIn = 0
  if (auth.isLogged) {
    const decoded_token : JwtToken = jwt_decode(auth.accessToken)
    expiresIn = decoded_token.exp - decoded_token.iat
  }
  return auth.isLogged && expiresIn > 0 ? <Navigate to={redirectTo} /> : children;
}

const Crypto = Loader(lazy(() => import('src/content/dashboards/Crypto')));

// Applications 

const Messenger = Loader(
  lazy(() => import('src/content/applications/Messenger'))
);
const Transactions = Loader(
  lazy(() => import('src/content/applications/Transactions'))
);
const Census = Loader(lazy(() => import('src/content/pages/Census')));
const AddCensus = Loader(lazy(() => import('src/content/pages/Census/AddCensus')));
const Roles = Loader(lazy(() => import('src/content/pages/Roles')));
const AddRoles = Loader(lazy(() => import('src/content/pages/Roles/AddRole')));
const Users = Loader(lazy(() => import('src/content/pages/Users')));
const AddUsers = Loader(lazy(() => import('src/content/pages/Users/AddUser')));
const SignIn = Loader(lazy(() => import('src/content/pages/Users/SignIn')));


// Components

const Buttons = Loader(
  lazy(() => import('src/content/pages/Components/Buttons'))
);
const Modals = Loader(
  lazy(() => import('src/content/pages/Components/Modals'))
);
const Accordions = Loader(
  lazy(() => import('src/content/pages/Components/Accordions'))
);
const Tabs = Loader(lazy(() => import('src/content/pages/Components/Tabs')));
const Badges = Loader(
  lazy(() => import('src/content/pages/Components/Badges'))
);
const Tooltips = Loader(
  lazy(() => import('src/content/pages/Components/Tooltips'))
);
const Avatars = Loader(
  lazy(() => import('src/content/pages/Components/Avatars'))
);
const Cards = Loader(lazy(() => import('src/content/pages/Components/Cards')));
const Forms = Loader(lazy(() => import('src/content/pages/Components/Forms')));

// Status

// const Status404 = Loader(
//   lazy(() => import('src/content/pages/Status/Status404'))
// );
// const Status500 = Loader(
//   lazy(() => import('src/content/pages/Status/Status500'))
// );
// const StatusComingSoon = Loader(
//   lazy(() => import('src/content/pages/Status/ComingSoon'))
// );
// const StatusMaintenance = Loader(
//   lazy(() => import('src/content/pages/Status/Maintenance'))
// );



const routes: RouteObject[] = [
  {
    path: '/login',
    element: <NoAuthRequired redirectTo={'/'}><SignIn /></NoAuthRequired>,
    caseSensitive: true
  },
  {
    path: '/',
    element: <SidebarLayout />,
    caseSensitive: false,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
        caseSensitive: false
      },
      {
        path: 'dashboard',
        element: <Crypto />,
        caseSensitive: false
      },
      {
        path: 'messenger',
        element: <Messenger />,
        caseSensitive: false
      }
    ]
  },
  {
    path: '/management',
    element: <SidebarLayout />,
    caseSensitive: false,
    children: [
      {
        path: '',
        caseSensitive: false,
        element: <Navigate to="/management/transactions" replace />
      },
      {
        path: 'transactions',
        caseSensitive: false,
        element: <Transactions />
      },
     
    ]
  },
  {
    path: '/roles',
    caseSensitive: false,
    element: <SidebarLayout />,
    children: [
      { 
        path: '', 
        caseSensitive: false, 
        element: <RequireAuth redirectTo={'/login'}><Roles /></RequireAuth>  
      },
      { 
        path: 'add', 
        caseSensitive: false, 
        element: <RequireAuth redirectTo={'/login'}><AddRoles /></RequireAuth> 
      },
      { 
        path: 'edit/:id', 
        caseSensitive: false, 
        element: <RequireAuth redirectTo={'/login'}><AddRoles /></RequireAuth> 
      },
    ]
  },
  {
    path: '/census',
    caseSensitive: false,
    element: <SidebarLayout />,
    children: [
      { 
        path: '', 
        caseSensitive: false, 
        element: <RequireAuth redirectTo={'/login'}><Census /></RequireAuth>  
      },
      { 
        path: 'add', 
        caseSensitive: false, 
        element: <RequireAuth redirectTo={'/login'}><AddCensus /></RequireAuth> 
      },
      { 
        path: 'edit/:id', 
        caseSensitive: false, 
        element: <RequireAuth redirectTo={'/login'}><AddCensus /></RequireAuth> 
      },
    ]
  },
  {
    path: '/users',
    caseSensitive: false,
    element: <SidebarLayout />,
    children: [
      { 
        path: '', 
        caseSensitive: false, 
        element: <RequireAuth redirectTo={'/login'}><Users /></RequireAuth>  
      },
      { 
        path: 'add', 
        caseSensitive: false, 
        element: <RequireAuth redirectTo={'/login'}><AddUsers /></RequireAuth> 
      },
      { 
        path: 'edit/:id', 
        caseSensitive: false, 
        element: <RequireAuth redirectTo={'/login'}><AddUsers /></RequireAuth> 
      },
    ]
  },
  {
    path: '/components',
    caseSensitive: false,
    element: <SidebarLayout />,
    children: [
      {
        caseSensitive: false,
        path: '',
        element: <Navigate to="/components/buttons" replace />
      },
      {
        caseSensitive: false,
        path: 'buttons',
        element: <Buttons />
      },
      {
        caseSensitive: false,
        path: 'modals',
        element: <Modals />
      },
      {
        caseSensitive: false,
        path: 'accordions',
        element: <Accordions />
      },
      {
        caseSensitive: false,
        path: 'tabs',
        element: <Tabs />
      },
      {
        caseSensitive: false,
        path: 'badges',
        element: <Badges />
      },
      {
        caseSensitive: false,
        path: 'tooltips',
        element: <Tooltips />
      },
      {
        caseSensitive: false,
        path: 'avatars',
        element: <Avatars />
      },
      {
        caseSensitive: false,
        path: 'cards',
        element: <Cards />
      },
      {
        caseSensitive: false,
        path: 'forms',
        element: <Forms />
      }
    ]
  }
];

export default routes;
