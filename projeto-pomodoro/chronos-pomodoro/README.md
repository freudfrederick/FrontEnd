# 🚀 Criando a Primeira Tarefa: Iniciando a Lógica do Pomodoro

Chegou a hora de dar o pontapé inicial na lógica da nossa aplicação criando a
nossa primeira Tarefa (Task)!

A partir de agora, o nosso formulário vai ser o maestro da aplicação. É ele quem
dita quando um ciclo começa, configura os tempos e prepara o terreno.
Prepare-se, pois teremos mais lógica e um pouquinho de matemática a partir
daqui!

> 💡 **Dica do Instrutor:** Anote os pontos que achar mais complexos! Vamos
> fazer várias coisas sequenciais (iniciar ciclo, contar tempo, finalizar ciclo,
> preparar o próximo), e entender o "porquê" de cada etapa vai te ajudar muito
> lá na frente.

---

## 🧹 1. Validando e Limpando o Input

Antes de criar uma tarefa, precisamos ter certeza de que o usuário digitou algo
válido. Vamos usar o `useRef` da aula passada, mas adicionando verificações de
segurança e a função `.trim()` para remover espaços em branco inúteis.

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  // 1. Verificação de segurança (TypeScript): O input existe na tela?
  if (taskNameInput.current === null) return;

  // 2. Pegamos o valor e removemos espaços sobrando nas pontas (ex: "  Estudar  " vira "Estudar")
  const taskName = taskNameInput.current.value.trim();

  // 3. Validação do usuário: Ele digitou alguma coisa?
  if (!taskName) {
    alert('Digite o nome da tarefa'); // Substituiremos por um Toast depois!
    return; // Interrompe a função aqui
  }

  console.log('Passou na validação! Tarefa:', taskName);
  // ... próximo passo ...
}
```

## 🏗️ 2. Montando o Objeto da Tarefa (`TaskModel`)

Com o nome da tarefa em mãos, vamos construir o objeto que representa essa
tarefa, seguindo a estrutura do nosso `TaskModel`.

```tsx
// Lembre-se de importar o modelo lá no topo do arquivo!
import type { TaskModel } from '../../models/TaskModel';

// ... dentro do handleCreateNewTask ...

const newTask: TaskModel = {
  // Usamos o timestamp (data em milissegundos) como ID único temporário
  id: Date.now().toString(),
  name: taskName,
  startDate: new Date(),
  completeDate: null,
  interruptDate: null,
  duration: 1, // Fixo temporariamente (vamos pegar do state depois)
  type: 'workTime', // Fixo temporariamente
};

// Convertendo a duração (minutos) para segundos totais
const secondsRemaining = newTask.duration * 60;
```

## 💾 3. Salvando a Tarefa no Estado Global

Agora vem a parte crucial: injetar essa nova tarefa dentro da nossa "nuvem" (o
Contexto). Para isso, vamos puxar o `setState` do nosso Hook e atualizar os
valores.

**Arquivo:** `src/components/MainForm/index.tsx` (Continuação da função)

```tsx
import { useTaskContext } from '../../contexts/useTaskContext'; // Não esqueça o import!

export function MainForm() {
  const { setState } = useTaskContext(); // Puxando a função do contexto
  // ... useRef ...

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    // ... validação ...
    // ... criação da newTask e secondsRemaining ...

    setState(prevState => {
      return {
        ...prevState,
        // Garantindo que não vamos sobrescrever as configurações
        config: { ...prevState.config },

        // A tarefa recém-criada se torna a tarefa ativa
        activeTask: newTask,

        // Itens que vamos configurar nas próximas aulas (marcados como TODO/Conferir)
        currentCycle: 1,
        secondsRemaining,
        formattedSecondsRemaining: '00:00',

        // ATENÇÃO AQUI: Como adicionar um item em um Array no React!
        // Criamos um NOVO array, espalhamos as tarefas antigas (...), e adicionamos a nova no final.
        tasks: [...prevState.tasks, newTask],
      };
    });
  }
  // ...
```

## 👁️ 4. Monitorando o Estado com `useEffect` (Opcional/Debug)

Para provar que tudo isso está funcionando, vamos colocar um "espião" lá no
nosso Provider. Queremos que, toda vez que o estado mudar, ele imprima o estado
atualizado no console. Para isso, usamos o Hook `useEffect`!

**Arquivo:** `src/contexts/TaskContextProvider.tsx`

```tsx
import { useEffect, useState } from 'react'; // Importe o useEffect
// ... imports ...

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, setState] = useState(initialTaskState);

  // O "Espião": Executa o console.log toda vez que a variável 'state' for alterada
  useEffect(() => {
    console.log('ESTADO ATUALIZADO:', state);
  }, [state]);

  return (
    <TaskContext.Provider value={{ state, setState }}>
      {children}
    </TaskContext.Provider>
  );
}
```

## ✅ Testando na Prática

1. Salve tudo e abra o seu navegador.
2. Abra o Console do desenvolvedor (`F12`).
3. Digite o nome de uma tarefa (ex: "Estudar React") e clique no Play.
4. Observe o console! Você verá um objeto gigante impresso.
5. Abra esse objeto e confira:

- O array `tasks` agora tem 1 item.
- O `activeTask` contém o objeto da tarefa que você acabou de criar.
- O `secondsRemaining` está com o valor de `60` (1 minuto).

**Conseguimos!** Injetamos dados reais no nosso estado global. Na próxima aula,
vamos começar a resolver aqueles itens marcados como "Conferir" (Ciclos e
Formatação de Tempo).
