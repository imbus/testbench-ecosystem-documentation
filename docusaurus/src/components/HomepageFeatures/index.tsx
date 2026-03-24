import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type ToolInfo = {
  id: string;
  label: string;
  description: string;
  logo: string;
  routeBasePath: string;
};

function Feature({label, description, logo, routeBasePath}: ToolInfo) {
  const logoUrl = useBaseUrl(logo);
  return (
    <div className={clsx('col col--4')}>
      <Link className={styles.featureLink} to={`/${routeBasePath}/intro`}>
        {logo && (
          <div className="text--center">
            <img
              className={styles.featureSvg}
              src={logoUrl}
              alt={`${label} logo`}
            />
          </div>
        )}
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{label}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const tools = (siteConfig.customFields?.tools ?? []) as ToolInfo[];

  if (tools.length === 0) {
    return null;
  }

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {tools.map((tool) => (
            <Feature key={tool.id} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
