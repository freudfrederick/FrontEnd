# 🕳️ Prop Drilling na Prática: Descendo o Estado

Na aula passada, o estado nasceu no `App.tsx` e foi repassado para a página
`Home`. Agora, precisamos que esse estado chegue aos componentes que realmente
vão usá-lo: o `CountDown` e o `MainForm`.

Vamos fazer isso acontecer e observar os problemas que surgem com essa
abordagem.

---

## 🚚 1. Repassando as Props na `Home`

Primeiro, vamos exportar o tipo `HomeProps` para podermos reutilizá-lo nos
componentes filhos (isso poupa a gente de ter que recriar a mesma tipagem
complexa em todo arquivo).

Depois, usamos o _spread operator_ (`{...props}`) para repassar **todas** as
propriedades que a `Home` recebeu diretamente para o `CountDown` e para o
`MainForm`.

**Arquivo:** `src/pages/Home/index.tsx`

```tsx
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { MainTemplate } from '../../templates/MainTemplate';

// 1. Exportamos o tipo para reutilizar depois
export type HomeProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

export function Home(props: HomeProps) {
  // A Home não usa o state, ela só serve de "ponte"
  return (
    <MainTemplate>
      <Container>
        {/* 2. Repassamos tudo que a Home recebeu para o CountDown */}
        <CountDown {...props} />
      </Container>

      <Container>
        {/* ...e para o MainForm! */}
        <MainForm {...props} />
      </Container>
    </MainTemplate>
  );
}
```

## ⏱️ 2. Recebendo o Estado no `CountDown`

Agora o nosso cronômetro finalmennte tem acesso ao tempo formatado que vem lá do
`App.tsx`!

**Arquivo:** `src/components/CountDown/index.tsx`

```tsx
import type { HomeProps } from '../../pages/Home';
import styles from './styles.module.css';

// Usamos a tipagem exportada da Home
export function CountDown({ state }: HomeProps) {
  return (
    {/* Exibe o tempo que está no estado global */}
    <div className={styles.container}>{state.formattedSecondsRemaining}</div>
  );
}
```

## 📝 3. Recebendo e Alterando o Estado no `MainForm`

Para testarmos se tudo está conectado, vamos exibir uma informação do estado (o
tempo de trabalho) e criar um botão de teste que altera o estado global.

⚠️ **Atenção**: Se atente à forma como o estado de `config` (que é um objeto
dentro de outro objeto) é atualizado!

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import type { HomeProps } from '../../pages/Home';

export function MainForm({ state, setState }: HomeProps) {
  // Função de teste para alterar o estado global
  function handleClick() {
    setState(prevState => {
      return {
        ...prevState, // Copia o estado principal
        config: {
          ...prevState.config, // Copia o objeto 'config'
          workTime: 34, // Altera apenas o workTime
        },
        formattedSecondsRemaining: '23:34', // Atualiza o cronômetro
      };
    });
  }

  return (
    <form className='form' action=''>
      <div>
        {/* Botão de teste! type="button" evita que ele recarregue a página */}
        <button type='button' onClick={handleClick}>
          Testar Alteração de Estado
        </button>
      </div>

      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
        />
      </div>

      <div className='formRow'>
        {/* Consumindo o estado global */}
        <p>Próximo intervalo é de {state.config.workTime}min</p>
      </div>

      <div className='formRow'>
        <Cycles />
      </div>

      <div className='formRow'>
        <DefaultButton icon={<PlayCircleIcon />} />
      </div>
    </form>
  );
}
```

## 🚨 O Diagnóstico: Por que isso é ruim?

Faça o teste: clique no botão "Testar Alteração de Estado" e veja que tanto o
texto do formulário quanto o número do `CountDown` mudam simultaneamente. A
engrenagem funciona!

Mas pare e observe a arquitetura que criamos:

1. O estado nasce no **App** (Nível 1).
2. O App passa para a **Home** (Nível 2).
3. A Home passa para o **MainForm** e **CountDown** (Nível 3).
4. Em breve, o MainForm precisará passar esse estado para o `<Cycles />` e para
   o `<DefaultButton />` (Nível 4).

**A Regra do "Homem do Meio":** Se você tem um componente na sua árvore (como a
nossa `<Home />`) que recebe uma propriedade apenas para passá-la para o filho,
sem utilizá-la para mais nada, você está sofrendo de _Prop Drilling_. Em
aplicações reais, com 10 ou 20 níveis de profundidade, isso vira um pesadelo de
manutenção.
