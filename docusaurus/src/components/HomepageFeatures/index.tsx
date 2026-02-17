import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import React from 'react';
import type {ServerLocations} from '../../types/serverLocations';

type LinkContext = {
  origin: string;
  protocol: string;
  hostname: string;
  serverLocations: ServerLocations | null;
};

type FeatureDefinition = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  resolveHref: (context: LinkContext) => string;
};

const FeatureList: FeatureDefinition[] = [
  {
    title: 'Web iTORX',
    Svg: require('@site/static/img/iTORX_logo.svg').default,
    description: (
      <>
        <b>New</b> modern web base test execution assistant for TestBench. Execute your
        test cases directly from your browser.
      </>
    ),
    resolveHref: ({origin}) => `${origin}/executions/itorx`,
  },
  {
    title: 'REST API Docu (v1)',
    Svg: require('@site/static/img/testbench-api-legacy.svg').default,
    description: (
      <>
        TestBench Rest API documentation for version 1.x. Find all information
        about endpoints, request and response formats.
      </>
    ),
    resolveHref: ({serverLocations}) => {
      if (!serverLocations) return '#';

      const {legacyPlayHost, legacyPlayPort} = serverLocations;
      return `https://${legacyPlayHost}:${legacyPlayPort}/doc/api`;
    },
  },
  {
    title: 'REST API Docu (v2)',
    Svg: require('@site/static/img/testbench-api-new.svg').default,
    description: (
      <>
        <b>New</b> TestBench Rest API documentation for version 2.x. Find all information
        about endpoints, request and response formats.
      </>
    ),
    resolveHref: ({origin}) => `${origin}/doc/api`,
  },
];

type FeatureProps = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  href: string;
};

function Feature({title, Svg, description, href}: FeatureProps) {
  return (
    <div className={clsx('col col--4')}>
      <a
        className={styles.featureLink}
        href={href}
        target="_blank"
        rel="noopener noreferrer">
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </a>
    </div>
  );
}

function useLinkContext(): LinkContext | null {
  const [context, setContext] = useState<LinkContext | null>(null);

  // Resolve link targets on the client to respect the deployed origin.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const {origin, protocol, hostname} = window.location;
    let isCancelled = false;

    const applyBaseContext = (locations: ServerLocations | null): void => {
      if (!isCancelled) {
        setContext({origin, protocol, hostname, serverLocations: locations});
      }
    };

    (async () => {
      try {
        const response = await fetch(`${origin}/api/2/serverLocations`);
        if (!response.ok) {
          throw new Error(`Fetching server locations failed: ${response.status}`);
        }
        const locations = (await response.json()) as ServerLocations;
        applyBaseContext(locations);
      } catch (err) {
        console.warn('[HomepageFeatures] Failed to fetch server locations.', err);
        applyBaseContext(null);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  return context;
}

export default function HomepageFeatures(): ReactNode {
  const linkContext = useLinkContext();
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map(({title, Svg, description, resolveHref}) => (
            <Feature
              key={title}
              title={title}
              Svg={Svg}
              description={description}
              href={linkContext ? resolveHref(linkContext) : '#'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}