# 🛠️ Refatorando o Contexto: Provider e Custom Hook

Chegou o momento de organizarmos nossa casa e criarmos as estruturas definitivas
para o nosso Contexto: o Provider Customizado e o Custom Hook!

Nesta aula, vamos melhorar a forma como usamos a Context API. Usar o
`<TaskContext.Provider>` diretamente no `App.tsx` e o `useContext(TaskContext)`
espalhado pelos componentes funciona, mas deixa o código poluído e difícil de
dar manutenção.

A melhor prática no React é isolar essas responsabilidades. Vamos criar um
componente específico para ser o "Pai" (Provider) e um atalho (Hook) para os
"Filhos" consumirem os dados.

---

## 📦 1. O Componente Provider e o Custom Hook

Vamos centralizar tudo relacionado ao contexto em um único arquivo.

> ⚠️ **Aviso sobre o Erro no Console (Fast Refresh):** > Ao colocar o Contexto,
> o Provider e o Hook no mesmo arquivo, o Vite (ferramenta que roda nosso React)
> pode reclamar no console dizendo: _"Fast refresh only works when a file only
> exports components"_. **Não se preocupe com isso agora!** Mais para frente,
> vamos separar isso em arquivos diferentes e o erro vai sumir.

**Arquivo:** `src/contexts/TaskContext.tsx`

```tsx
import { createContext, useContext } from 'react';
import type { TaskStateModel } from '../../models/TaskStateModel';

// 1. Trazemos o initialState para cá
const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: '00:00',
  activeTask: null,
  currentCycle: 0,
  config: { workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
};

type TaskContextProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

const initialContextValue = {
  state: initialState,
  setState: () => {}, // Função vazia provisória
};

// 2. Criação do Contexto
export const TaskContext = createContext<TaskContextProps>(initialContextValue);

// ==============================================================
// 3. NOSSO COMPONENTE PROVIDER CUSTOMIZADO
// ==============================================================
type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  // O valor passado aqui na prop "value" é o que de fato vai para a aplicação!
  return (
    <TaskContext.Provider value={{ ...initialContextValue }}>
      {children}
    </TaskContext.Provider>
  );
}

// ==============================================================
// 4. NOSSO CUSTOM HOOK (Atalho para os filhos)
// ==============================================================
export function useTaskContext() {
  return useContext(TaskContext);
}
```

## 🧹 2. Limpando o `App.tsx`

Agora que temos o `TaskContextProvider`, nosso `App.tsx` fica muito mais
elegante. Ele não precisa mais saber sobre o `TaskContext.Provider` cru, ele
apenas usa o componente que acabamos de criar.

Arquivo: `src/App.tsx`

```tsx
import { Home } from './pages/Home';
import { useState } from 'react';
import type { TaskStateModel } from './models/TaskStateModel';
import { TaskContextProvider } from './contexts/TaskContext';

import './styles/theme.css';
import './styles/global.css';

const initialState: TaskStateModel = {
  // ... (mesmo objeto de antes)
};

export function App() {
  // O estado REAL ainda está aqui, mas o Provider não está usando ele (ainda!)
  const [state, setState] = useState(initialState);

  return (
    // Usamos o nosso componente limpo e encapsulado
    <TaskContextProvider>
      <Home />
    </TaskContextProvider>
  );
}
```

## 🚀 3. Consumindo o Hook no CountDown

Lembra que antes precisávamos importar o `useContext` do React E o
`TaskContext`? Graças ao nosso Custom Hook, basta uma única importação para
termos acesso à nossa "nuvem" de dados.

**Arquivo:** `src/components/CountDown/index.tsx`

```tsx
import styles from './styles.module.css';

// 1. Importamos apenas o nosso Hook!
import { useTaskContext } from '../../contexts/TaskContext';

export function CountDown() {
  // 2. Chamamos o Hook
  const taskContext = useTaskContext();

  console.log(taskContext); // Teste no navegador!

  return <div className={styles.container}>00:00</div>;
}
```

## 🧩 O Que Falta?

Fizemos uma refatoração arquitetural excelente, mas temos um pequeno detalhe
técnico: nosso estado ainda não é reativo.

Se você olhar com atenção, o `TaskContextProvider` está passando o
`initialContextValue` (que é estático e tem uma função `setState` vazia) para a
aplicação. Enquanto isso, o useState de verdade ficou lá "esquecido" no
`App.tsx`.
