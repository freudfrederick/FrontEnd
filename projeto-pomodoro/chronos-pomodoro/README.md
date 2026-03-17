# ⌨️ Construindo o Componente de Input e Dominando TypeScript

Agora vamos começar a extrair os elementos do nosso formulário para componentes
independentes. O primeiro será o Input!

Se você reparar no design original do projeto, os inputs da tela principal
(Home) e os inputs da tela de configurações são visualmente idênticos. A única
diferença é a cor interna. Isso é o cenário perfeito para criarmos um componente
reutilizável!

Nesta aula, não vamos focar tanto no CSS, mas sim na estrutura do componente e
em conceitos essenciais de **TypeScript**.

---

## 🏗️ 1. Extraindo o Componente Input

Vamos criar um novo componente chamado `DefaultInput` (você pode chamar só de
`Input` se preferir, mas `DefaultInput` ajuda a evitar confusões com a tag HTML
padrão).

Como o nosso Input sempre vem acompanhado de uma `<label>`, vamos retornar os
dois elementos juntos. Porém, o React/JSX não permite retornar dois elementos
irmãos soltos (sem um "pai" em volta).

Para resolver isso sem adicionar `<div>`s desnecessárias que podem quebrar o
layout, usamos o **Fragmento (`<> </>`)**.

**Arquivo:** `src/components/DefaultInput/index.tsx`

```tsx
export function DefaultInput() {
  return (
    // Fragmento (<> ... </>) agrupa os elementos sem criar tags extras no HTML
    <>
      <label htmlFor='meuInput'>task</label>
      <input id='meuInput' type='text' />
    </>
  );
}
```

## 🧠 2. Tipando Propriedades com TypeScript

Se deixarmos o código como acima, o nosso input será engessado: o `id` sempre
será "meuInput" e o `type` sempre será "text". Nós precisamos receber essas
informações dinamicamente através das **props**.

## ❌ O problema de tipar tudo manualmente

Poderíamos criar um tipo simples como fazíamos antes:

```tsx
type DefaultInputProps = {
  id: string;
  type: string; // Isso aceitaria qualquer palavra, até type="blabla", o que quebraria o HTML!
};
```

### 🔀 Solução Parcial: Union Types (`|`)

Para evitar que o desenvolvedor passe tipos inválidos, poderíamos usar os
**Union Types** do TypeScript. O caracter Pipe (`|`) funciona como um operador
"OU".

```tsx
type DefaultInputProps = {
  // O tipo será 'text' OU 'number' OU 'search'
  type: 'text' | 'number' | 'search';
};
```

Isso é muito mais seguro! Se tentarmos passar `type="blabla"`, o TypeScript vai
dar erro.

Porém, a tag `<input>` do HTML possui mais de 300 propriedades possíveis
(`placeholder`, `onChange`, `onBlur`, `disabled`, `required`, etc.). Não faz
sentido digitarmos todas elas na mão, certo?

## 🪄 3. O Truque de Mestre: Intersection Types (`&`) e `ComponentProps`

Para herdar **todas** as propriedades nativas que uma tag HTML já possui, o
React nos fornece uma tipagem chamada `React.ComponentProps<'tag'>`.

E para juntarmos as propriedades nativas com as nossas propriedades
customizadas, usamos o **Intersection Type**. O caracter "E comercial" (`&`)
funciona como um operador "E" (junta tudo).

Veja como fica a tipagem profissional do nosso componente:

**Arquivo:** `src/components/DefaultInput/index.tsx`

```tsx
import React from 'react';

// O nosso tipo terá:
// 1. A nossa prop customizada "id" (forçando ela a ser obrigatória como string)
// & (E)
// 2. Todas as props que um <input> normal já aceita (type, placeholder, onChange...)
type DefaultInputProps = {
  id: string;
} & React.ComponentProps<'input'>;

// Desestruturamos apenas o id e o type por enquanto
export function DefaultInput({ id, type }: DefaultInputProps) {
  return (
    <>
      <label htmlFor={id}>task</label>
      <input id={id} type={type} />
    </>
  );
}
```

💡 **Dica:** Ao forçar o `id: string` no nosso tipo, garantimos que o
desenvolvedor **nunca esqueça** de passar o `id`. Sem ele, nossa `<label>`
perderia a conexão de acessibilidade com o `<input>`!

## 🧩 4. Usando o Componente Tipado

Agora vamos importar o nosso super componente lá no `App.tsx` e substituir o
HTML antigo.

Se você digitar `type=""` no VS Code, perceberá que o autocompletar
(IntelliSense) vai sugerir inteligentemente todos os tipos reais de input do
HTML (password, email, number, etc.), graças à nossa tipagem avançada!

**Arquivo:** `src/App.tsx`

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput'; // <-- Importado

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
            {/* O TypeScript nos obriga a passar o "id" aqui! */}
            <DefaultInput id='meuInput' type='text' />
          </div>

          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          <div className='formRow'>
            <p>Ciclos</p>
            <p>0 0 0 0 0 0 0</p>
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
