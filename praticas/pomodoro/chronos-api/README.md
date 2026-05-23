# Chronos API

Backend do projeto **Chronos Pomodoro** — uma API REST construída com Express, Prisma e MySQL que gerencia as configurações e o histórico de tarefas do timer.

---

## Como rodar

Antes de tudo, certifique-se que o MySQL está rodando na sua máquina. Depois instale as dependências e suba o servidor:

    npm install
    npm run dev

A API vai subir em http://localhost:3333.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

    DATABASE_URL="mysql://root:root@localhost:3306/pomodoro_db"
    PORT=3333

---

## Endpoints

### Health Check

Serve para confirmar que a API está no ar.

    GET /health

Resposta:

    { "ok": true }

---

### Settings

As configurações do timer ficam salvas no banco e são carregadas pelo frontend sempre que o app abre. Se ainda não existirem, são criadas automaticamente com os valores padrão de 25 minutos de foco, 5 de pausa curta e 15 de pausa longa.

**Buscar configurações**

    GET /settings

**Atualizar configurações**

    PUT /settings

Body esperado:

    {
      "workTime": 25,
      "shortBreakTime": 5,
      "longBreakTime": 15
    }

Todos os campos são obrigatórios e precisam ser números inteiros. Retorna 400 se algum valor for inválido.

---

### Tasks

Cada ciclo do Pomodoro gera uma task. Ela começa sem data de conclusão e é atualizada conforme o usuário completa ou interrompe o timer.

**Listar tarefas**

    GET /tasks

Retorna todas as tarefas ordenadas da mais recente para a mais antiga.

**Criar tarefa**

    POST /tasks

Body esperado:

    {
      "id": "1716123456789",
      "name": "Estudar React",
      "duration": 25,
      "type": "workTime",
      "startDate": 1716123456789
    }

Retorna status 201 com a task criada.

**Marcar como concluída**

    PATCH /tasks/:id/complete

Body esperado:

    {
      "completeDate": 1716125056789
    }

Chamado automaticamente quando o timer zera.

**Marcar como interrompida**

    PATCH /tasks/:id/interrupt

Body esperado:

    {
      "interruptDate": 1716124056789
    }

Chamado quando o usuário clica no botão de parar.

**Limpar histórico**

    DELETE /tasks

Remove todas as tarefas do banco. Retorna 204 sem corpo.

---

## Estrutura do projeto

    chronos-api/
    +-- prisma/
    |   +-- schema.prisma       # Modelos do banco (Settings e Task)
    |   +-- migrations/         # Historico de migracoes
    +-- src/
    |   +-- lib/
    |   |   +-- prisma.ts       # Instancia do Prisma Client
    |   +-- routes/
    |   |   +-- settings.routes.ts
    |   |   +-- tasks.routes.ts
    |   +-- app.ts              # Configuracao do Express
    |   +-- server.ts           # Inicializacao do servidor
    +-- .env
    +-- package.json

---

## Tecnologias

- Node.js + TypeScript
- Express — framework HTTP
- Prisma ORM — acesso ao banco com tipagem
- MySQL — banco de dados relacional
- tsx — execucao de TypeScript em desenvolvimento
