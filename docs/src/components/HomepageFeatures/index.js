import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Performance',
    Svg: require('@site/static/img/fast.svg').default,
    description: (
      <>
        Basis is optimized for efficiency, with a low CPU footprint and highly 
        optimized message transport. Whether you're working in constrained 
        environments or high-demand systems, Basis ensures your applications 
        run smoothly and efficiently.
      </>
    ),
  },
  {
    title: 'Testing',
    Svg: require('@site/static/img/testing.svg').default,
    description: (
      <>
        Basis simplifies testing with features like deterministic replay, 
        allowing you to reliably reproduce and test scenarios. Seamlessly 
        integrate sub-system and integration testing into your CI/CD pipeline 
        to validate your system at every stage of development.
      </>
    ),
  },
  {
    title: 'Easy to Configure and Expand',
    Svg: require('@site/static/img/launch.svg').default,
    description: (
      <>
        Basis' modular design makes it easy to configure and expand. Customize 
        transport and serialization options to fit your project needs, and 
        manage complex workflows effortlessly with powerful launch configurations.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
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
