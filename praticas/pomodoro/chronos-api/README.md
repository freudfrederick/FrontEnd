# Chronos API 🕐

Backend do projeto **Chronos Pomodoro** — uma API REST construída com Express, Prisma e MySQL que gerencia as configurações e o histórico de tarefas do timer.

---

## Como rodar

Antes de tudo, certifique-se que o MySQL está rodando na sua máquina. Depois:

```bash
npm install
npm run dev
```

A API vai subir em **http://localhost:3333**.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```env
DATABASE_URL="mysql://root:root@localhost:3306/pomodoro_db"
PORT=3333
```

---

## Endpoints

### 🏥 Health Check

Serve para confirmar que a API está no ar.

