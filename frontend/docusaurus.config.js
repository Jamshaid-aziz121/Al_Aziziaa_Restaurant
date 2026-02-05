// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Aziz Restaurant',
  tagline: 'Experience the finest dining experience',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://aziz-restaurant.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'aziz-restaurant', // Usually your GitHub org/user name.
  projectName: 'aziz-restaurant', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        pages: {
          path: 'src/pages',
        },
        theme: {
          customCss: './src/styles/globals.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Aziz Restaurant',
        logo: {
          alt: 'Aziz Restaurant Logo',
          src: 'img/logo.svg',
        },
        items: [
          {to: '/menu', label: 'Menu', position: 'left'},
          {to: '/reservation', label: 'Reservation', position: 'left'},
          {to: '/order', label: 'Order', position: 'left'},
          {to: '/track-order', label: 'Track Order', position: 'left'},
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Features',
            items: [
              {
                label: 'Menu',
                to: '/menu',
              },
              {
                label: 'Reservation',
                to: '/reservation',
              },
              {
                label: 'Online Ordering',
                to: '/order',
              },
              {
                label: 'Order Tracking',
                to: '/track-order',
              },
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'About Us',
                to: '/about',
              },
              {
                label: 'Contact',
                to: '/contact',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/aziz-restaurant',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Aziz Restaurant. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;