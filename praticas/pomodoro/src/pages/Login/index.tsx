import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext/useAuthContext';
import { MOCK_CREDENTIALS } from '../../contexts/AuthContext/AuthContext';
import styles from './styles.module.css';

type ViewMode = 'login' | 'register' | 'recover';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuthContext();
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, [viewMode]);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = setTimeout(() => setFeedbackMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  function showFeedback(message: string, type: 'success' | 'error' | 'info') {
    setFeedbackMessage(message);
    setFeedbackType(type);
  }

  function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      showFeedback('Preencha todos os campos.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        showFeedback('Login realizado com sucesso!', 'success');
        setTimeout(() => navigate('/home/'), 800);
      } else {
        showFeedback(
          `Credenciais inválidas. Use: ${MOCK_CREDENTIALS.username} / ${MOCK_CREDENTIALS.password}`,
          'error',
        );
        setIsSubmitting(false);
      }
    }, 600);
  }

  function handleRegisterClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setViewMode('register');
    setFeedbackMessage('');
    setUsername('');
    setPassword('');
  }

  function handleRecoverClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setViewMode('recover');
    setFeedbackMessage('');
  }

  function handleBackToLogin(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setViewMode('login');
    setFeedbackMessage('');
  }

  function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showFeedback('Fluxo de cadastro ainda será implementado.', 'info');
  }

  function handleRecoverSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showFeedback('Fluxo de recuperação de senha ainda será implementado.', 'info');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <span className={styles.logoIcon} aria-hidden="true">⏱</span>
          <h1 className={styles.logoText}>Chronos</h1>
          <p className={styles.logoSub}>Técnica Pomodoro</p>
        </div>

        {feedbackMessage && (
          <div className={`${styles.feedback} ${styles[feedbackType]}`} role="alert" aria-live="polite">
            {feedbackMessage}
          </div>
        )}

        {viewMode === 'login' && (
          <form className={styles.form} onSubmit={handleLoginSubmit} noValidate>
            <h2 className={styles.formTitle}>Entrar</h2>
            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>E-mail</label>
              <input ref={usernameRef} id="username" type="text" className={styles.input}
                placeholder="freud@iesb" value={username} onChange={e => setUsername(e.target.value)}
                autoComplete="username" aria-label="Campo de usuário" disabled={isSubmitting} />
            </div>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Senha</label>
              <input id="password" type="password" className={styles.input}
                placeholder="iesb" value={password} onChange={e => setPassword(e.target.value)}
                autoComplete="current-password" aria-label="Campo de senha" disabled={isSubmitting} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting} aria-label="Botão de login">
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
            <div className={styles.links}>
              <a href="#" className={styles.link} onClick={handleRecoverClick}>Esqueci minha senha</a>
              <a href="#" className={styles.link} onClick={handleRegisterClick}>Não tem conta? Cadastre-se</a>
            </div>
          </form>
        )}

        {viewMode === 'register' && (
          <form className={styles.form} onSubmit={handleRegisterSubmit} noValidate>
            <h2 className={styles.formTitle}>Criar Conta</h2>
            <p className={styles.simulationNote}>Fluxo de cadastro em desenvolvimento.</p>
            <div className={styles.field}>
              <label htmlFor="reg-username" className={styles.label}>E-mail</label>
              <input ref={usernameRef} id="reg-username" type="text" className={styles.input}
                placeholder="freud@iesb" aria-label="Campo de usuário para cadastro" />
            </div>
            <div className={styles.field}>
              <label htmlFor="reg-password" className={styles.label}>Senha</label>
              <input id="reg-password" type="password" className={styles.input}
                placeholder="iesb" aria-label="Campo de senha para cadastro" />
            </div>
            <button type="submit" className={styles.submitBtn}>Cadastrar</button>
            <a href="#" className={styles.link} onClick={handleBackToLogin}>← Voltar para o login</a>
          </form>
        )}

        {viewMode === 'recover' && (
          <form className={styles.form} onSubmit={handleRecoverSubmit} noValidate>
            <h2 className={styles.formTitle}>Recuperar Senha</h2>
            <p className={styles.simulationNote}>Fluxo de recuperação em desenvolvimento.</p>
            <div className={styles.field}>
              <label htmlFor="recover-email" className={styles.label}>E-mail</label>
              <input ref={usernameRef} id="recover-email" type="text" className={styles.input}
                placeholder="freud@iesb" aria-label="Campo de usuário para recuperação" />
            </div>
            <button type="submit" className={styles.submitBtn}>Enviar link de recuperação</button>
            <a href="#" className={styles.link} onClick={handleBackToLogin}>← Voltar para o login</a>
          </form>
        )}
      </div>
    </div>
  );
}
