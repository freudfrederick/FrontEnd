# 🎨 Estilização Global no React

Nesta aula, vamos aprender como adicionar e organizar o CSS na nossa aplicação
React. Inicialmente, focaremos no **CSS Global** (sem escopo), ou seja, estilos
que são aplicados a qualquer elemento da página.

_(Nota: O uso de CSS com escopo, utilizando CSS Modules, será abordado na
próxima aula)._

---

## 🌍 1. Entendendo o CSS Global no React

O React não é um framework rígido, o que significa que você tem a liberdade de
organizar seus estilos da maneira que preferir.

A forma mais básica de adicionar estilo a um componente (como o `App.jsx`) é
criar um arquivo CSS com o mesmo nome (ex: `App.css`) e importá-lo diretamente
no arquivo JavaScript.

**Atenção:** Qualquer CSS importado dessa forma padrão vaza para a aplicação
inteira. Se você estilizar o `<body>` ou a tag `<h1>`, isso afetará todas as
páginas do seu projeto.

---

## 🗂️ 2. Organizando a Estrutura de Estilos (Boa Prática)

Para evitar arquivos CSS gigantes e desorganizados, uma excelente prática
adotada por muitos times é separar as **variáveis de tema** dos **estilos
globais genéricos**.

Vamos criar a seguinte estrutura de pastas e arquivos dentro de `src/`:

```text
src/
└── styles/
    ├── theme.css
    └── global.css
```

## 🎨 3. Criando Variáveis de Tema (theme.css)

O arquivo `theme.css` servirá exclusivamente para armazenar nossas variáveis CSS
puras (cores, espaçamentos, tipografia). Isso facilitará muito a criação de
temas (como Claro/Escuro) no futuro.

Abra o arquivo `src/styles/theme.css` e crie sua primeira variável:

```css
/* src/styles/theme.css */
:root {
  --primary: pink;
}
```

## 💅 4. Aplicando o Estilo Global (global.css)

O arquivo `global.css` será usado para resetar margens, definir fontes padrão e
estilizar tags base do HTML (`body`, `h1`, `a`, `p`, etc.).

Aqui, nós já podemos utilizar as variáveis que criamos no arquivo de tema. Abra
o `src/styles/global.css` e adicione:

```css
/* src/styles/global.css */
body {
  font-family: sans-serif;
  font-size: 30px;
}

h1 {
  color: var(--primary); /* Consumindo a variável pink criada no theme.css */
}
```

## 🔗 5. Importando os Estilos no Componente

Agora que temos nossos estilos separados, precisamos avisar ao React para
carregá-los. Faremos isso no nosso componente principal (`App.jsx` ou
`App.tsx`).

⚠️ **MUITO IMPORTANTE: A ordem de importação importa!** > Como o `global.css`
utiliza variáveis que estão no `theme.css`, o arquivo de tema **deve ser
importado primeiro**.

Abra o seu arquivo `App.jsx` e adicione as importações no topo:

```javascript
// src/App.jsx

// 1º: Importamos as variáveis (o tema)
import './styles/theme.css';
// 2º: Importamos os estilos globais
import './styles/global.css';

export function App() {
  return (
    <>
      <h1>Olá, Mundo!</h1>
      <p>Testando o CSS Global.</p>
    </>
  );
}
```

## 🐛 6. Dica de Ouro: Leia os Erros!

Ao mover arquivos ou apagar arquivos CSS antigos (como o `App.css` padrão que
vem no Vite), o React pode apresentar uma **tela em branco** no navegador ou
exibir um grande erro vermelho.

Sempre que isso acontecer:

1. Olhe a tela do navegador.
2. Olhe o terminal onde o servidor (`npm run dev`) está rodando.
3. **Leia a mensagem de erro!** Geralmente, o erro informará que você está
   tentando importar um arquivo CSS que não existe mais no caminho especificado.
   Basta corrigir o caminho no comando `import` para resolver.
