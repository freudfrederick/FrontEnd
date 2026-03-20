import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

console.log("oi");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <>
      <h1>Bem-vindo a primeira aula de ReactJS</h1>,
      <h2>Nossa aula de introdução</h2>
    </>
  </StrictMode>,
);
