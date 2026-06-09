const API_URL = 'http://localhost:3333';

// ─── Token helpers ────────────────────────────────────────────────────────────
export function getToken(): string | null {
  return sessionStorage.getItem('token');
}

export function setToken(token: string): void {
  sessionStorage.setItem('token', token);
}

export function clearToken(): void {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type ApiUser = {
  id: number;
  email: string;
  name: string;
};

export type ApiAuthResponse = {
  token: string;
  user: ApiUser;
};

export type ApiSettings = {
  id: number;
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  updatedAt: string;
};

export type ApiTask = {
  id: string;
  name: string;
  duration: number;
  type: string;
  startDate: string;
  completeDate: string | null;
  interruptDate: string | null;
  createdAt: string;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function registerUser(data: {
  email: string;
  name: string;
  password: string;
}): Promise<ApiAuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Erro ao cadastrar');
  }
  return res.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<ApiAuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Credenciais inválidas');
  }
  return res.json();
}

export async function forgotPassword(
  email: string,
): Promise<{ message: string; resetToken?: string }> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Erro ao solicitar recuperação');
  }
  return res.json();
}

export async function resetPassword(data: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Erro ao redefinir senha');
  }
  return res.json();
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export async function getSettings(): Promise<ApiSettings> {
  const res = await fetch(`${API_URL}/settings`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Erro ao buscar configurações');
  return res.json();
}

export async function updateSettings(data: {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}): Promise<ApiSettings> {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao salvar configurações');
  return res.json();
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
export async function getTasks(): Promise<ApiTask[]> {
  const res = await fetch(`${API_URL}/tasks`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Erro ao buscar tarefas');
  return res.json();
}

export async function createTask(data: {
  id: string;
  name: string;
  duration: number;
  type: string;
  startDate: number;
}): Promise<ApiTask> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar tarefa');
  return res.json();
}

export async function completeTask(id: string): Promise<ApiTask> {
  const res = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ completeDate: Date.now() }),
  });
  if (!res.ok) throw new Error('Erro ao completar tarefa');
  return res.json();
}

export async function interruptTask(id: string): Promise<ApiTask> {
  const res = await fetch(`${API_URL}/tasks/${id}/interrupt`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ interruptDate: Date.now() }),
  });
  if (!res.ok) throw new Error('Erro ao interromper tarefa');
  return res.json();
}

export async function clearTasks(): Promise<void> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Erro ao limpar histórico');
}
