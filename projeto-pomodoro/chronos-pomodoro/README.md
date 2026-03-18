# ⏯️ Criando o Botão Principal e Explorando Propriedades Dinâmicas

Chegamos ao elemento principal de interação do nosso usuário: o botão de
Play/Stop!

Se você observar o design da aplicação, o botão muda de verde (Play) para
vermelho (Stop), além de trocar o ícone. Como a estrutura é exatamente a mesma,
não vamos criar dois botões diferentes; vamos criar **um único componente
inteligente** que recebe propriedades (`props`) para mudar seu visual e
conteúdo.

---

## 🏗️ 1. A Estrutura e Tipagem do Botão (DefaultButton)

Para ganhar tempo, você pode copiar a pasta do `DefaultInput` e renomear para
`DefaultButton` (lembre-se de alterar as ocorrências da palavra "input" para
"button" no código).

Vamos precisar de duas propriedades customizadas:

1. **`icon`:** Vai receber o componente de ícone do _Lucide React_. O tipo ideal
   para receber elementos React como propriedade é o `React.ReactNode`.
2. **`color`:** Vai aceitar apenas duas strings específicas (`'green'` ou
   `'red'`). Faremos ela ser opcional (`?`) e daremos um valor padrão de
   `'green'` na desestruturação.

**Arquivo:** `src/components/DefaultButton/index.tsx`

```tsx
import styles from './styles.module.css';

type DefaultButtonProps = {
  icon: React.ReactNode; // Aceita componentes, texto, HTML, etc.
  color?: 'green' | 'red'; // Union Type: Só aceita essas duas strings
} & React.ComponentProps<'button'>; // Herda as propriedades nativas de um botão (onClick, disabled, etc)

export function DefaultButton({
  icon,
  color = 'green', // Valor padrão: se ninguém enviar a cor, será verde!
  ...props
}: DefaultButtonProps) {
  return (
    <>
      {/* A Mágica do CSS Modules Dinâmico:
        Usamos colchetes styles[color] para acessar a classe CSS de forma dinâmica.
        Se color for 'red', o React lê: styles['red'] e aplica a classe .red do CSS!
      */}
      <button className={`${styles.button} ${styles[color]}`} {...props}>
        {icon}
      </button>
    </>
  );
}
```

## 🎨 2. Estilizando o Botão e os Modificadores de Cor

No CSS, teremos uma classe base (`.button`) que define o tamanho, os espaços e
os alinhamentos. Depois, teremos as classes "modificadoras" (`.green` e `.red`)
que apenas injetam as cores específicas.

💡 **Dica de CSS:** Ao invés de colocar uma classe diretamente no ícone, podemos
usar o seletor `.button svg` para estilizar qualquer SVG que caia dentro do
nosso botão.

**Arquivo:** `src/components/DefaultButton/styles.module.css`

```css
/* Estilo Base do Botão */
.button {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24rem;
  padding: 0.8rem;
  border-radius: 0.8rem;
  margin: 4.8rem 0;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

/* O ícone do Lucide React é renderizado como um <svg> */
.button svg {
  width: 3.2rem;
  height: 3.2rem;
}

/* Efeito de Hover escurecendo o botão dinamicamente */
.button:hover {
  filter: brightness(80%);
}

/* --- Classes Modificadoras de Cor --- */
.green {
  background: var(--primary);
  color: var(--text-over-primary);
}

.red {
  background: var(--error);
  color: var(--text-over-error);
}
```

## 🚀 3. Renderizando os Botões no App.tsx

Agora vamos testar a flexibilidade do nosso componente! Vamos renderizar os dois
estados do botão lado a lado lá no nosso formulário principal para garantir que
nossas propriedades opcionais e obrigatórias estão funcionando.

**Arquivo:** `src/App.tsx`

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput';
import { Cycles } from './components/Cycles';
import { DefaultButton } from './components/DefaultButton'; // <-- Importado!

// Importando os ícones do pacote lucide-react (Certifique-se de ter instalado!)
import { PlayCircleIcon, StopCircleIcon } from 'lucide-react';

import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <>
      {/* ... containers anteriores (Logo, Menu, CountDown) ... */}

      <Container>
        <form className='form' action=''>
          <div className='formRow'>
            <DefaultInput
              labelText='task'
              id='meuInput'
              type='text'
              placeholder='Digite algo'
            />
          </div>

          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          <div className='formRow'>
            <Cycles />
          </div>

          {/* Testando os nossos botões dinâmicos */}
          <div className='formRow'>
            {/* Como o color padrão é 'green', não precisamos passar a prop aqui! */}
            <DefaultButton icon={<PlayCircleIcon />} color='green' />

            {/* Forçando o botão a ser vermelho e mudando o ícone */}
            <DefaultButton icon={<StopCircleIcon />} color='red' />
          </div>
        </form>
      </Container>
    </>
  );
}
```

O legal de travar as propriedades via TypeScript (`'green'` | `'red'`) é que se
um desenvolvedor no futuro tentar passar `color='blue'`, o próprio VS Code vai
avisar que existe um erro antes mesmo de rodar o código. Isso previne muitos
bugs na interface!
