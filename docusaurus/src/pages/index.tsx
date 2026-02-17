import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import heroBackgroundUrl from '@site/static/img/WuerfelHeader_NEU_schwarz_WEB-scaled.png';

import styles from './index.module.css';
import React from 'react';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const heroStyle: CSSProperties = {
    color: '#ffffff',
    backgroundImage: `url(${heroBackgroundUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)} style={heroStyle}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Test<span style={{color: 'var(--testbench-orange)'}}>Bench</span> Ecosystem
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/Ecosystem">
            Ecosystem overview
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Documentation`}
      description="Documentation of TestBench by imbus AG">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
