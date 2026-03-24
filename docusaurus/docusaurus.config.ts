import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import fs from 'node:fs';
import path from 'node:path';


// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const isDev = process.env.NODE_ENV === 'development';
const includeNext = isDev || process.env.INCLUDE_NEXT === 'true';

type ToolConfig = {
  label?: string;
  description?: string;
  logo?: string;
};

type ToolDocsInstance = {
  id: string;
  label: string;
  sidebarPath: string;
  docsPath: string;
  routeBasePath: string;
  versions: string[];
};

function loadToolsConfig(siteDir: string): Record<string, ToolConfig> {
  const configPath = path.join(siteDir, 'tools.config.json');
  if (!fs.existsSync(configPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch {
    return {};
  }
}

function discoverToolDocsInstances(siteDir: string): ToolDocsInstance[] {
  const toolsConfig = loadToolsConfig(siteDir);
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

      const label = toolsConfig[id]?.label ?? id;

      // Load released versions if a versions file exists
      const versionsFile = path.join(siteDir, `${id}_versions.json`);
      let versions: string[] = [];
      if (fs.existsSync(versionsFile)) {
        try {
          versions = JSON.parse(fs.readFileSync(versionsFile, 'utf-8'));
        } catch {
          // ignore malformed versions file
        }
      }

      // In production: skip tools that have no released versions
      if (versions.length === 0 && !includeNext) {
        return null;
      }

      // Docusaurus requires the docs path directory to exist even when
      // only serving versioned docs. Create it if missing (the "next"
      // folders are gitignored — they only exist during local dev).
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }

      return {
        id,
        label,
        sidebarPath: `./${sidebarFile}`,
        docsPath,
        routeBasePath: id,
        versions,
      } satisfies ToolDocsInstance;
    })
    .filter((instance): instance is ToolDocsInstance => instance !== null)
    .sort((a, b) => a.id.localeCompare(b.id));

  return instances;
}

const discoveredTools = discoverToolDocsInstances(__dirname);
const toolsConfig = loadToolsConfig(__dirname);

const config: Config = {
  title: 'TestBench Ecosystem',
  tagline: 'Extensions and tools for TestBench by imbus AG',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://imbus.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/testbench-ecosystem-documentation/',

  // GitHub pages deployment config.
  organizationName: 'imbus',
  projectName: 'testbench-ecosystem-documentation',

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

  customFields: {
    tools: discoveredTools.map((t) => ({
      id: t.id,
      label: t.label,
      description: toolsConfig[t.id]?.description ?? '',
      logo: toolsConfig[t.id]?.logo ?? '',
      routeBasePath: t.routeBasePath,
    })),
  },

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
    ...discoveredTools.map((instance) => {
      // If released versions exist, exclude "current" (next) from production
      // builds unless INCLUDE_NEXT=true. In dev mode, always include all.
      const hasReleasedVersions = instance.versions.length > 0;
      const onlyIncludeVersions =
        hasReleasedVersions && !includeNext
          ? instance.versions
          : undefined;

      return [
        '@docusaurus/plugin-content-docs',
        {
          id: instance.id,
          path: instance.docsPath,
          routeBasePath: instance.routeBasePath,
          sidebarPath: instance.sidebarPath,
          ...(onlyIncludeVersions && { onlyIncludeVersions }),
        },
      ];
    }),
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
          tools: discoveredTools.map((instance) => ({
            id: instance.id,
            label: instance.label,
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
        'python',
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
