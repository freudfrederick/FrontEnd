import {
  HistoryIcon,
  HouseIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  LogOutIcon,
} from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { RouterLink } from '../RouterLink';
import { useAuthContext } from '../../contexts/AuthContext/useAuthContext';
import { useNavigate } from 'react-router';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const [theme, setTheme] = useState<AvailableThemes>(() => {
    const storageTheme =
      (localStorage.getItem('theme') as AvailableThemes) || 'dark';
    return storageTheme;
  });

  const { logout, user } = useAuthContext();
  const navigate = useNavigate();
  const initials = user?.name ? user.name.trim().split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('') : '?';

  const nextThemeIcon = {
    dark: <SunIcon />,
    light: <MoonIcon />,
  };

  function handleThemeChange(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  }

  function handleLogout(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    logout();
    navigate('/');
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={styles.menuWrapper}>
      {user && (
        <div className={styles.userBadge} title={user.name}>
          <span className={styles.userAvatar}>{initials}</span>
          <span className={styles.userName}>{user.name.split(' ')[0]}</span>
        </div>
      )}
      <nav className={styles.menu}>
      <RouterLink className={styles.menuLink} href='/home/' aria-label='Ir para a Home' title='Ir para a Home'>
        <HouseIcon />
      </RouterLink>
      <RouterLink className={styles.menuLink} href='/history/' aria-label='Ver Histórico' title='Ver Histórico'>
        <HistoryIcon />
      </RouterLink>
      <RouterLink className={styles.menuLink} href='/settings/' aria-label='Configurações' title='Configurações'>
        <SettingsIcon />
      </RouterLink>
      <a className={styles.menuLink} href='#' aria-label='Mudar Tema' title='Mudar Tema' onClick={handleThemeChange}>
        {nextThemeIcon[theme]}
      </a>
      <a className={styles.menuLink} href='#' aria-label='Sair' title='Sair' onClick={handleLogout}>
        <LogOutIcon />
      </a>
    </nav>
    </div>
  );
}
