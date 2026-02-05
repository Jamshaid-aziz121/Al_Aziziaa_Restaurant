import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Easy Reservations',
    description: (
      <>
        Book your table in seconds with our intuitive reservation system.
      </>
    ),
  },
  {
    title: 'Online Ordering',
    description: (
      <>
        Order your favorite dishes online for pickup or delivery.
      </>
    ),
  },
  {
    title: 'Real-time Tracking',
    description: (
      <>
        Track your order status in real-time from kitchen to table.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}