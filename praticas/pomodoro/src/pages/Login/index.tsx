import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext/useAuthContext';
import {
  registerUser,
  forgotPassword,
  resetPassword,
  setToken,
} from '../../services/apiService';
import styles from './styles.module.css';

type ViewMode = 'login' | 'register' | 'forgot' | 'reset';

export function Login() {
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetTokenState] = useState('');

  const { login } = useAuthContext();
  const navigate = useNavigate();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, [viewMode]);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = setTimeout(() => setFeedbackMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  function showFeedback(message: string, type: 'success' | 'error' | 'info') {
    setFeedbackMessage(message);
    setFeedbackType(type);
  }

  function goTo(view: ViewMode) {
    setViewMode(view);
    setFeedbackMessage('');
  }

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();
    if (!email || !password) { showFeedback('Preencha todos os campos.', 'error'); return; }
    setIsSubmitting(true);
    try {
      await login(email, password);
      showFeedback('Login realizado com sucesso!', 'success');
      setTimeout(() => navigate('/home/'), 600);
    } catch (err) {
      showFeedback(err instanceof Error ? err.message : 'Erro ao fazer login.', 'error');
      setIsSubmitting(false);
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value.trim();
    if (!name || !email || !password) { showFeedback('Preencha todos os campos.', 'error'); return; }
    if (password.length < 1) { showFeedback('Digite uma senha.', 'error'); return; }
    if (password !== confirm) { showFeedback('As senhas não coincidem.', 'error'); return; }
    setIsSubmitting(true);
    try {
      const data = await registerUser({ email, name, password });
      setToken(data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      showFeedback('Conta criada com sucesso!', 'success');
      setTimeout(() => navigate('/home/'), 800);
    } catch (err) {
      showFeedback(err instanceof Error ? err.message : 'Erro ao cadastrar.', 'error');
      setIsSubmitting(false);
    }
  }

  async function handleForgotSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    if (!email) { showFeedback('Informe seu e-mail.', 'error'); return; }
    setIsSubmitting(true);
    try {
      const data = await forgotPassword(email);
      if (data.resetToken) {
        setResetTokenState(data.resetToken);
        showFeedback(`Token gerado (lab): ${data.resetToken}`, 'info');
        setTimeout(() => goTo('reset'), 1500);
      } else {
        showFeedback(data.message, 'success');
      }
    } catch (err) {
      showFeedback(err instanceof Error ? err.message : 'Erro ao solicitar recuperação.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const token = (form.elements.namedItem('token') as HTMLInputElement).value.trim();
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value.trim();
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value.trim();
    if (!token || !newPassword) { showFeedback('Preencha todos os campos.', 'error'); return; }
    if (newPassword.length < 1) { showFeedback('Digite uma senha.', 'error'); return; }
    if (newPassword !== confirm) { showFeedback('As senhas não coincidem.', 'error'); return; }
    setIsSubmitting(true);
    try {
      await resetPassword({ token, newPassword });
      showFeedback('Senha redefinida! Faça login com a nova senha.', 'success');
      setTimeout(() => goTo('login'), 1500);
    } catch (err) {
      showFeedback(err instanceof Error ? err.message : 'Erro ao redefinir senha.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
              <label htmlFor="email" className={styles.label}>E-mail</label>
              <input ref={firstInputRef} id="email" name="email" type="email"
                className={styles.input} placeholder="seu@email.com"
                autoComplete="username" disabled={isSubmitting} />
            </div>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Senha</label>
              <input id="password" name="password" type="password"
                className={styles.input} placeholder="••••••"
                autoComplete="current-password" disabled={isSubmitting} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
            <div className={styles.links}>
              <a href="#" className={styles.link} onClick={e => { e.preventDefault(); goTo('forgot'); }}>
                Esqueci minha senha
              </a>
              <a href="#" className={styles.link} onClick={e => { e.preventDefault(); goTo('register'); }}>
                Não tem conta? Cadastre-se
              </a>
            </div>
          </form>
        )}

        {viewMode === 'register' && (
          <form className={styles.form} onSubmit={handleRegisterSubmit} noValidate>
            <h2 className={styles.formTitle}>Criar Conta</h2>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>Nome</label>
              <input ref={firstInputRef} id="name" name="name" type="text"
                className={styles.input} placeholder="Seu nome" disabled={isSubmitting} />
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>E-mail</label>
              <input id="email" name="email" type="email"
                className={styles.input} placeholder="seu@email.com"
                autoComplete="username" disabled={isSubmitting} />
            </div>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Senha</label>
              <input id="password" name="password" type="password"
                className={styles.input} placeholder="Sua senha"
                autoComplete="new-password" disabled={isSubmitting} />
            </div>
            <div className={styles.field}>
              <label htmlFor="confirm" className={styles.label}>Confirmar senha</label>
              <input id="confirm" name="confirm" type="password"
                className={styles.input} placeholder="Repita a senha"
                autoComplete="new-password" disabled={isSubmitting} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            <a href="#" className={styles.link} onClick={e => { e.preventDefault(); goTo('login'); }}>
              ← Voltar para o login
            </a>
          </form>
        )}

        {viewMode === 'forgot' && (
          <form className={styles.form} onSubmit={handleForgotSubmit} noValidate>
            <h2 className={styles.formTitle}>Recuperar Senha</h2>
            <p className={styles.simulationNote}>
              Informe seu e-mail. Em ambiente de lab, o token é retornado direto na tela.
            </p>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>E-mail</label>
              <input ref={firstInputRef} id="email" name="email" type="email"
                className={styles.input} placeholder="seu@email.com" disabled={isSubmitting} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar token'}
            </button>
            <a href="#" className={styles.link} onClick={e => { e.preventDefault(); goTo('login'); }}>
              ← Voltar para o login
            </a>
          </form>
        )}

        {viewMode === 'reset' && (
          <form className={styles.form} onSubmit={handleResetSubmit} noValidate>
            <h2 className={styles.formTitle}>Redefinir Senha</h2>
            <div className={styles.field}>
              <label htmlFor="token" className={styles.label}>Token de recuperação</label>
              <input ref={firstInputRef} id="token" name="token" type="text"
                className={styles.input} placeholder="Cole o token recebido"
                defaultValue={resetToken} disabled={isSubmitting} />
            </div>
            <div className={styles.field}>
              <label htmlFor="newPassword" className={styles.label}>Nova senha</label>
              <input id="newPassword" name="newPassword" type="password"
                className={styles.input} placeholder="Nova senha"
                autoComplete="new-password" disabled={isSubmitting} />
            </div>
            <div className={styles.field}>
              <label htmlFor="confirm" className={styles.label}>Confirmar nova senha</label>
              <input id="confirm" name="confirm" type="password"
                className={styles.input} placeholder="Repita a nova senha"
                autoComplete="new-password" disabled={isSubmitting} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
            </button>
            <a href="#" className={styles.link} onClick={e => { e.preventDefault(); goTo('login'); }}>
              ← Voltar para o login
            </a>
          </form>
        )}
      </div>
    </div>
  );
}
