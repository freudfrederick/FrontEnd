import { useEffect } from 'react';
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { MainTemplate } from '../../templates/MainTemplate';
import { useAuthContext } from '../../contexts/AuthContext/useAuthContext';

export function Home() {
  const { user } = useAuthContext();

  useEffect(() => {
    document.title = 'Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      {user && (
        <Container>
          <p style={{ textAlign: 'center', opacity: 0.7, fontSize: '0.9rem' }}>
            Bem-vindo, <strong>{user.name}</strong>!
          </p>
        </Container>
      )}

      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
