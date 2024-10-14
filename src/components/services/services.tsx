import styles from './services.module.css';

export function Services() {
  const services = [
    {
      description: 'Secret sharing made secure.',
      link: '/secret',
      name: 'Secret',
    },
  ];

  return (
    <div className={styles.services}>
      {services.map(service => (
        <a className={styles.service} href={service.link} key={service.link}>
          <h3>Katana {service.name}</h3>
          <p>{service.description}</p>
        </a>
      ))}
    </div>
  );
}
