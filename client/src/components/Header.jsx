import logo from '../assets/magnifying-glass-logo.svg';
import { APP_VERSION } from '../version';

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
  version: {
    fontSize: '12px',
    color: '#5f6368',
    alignSelf: 'flex-end',
    marginBottom: '4px',
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
      <span style={styles.version} data-testid="app-version">v{APP_VERSION}</span>
    </div>
  );
}

