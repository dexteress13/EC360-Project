import logo from '../assets/magnifying-glass-logo.svg';

const styles = {
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  logo: {
    height: '45px',
    width: 'auto',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a73e8',
    margin: 0,
  },
};

export default function Header({ subtitle }) {
  return (
    <div style={styles.headerContainer}>
      <img src={logo} alt="RevMatch Logo" style={styles.logo} />
      <h2 style={styles.title}>RevMatch</h2>
    </div>
  );
}

