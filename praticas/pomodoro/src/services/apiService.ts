const API_URL = 'http://localhost:3333';

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

export async function getSettings(): Promise<ApiSettings> {
  const res = await fetch(`${API_URL}/settings`);
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao salvar configurações');
  return res.json();
}

export async function getTasks(): Promise<ApiTask[]> {
  const res = await fetch(`${API_URL}/tasks`);
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar tarefa');
  return res.json();
}

export async function completeTask(id: string): Promise<ApiTask> {
  const res = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completeDate: Date.now() }),
  });
  if (!res.ok) throw new Error('Erro ao completar tarefa');
  return res.json();
}

export async function interruptTask(id: string): Promise<ApiTask> {
  const res = await fetch(`${API_URL}/tasks/${id}/interrupt`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interruptDate: Date.now() }),
  });
  if (!res.ok) throw new Error('Erro ao interromper tarefa');
  return res.json();
}

export async function clearTasks(): Promise<void> {
  const res = await fetch(`${API_URL}/tasks`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao limpar histórico');
}
