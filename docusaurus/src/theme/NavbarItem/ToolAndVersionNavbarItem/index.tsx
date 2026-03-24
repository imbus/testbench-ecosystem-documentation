import React, {type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

type ToolDocsInstance = {
  id: string;
  label?: string;
  routeBasePath: string;
};

type Props = {
  mobile?: boolean;
  position?: 'left' | 'right';
  className?: string;
  tools?: ToolDocsInstance[];
};

function getActiveToolId(
  pathname: string,
  baseUrl: string,
  tools: ToolDocsInstance[],
): string | null {
  // Strip the baseUrl prefix so we work with the route-relative path
  const relativePath = pathname.startsWith(baseUrl)
    ? '/' + pathname.slice(baseUrl.length)
    : pathname;

  if (relativePath === '/' || relativePath === '') {
    return null;
  }

  if (relativePath === '/docs' || relativePath.startsWith('/docs/')) {
    return 'default';
  }

  const firstSegment = relativePath.split('/')[1];
  if (!firstSegment) {
    return null;
  }

  const match = tools.find(
    (t) => t.routeBasePath === firstSegment || t.id === firstSegment,
  );

  return match?.id ?? null;
}

export default function ToolAndVersionNavbarItem({
  mobile = false,
  position = 'left',
  className,
  tools = [],
}: Props): ReactNode {
  const {pathname} = useLocation();
  const {siteConfig: {baseUrl}} = useDocusaurusContext();
  const activeToolId = getActiveToolId(pathname, baseUrl, tools);

  const activeTool = tools.find((t) => t.id === activeToolId);
  const activeToolLabel =
    activeToolId === null || activeToolId === 'default'
      ? 'Docs'
      : (activeTool?.label ?? activeToolId);

  const toolItems = [
    {
      type: 'doc' as const,
      docId: 'Ecosystem',
      label: 'Docs',
    },
    ...tools.map((tool) => ({
      type: 'doc' as const,
      docsPluginId: tool.id,
      docId: 'intro',
      label: tool.label ?? tool.id,
    })),
  ];

  const docsPluginIdForVersionDropdown =
    activeToolId === null || activeToolId === 'default'
      ? undefined
      : activeToolId;

  return (
    <>
      <DropdownNavbarItem
        mobile={mobile}
        position={position}
        className={className}
        label={activeToolLabel}
        items={toolItems as any}
      />
      {activeToolId !== null ? (
        <DocsVersionDropdownNavbarItem
          mobile={mobile}
          position={position}
          docsPluginId={docsPluginIdForVersionDropdown as any}
          dropdownActiveClassDisabled={false}
          dropdownItemsBefore={[]}
          dropdownItemsAfter={[]}
          items={[]}
        />
      ) : null}
    </>
  );
}
