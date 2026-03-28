# 🔄 Gerenciando os Ciclos do Pomodoro

Vamos focar em resolver um problema por vez, começando pela lógica de contagem
dos ciclos do nosso Pomodoro!

A nossa aplicação possui um fluxo contínuo de ciclos (Tempo de Foco, Pausa
Curta, Tempo de Foco... até a Pausa Longa). Para o nosso Pomodoro, vamos
considerar que um fluxo completo tem 8 etapas.

O nosso estado inicial começa no ciclo `0`. O objetivo agora é fazer com que, a
cada nova tarefa criada, ele avance para `1, 2, 3...` e, quando chegar no ciclo
`8`, ele reinicie voltando para o `1`.

Como essa é uma lógica pura de JavaScript (não depende de telas ou Hooks), vamos
separá-la em um arquivo utilitário.

---

## 🛠️ 1. Criando a Função Utilitária (`getNextCycle.ts`)

Vamos criar uma pasta chamada `utils` dentro de `src`. Essa pasta servirá para
guardarmos funções soltas e reaproveitáveis que resolvem problemas específicos
de lógica.

**Arquivo:** `src/utils/getNextCycle.ts`

```typescript
export function getNextCycle(currentCycle: number) {
  // Se for o estado inicial (0) ou se finalizou o último ciclo (8), volta para 1.
  // Caso contrário, apenas soma + 1 ao ciclo atual.
  return currentCycle === 0 || currentCycle === 8 ? 1 : currentCycle + 1;
}
```

## 🔌 2. Calculando o Ciclo no Formulário (`MainForm.tsx`)

Agora precisamos aplicar essa lógica dentro do nosso formulário.

Um detalhe importantíssimo: nós vamos calcular qual é o "próximo ciclo" fora da
função de clique/envio do formulário. Por que? Porque os textos da nossa tela
(como aquele parágrafo _"Próximo intervalo é de 25min"_) vão precisar saber qual
é o ciclo atual antes mesmo do usuário clicar no botão de Play!

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { useRef } from 'react';
import { TaskModel } from '../../models/TaskModel';
import { useTaskContext } from '../../contexts/useTaskContext';
// 1. Importe a nossa nova função utilitária
import { getNextCycle } from '../../utils/getNextCycle';

// ... imports dos componentes (DefaultInput, Cycles, etc) ...

export function MainForm() {
  // 2. Agora precisamos puxar o 'state' também, além do 'setState'
  const { state, setState } = useTaskContext();
  const taskNameInput = useRef<HTMLInputElement>(null);

  // 3. Calculamos o próximo ciclo ANTES do usuário fazer qualquer coisa.
  // Como o estado inicial é 0, o nextCycle já começa valendo 1.
  const nextCycle = getNextCycle(state.currentCycle);

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (taskNameInput.current === null) return;
    const taskName = taskNameInput.current.value.trim();
    if (!taskName) {
      alert('Digite o nome da tarefa');
      return;
    }

    const newTask: TaskModel = {
      id: Date.now().toString(),
      name: taskName,
      startDate: new Date(),
      completeDate: null,
      interruptDate: null,
      duration: 1,
      type: 'workTime',
    };

    const secondsRemaining = newTask.duration * 60;

    setState(prevState => {
      return {
        ...prevState,
        config: { ...prevState.config },
        activeTask: newTask,

        // 4. Substituímos o valor fixo '1' pela nossa variável calculada
        currentCycle: nextCycle,

        secondsRemaining, // Conferir depois
        formattedSecondsRemaining: '00:00', // Conferir depois
        tasks: [...prevState.tasks, newTask],
      };
    });
  }

  // ... return do JSX ...
}
```

## 🧠 Entendendo o Fluxo de Renderização (O Pulo do Gato)

Pode parecer um pouco confuso calcular o `nextCycle` fora da função de criar
tarefa, mas o React funciona assim:

1. A tela carrega. O `state.currentCycle` é 0.
2. O componente lê a linha `const nextCycle = getNextCycle(0)`, então a variável
   nextCycle passa a valer 1. A tela fica aguardando.
3. O usuário digita uma tarefa e clica em Play.
4. A função `handleCreateNewTask` é disparada e atualiza o estado global,
   definindo o ciclo atual como 1.
5. O estado mudou! O React re-renderiza todo o `<MainForm />`.
6. O componente lê novamente a linha `const nextCycle = getNextCycle(1)`, e
   agora a variável fica engatilhada valendo **2**, pronta para quando o usuário
   finalizar essa tarefa e for iniciar a próxima.

Nós estamos sempre um passo à frente, preparando os dados do próximo ciclo!

Temos a gestão dos ciclos funcionando! Com essa informação em mãos, podemos
determinar se o ciclo atual é um momento de Foco (`workTime`) ou uma Pausa
(`breakTime`), além de ajustar a duração de acordo com as configurações.
