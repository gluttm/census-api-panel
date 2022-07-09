import { ReactNode, useEffect } from 'react';

import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { store } from 'src/app/store';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
  show?: boolean
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
  authority?: string
}
console.log('Items');

const authorities: string[] = store.getState().auth.authorities
console.log(authorities);

console.log(authorities.includes('read:user'));


const menuItems: MenuItems[] = [
  {
    heading: 'Dashboards',
    authority: 'read:user',
    items: [
      {
        name: 'Dashboards',
        link: '/dashboards',
        icon: DashboardIcon
      }
    ]
  },
  {
    heading: 'Gestor',
    authority: 'read:user',
    items: [
      {
        name: 'Censo',
        icon: PeopleIcon,
        link: '/management',
        items: [
          {
            name: 'Censo',
            link: '/census'
          },
          {
            name: 'Pre-sets',
            link: '/roles'
          }
        ]
      },
      {
        name: 'Destritos',
        icon: GpsFixedIcon,
        link: '/disticts',
        items: [
          {
            name: 'Destritos',
            link: '/districts'
          },
          {
            name: 'Histórico',
            link: '/logs'
          }
        ]
      },
    ]
  },
  {
    heading: 'Administrador',
    authority: 'read:user',
    items: [
      {
        name: 'Utilizadores',
        icon: AdminPanelSettingsIcon,
        link: '/management',
        items: [
          {
            name: 'Utilizadores',
            link: '/users'
          },
          {
            name: 'Níveis de acesso',
            link: '/roles'
          }
        ]
      },
      {
        name: 'Configurações',
        icon: BrightnessLowTwoToneIcon,
        link: '/settings',
        items: [
          {
            name: 'Sistema',
            link: '/system'
          },
          {
            name: 'Histórico',
            link: '/logs'
          }
        ]
      },
    ]
  },
];

export default menuItems;
