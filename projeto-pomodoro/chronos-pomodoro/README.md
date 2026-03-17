# 🔵 Criando o Componente de Ciclos e Concatenando Classes

Nesta aula, vamos criar o componente que mostra o progresso do usuário através
daquelas "bolinhas" (ciclos).

Vamos extrair aquela estrutura feia que deixamos no `App.tsx` e criar um
componente próprio. No processo, vamos aprender uma técnica essencial no React:
**como aplicar mais de uma classe CSS dinâmica no mesmo elemento**.

---

## 🏗️ 1. Criando a Estrutura do Componente

Crie a pasta `Cycles` dentro de `components`, junto com os arquivos `index.tsx`
e `styles.module.css`.

A nossa estrutura será uma `div` principal (container), um texto e uma `div`
interna para agrupar as bolinhas (que serão tags `<span>`). Por enquanto, vamos
renderizar todas as bolinhas manualmente (hardcoded) para focar na estilização.

**Arquivo:** `src/components/Cycles/index.tsx`

```tsx
import styles from './styles.module.css';

export function Cycles() {
  return (
    <div className={styles.cycles}>
      <span>Ciclos:</span>

      <div className={styles.cycleDots}>
        {/* Renderizaremos as bolinhas aqui no próximo passo! */}
      </div>
    </div>
  );
}
```

## 🎨 2. O Estilo Base e o Truque do Círculo

Vamos criar o CSS para alinhar tudo. O nosso container principal ficará em
coluna, e o container das bolinhas ficará em linha.

Para transformar uma `div` ou `span` em um círculo perfeito, a regra de ouro do
CSS é: o elemento deve ter a **mesma largura e altura** (um quadrado perfeito) e
um `border-radius: 50%`.

**Arquivo:** `src/components/Cycles/styles.module.css`

```css
/* Container principal (Texto + Bolinhas) */
.cycles {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
}

/* Container que segura as bolinhas lado a lado */
.cycleDots {
  display: flex;
  gap: 0.8rem;
}

/* A bolinha base */
.cycleDot {
  width: 2rem;
  height: 2rem;
  background-color: var(--primary); /* Cor base */
  border-radius: 50%; /* Transforma o quadrado em círculo */
}

/* Cores específicas para os diferentes tipos de ciclo */
.workTime {
  background: var(--warning);
}
.shortBreakTime {
  background: var(--primary);
}
.longBreakTime {
  background: var(--info);
}
```

_Nota: Estamos usando as variáveis de cor de "alerta" (warning, info) que já
definimos no nosso tema global por praticidade._

## 🪄 3. O Desafio: Concatenando Classes no CSS Modules

Agora precisamos aplicar as classes nas bolinhas. O problema: cada bolinha
precisa da classe base (`styles.cycleDot`) E da classe de cor
(`styles.workTime`, por exemplo).

No React, se tentarmos fazer `className={styles.cycleDot styles.workTime}`, vai
dar erro de sintaxe. Para juntar duas variáveis dentro de uma string em
JavaScript/React, usamos a técnica de **Template Literals** (crases e `${}`).

Veja como montamos a sequência do Pomodoro (4 trabalhos, 3 descansos curtos, 1
descanso longo):

**Arquivo:** `src/components/Cycles/index.tsx`

```tsx
import styles from './styles.module.css';

export function Cycles() {
  return (
    <div className={styles.cycles}>
      <span>Ciclos:</span>

      <div className={styles.cycleDots}>
        {/* Usamos ` ${} ${} ` para concatenar as classes do CSS Module */}
        <span className={`${styles.cycleDot} ${styles.workTime}`}></span>
        <span className={`${styles.cycleDot} ${styles.shortBreakTime}`}></span>
        <span className={`${styles.cycleDot} ${styles.workTime}`}></span>
        <span className={`${styles.cycleDot} ${styles.shortBreakTime}`}></span>
        <span className={`${styles.cycleDot} ${styles.workTime}`}></span>
        <span className={`${styles.cycleDot} ${styles.shortBreakTime}`}></span>
        <span className={`${styles.cycleDot} ${styles.workTime}`}></span>
        <span className={`${styles.cycleDot} ${styles.longBreakTime}`}></span>
      </div>
    </div>
  );
}
```

## 🚀 4. Atualizando o App.tsx

Agora é só irmos no nosso `App.tsx`, removermos aquele HTML feio que tínhamos
feito antes e importarmos o nosso novo e lindo componente `<Cycles />`.

**Arquivo:** `src/App.tsx`

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput';
import { Cycles } from './components/Cycles'; // <-- Importado!

import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <>
      <Container>
        <Logo />
      </Container>
      <Container>
        <Menu />
      </Container>
      <Container>
        <CountDown />
      </Container>

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

          {/* Substituímos o HTML antigo pelo nosso componente */}
          <div className='formRow'>
            <Cycles />
          </div>

          <div className='formRow'>
            <button>Enviar</button>
          </div>
        </form>
      </Container>
    </>
  );
}
```

Temos nossos ciclos! Se você inspecionar a tela em dispositivos móveis (`F12`),
verá que os ciclos não quebram o layout e se adaptam super bem.
