# 🌐 Inicializando o Estado Global no `App`

Chegou a hora de sujarmos as mãos com o Estado Global no nível superior da nossa
aplicação e entendermos na prática um conceito muito famoso no React: o Prop
Drilling (perfuração de propriedades).

Nesta aula, vamos criar o estado da nossa aplicação no componente de nível mais
alto: o `App.tsx`. A partir dele, começaremos a "descer" essas informações para
as páginas e componentes filhos através de _props_.

Isso vai gerar um caminho um pouco doloroso, mas muito didático, para
entendermos por que ferramentas como a _Context API_ existem.

---

## 🏗️ 1. O Estado Inicial (`App.tsx`)

Primeiro, precisamos definir como o nosso estado começa quando o usuário abre a
aplicação. Vamos criar um objeto `initialState` respeitando a tipagem do
`TaskStateModel` que criamos na aula passada.

Em seguida, usamos o `useState` e passamos o `state` e o `setState` como
propriedades para a página `<Home />`.

**Arquivo:** `src/App.tsx`

```tsx
import { Home } from './pages/Home';
import { useState } from 'react';
import type { TaskStateModel } from './models/TaskStateModel';

import './styles/theme.css';
import './styles/global.css';

// 1. Definimos o valor inicial da nossa aplicação
const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: '00:00',
  activeTask: null,
  currentCycle: 0,
  config: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  },
};

export function App() {
  // 2. Iniciamos o estado global
  const [state, setState] = useState(initialState);

  // 3. Repassamos o estado e a função que altera o estado para o componente filho
  return <Home state={state} setState={setState} />;
}
```

## ⚠️ 2. A Regra de Ouro do React: Imutabilidade

Antes de irmos para a `Home`, o instrutor deixou um aviso importantíssimo sobre
como atualizar objetos e arrays no estado do React. Você nunca deve alterar um
objeto mutável diretamente!

### ❌ O jeito ERRADO (Mutação direta):

```tsx
// Nunca faça isso! O React não vai perceber a mudança e a tela não vai atualizar.
setState(prevState => {
  prevState.currentCycle = 5;
  return prevState;
});
```

### ✅ O jeito CERTO (Criando um novo objeto com Spread Operator):

```tsx
// Sempre retorne um NOVO objeto, copiando tudo o que existia antes (...prevState)
setState(prevState => {
  return {
    ...prevState,
    currentCycle: 5,
  };
});
```

## 🚚 3. Recebendo o Estado via Props (`Home.tsx`)

Agora, lá na página `Home`, precisamos avisar o TypeScript que este componente
vai receber propriedades (`props`).

A tipagem do `state` é fácil (`TaskStateModel`), mas a tipagem do `setState` é
um pouco feia de se ver. No React, a função que altera o estado usa o tipo
`React.Dispatch<React.SetStateAction<TipoDoEstado>>`.

**Arquivo:** `src/pages/Home/index.tsx`

```tsx
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { MainTemplate } from '../../templates/MainTemplate';

// 1. Tipamos o que a Home vai receber de presente do App
type HomeProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

export function Home(props: HomeProps) {
  // 2. Desestruturamos para facilitar o uso
  const { state, setState } = props;

  return (
    <MainTemplate>
      <Container>
        {/* Em breve, o CountDown vai precisar desse state... */}
        <CountDown />
      </Container>

      <Container>
        {/* ...e o MainForm também! */}
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
```

## 🎯 Onde estamos e para onde vamos?

Você percebeu o que aconteceu? O estado nasceu no `App`, foi enviado para a
`Home`, mas a `Home` em si não usa esse estado para nada visual! Ela só recebeu
o estado porque os filhos dela (`CountDown` e `MainForm`) vão precisar dele nas
próximas aulas.

Isso é o famoso **Prop Drilling** (ficar "furando" componentes passando
propriedades para baixo). Estamos fazendo isso de propósito para sentirmos a
necessidade de uma solução melhor no futuro.
