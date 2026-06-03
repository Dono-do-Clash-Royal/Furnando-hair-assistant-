# ✂️ Haircut Advisor

App que analisa o formato do rosto e sugere cortes de cabelo usando IA.

cd frontend
npm run dev

cd backend
mvn spring-boot:run

## Estrutura
```
haircut-advisor/
├── backend/    → Spring Boot (Java) - porta 8080
└── frontend/   → React (Vite)      - porta 5173
```

---

## Como correr no GitHub Codespaces

### Passo 1 — Criar o repositório
1. Vai a [github.com](https://github.com) e clica em **New repository**
2. Dá o nome `haircut-advisor`
3. Clica em **Create repository**
4. Faz upload de todos estes ficheiros para o repositório

### Passo 2 — Abrir o Codespace
1. No repositório, clica no botão verde **Code**
2. Clica em **Codespaces** > **Create codespace on main**
3. Aguarda ~2 minutos enquanto o ambiente é configurado

### Passo 3 — Adicionar a API Key da Anthropic
A chave da API tem de ficar em segredo — nunca a coloques no código!

1. Vai a [console.anthropic.com](https://console.anthropic.com) e cria uma API key
2. No GitHub, vai a **Settings** > **Codespaces** > **Secrets**
3. Clica em **New secret**
4. Nome: `ANTHROPIC_API_KEY`
5. Valor: a tua chave (começa por `sk-ant-...`)
6. Em "Repository access", seleciona o teu repositório

### Passo 4 — Arrancar o backend
No terminal do Codespace (Terminal > New Terminal):
```bash
cd backend
mvn spring-boot:run
```
Aguarda até ver: `✅ Backend a correr em http://localhost:8080`

### Passo 5 — Arrancar o frontend (novo terminal)
Clica no `+` para abrir um segundo terminal:
```bash
cd frontend
npm run dev
```
O Codespace vai mostrar uma notificação para abrir a porta 5173.
Clica em **Open in Browser**.

### Passo 6 — Testar
1. Carrega uma foto de rosto
2. Responde ao questionário
3. Clica em "Analisar" e aguarda a resposta da IA!

---

## Problemas frequentes

**"ANTHROPIC_API_KEY not found"**
→ Confirma que adicionaste o secret no Passo 3 e **recria** o Codespace

**"Connection refused" ao analisar**
→ Certifica-te que o backend está a correr (Passo 4)

**A foto não envia**
→ Usa uma imagem JPG ou PNG com menos de 10MB
