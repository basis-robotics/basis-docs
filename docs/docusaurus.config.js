// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Basis',
  tagline: 'The framework your robot demands.',
  favicon: 'img/basis.png',

  // Set the production url of your site here
  url: 'https://basisrobotics.tech',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Basis Robotics', // Usually your GitHub org/user name.
  projectName: 'Basis', // Usually your repo name.

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
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            //TODO: Change this to the correct URL
            'https://github.com/basis-robotics/basis-examples',
        },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     //TODO: Change this to the correct URL
        //     'https://github.com/basis-robotics/basis-examples',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
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
        title: 'Basis',
        logo: {
          alt: 'Basis Logo',
          src: 'img/basis.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Guide',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          // {
          //   //TODO: Change this to the correct URL
          //   href: 'https://github.com/basis-robotics/basis-examples',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Guide',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                //TODO: Change this to the correct URL
                href: 'https://discordapp.com/invite/basis',
              },
              {
                label: 'Twitter',
                //TODO: Change this to the correct URL
                href: 'https://twitter.com/basis',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Basis website',
                href: 'http://basisrobotics.tech',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/basis-robotics/basis-examples',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Basis Robotics. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
