import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/about',
    component: ComponentCreator('/about', 'c49'),
    exact: true
  },
  {
    path: '/contact',
    component: ComponentCreator('/contact', 'abe'),
    exact: true
  },
  {
    path: '/menu',
    component: ComponentCreator('/menu', 'a23'),
    exact: true
  },
  {
    path: '/order',
    component: ComponentCreator('/order', 'd6f'),
    exact: true
  },
  {
    path: '/reservation',
    component: ComponentCreator('/reservation', 'f69'),
    exact: true
  },
  {
    path: '/track-order',
    component: ComponentCreator('/track-order', 'd15'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
