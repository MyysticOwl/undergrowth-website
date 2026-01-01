import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Undergrowth',
  tagline: 'Automate Everything. Deploy Anywhere.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true,
  },

  // Set the production url of your site here
  url: 'https://undergrowth.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'MyysticOwl', // Usually your GitHub org/user name.
  projectName: 'undergrowth-website', // Usually your repo name.
  trailingSlash: false,

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
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Undergrowth',
      logo: {
        alt: 'Undergrowth Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'foundationSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'pluginsSidebar',
          position: 'left',
          label: 'Plugins',
        },
        {
          to: '/pricing',
          label: 'Pricing',
          position: 'left',
        },
        {
          to: '/download',
          label: 'Download',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Plugin Reference',
              to: '/docs/plugins/reference',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/MyysticOwl/undergrowth-website/discussions',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/undergrowth',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Download',
              to: '/download',
            },
            {
              label: 'Pricing',
              to: '/pricing',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/MyysticOwl/undergrowth-website',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Undergrowth.io. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
