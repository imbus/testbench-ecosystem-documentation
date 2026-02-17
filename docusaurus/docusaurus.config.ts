import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import fs from 'node:fs';
import path from 'node:path';


// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

type ToolDocsInstance = {
  id: string;
  sidebarPath: string;
  docsPath: string;
  routeBasePath: string;
};

function discoverToolDocsInstances(siteDir: string): ToolDocsInstance[] {
  const entries = fs.readdirSync(siteDir, { withFileTypes: true });

  const toolSidebars = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.startsWith('sidebars_'))
    .filter((name) => name.endsWith('.ts') || name.endsWith('.js'))
    .filter((name) => name !== 'sidebars.ts');

  const instances = toolSidebars
    .map((sidebarFile) => {
      const id = sidebarFile
        .replace(/^sidebars_/, '')
        .replace(/\.(ts|js)$/, '');

      const docsPath = id;
      const docsDir = path.resolve(siteDir, docsPath);

      if (!fs.existsSync(docsDir) || !fs.statSync(docsDir).isDirectory()) {
        return null;
      }

      return {
        id,
        sidebarPath: `./${sidebarFile}`,
        docsPath,
        routeBasePath: id,
      } satisfies ToolDocsInstance;
    })
    .filter((instance): instance is ToolDocsInstance => instance !== null)
    .sort((a, b) => a.id.localeCompare(b.id));

  return instances;
}

const config: Config = {
  title: 'TestBench Ecosystem',
  tagline: 'Extensions and tools for TestBench by imbus AG',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://testbench.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'imbus', // Usually your GitHub org/user name.
  projectName: 'testbench', // Usually your repo name.

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'throw',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en'
    ],
  },

  // customFields: {
  //   TESTBENCH_API_BASE: devHost,
  //   IS_DEV: isDev,
  // },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    ...discoverToolDocsInstances(__dirname).map((instance) => [
      '@docusaurus/plugin-content-docs',
      {
        id: instance.id,
        path: instance.docsPath,
        routeBasePath: instance.routeBasePath,
        sidebarPath: instance.sidebarPath,
      },
    ]),
    require.resolve('docusaurus-lunr-search'),
    [
      'pwa',
      {
        // debug: isDeployPreview,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        // swRegister: false,
        swCustom: require.resolve('./src/sw.js'), // TODO make it possible to use relative path
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: 'img/docusaurus.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: 'manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(37, 194, 160)',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#000',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: 'img/docusaurus.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: 'img/docusaurus.png',
            color: 'rgb(62, 204, 94)',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: 'img/docusaurus.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#000',
          },
        ],
      },
    ]
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'TestBench colored logo',
        src: 'img/TestBench_Logo_farbig.svg',
        srcDark: 'img/TestBench_Logo_farbig.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'Ecosystem',
          label: 'Ecosystem',
          position: 'left',
        },
        {
          type: 'custom-toolAndVersion',
          position: 'left',
          tools: discoverToolDocsInstances(__dirname).map((instance) => ({
            id: instance.id,
            routeBasePath: instance.routeBasePath,
          })),
        },
        {
          href: 'https://www.testbench.com/',
          label: 'TestBench',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Ecosystem',
              to: '/docs/Ecosystem',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Forum',
              href: 'https://www.imbus.de/imbus-testbench/forum/',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'TestBench',
              href: 'https://www.testbench.com/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} imbus AG`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'powershell',
        'csharp',
         'java',
         'bash',
         'json',
         'yaml',
         'properties',
         'toml',
         'ini'
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
