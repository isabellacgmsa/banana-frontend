# Front-end: Agenda de Reservas - Banana Ltda

Este repositório contém a interface de usuário (SPA) do Sistema de Gestão de Reservas de Salas da Banana Ltda. A aplicação consome dois microsserviços distintos (Autenticação em C# e Negócios em Python) de forma transparente e segura.

## Funcionalidades e Diferenciais (Bônus Implementados)

Além do CRUD completo exigido pelo escopo principal, este front-end entrega funcionalidades avançadas:

* **Segurança com Refresh Token (Bônus):** Implementação de um interceptor no Axios que identifica quando o JWT (de curta duração) expira e solicita automaticamente um novo token usando o Refresh Token, garantindo que o usuário não perca a sessão no meio de uma operação.
* **Exclusão em Lote (Bônus):** Seleção múltipla de reservas via checkboxes na tabela para deleção em massa, otimizando o tempo do usuário.
* **Geração de Comprovantes (PDF):** Utilização da biblioteca `jsPDF` para gerar relatórios e protocolos de reserva formatados e prontos para impressão.
* **Validação de Calendário:** Bloqueio de datas passadas no componente DatePicker para evitar inconsistências de negócio logo na camada visual.
* **UX/UI:** Layout responsivo, padronização visual com as cores da marca, feedback visual (tooltips com ellipsis para textos longos) e uso inteligente de Tags e espaçamentos.

## Tecnologias Utilizadas

* **React + TypeScript (Vite):** Escolhidos pela alta performance de build e segurança na tipagem estática.
* **Ant Design (antd):** Biblioteca madura de componentes visuais, agilizando a criação de formulários complexos e tabelas de dados.
* **Axios:** Cliente HTTP configurado com múltiplas instâncias e interceptors para gerenciamento autônomo de cabeçalhos de autorização.
* **Day.js:** Manipulação leve e eficiente de datas e fusos horários.
* **React Router Dom:** Gerenciamento de navegação e proteção de rotas privadas.

## ⚙️ Variáveis de Ambiente e Configuração

As instâncias de conexão estão separadas em `src/services/api.ts` apontando para os ambientes de desenvolvimento local:

* `apiAuth` (C#): `http://localhost:5143/api`
* `apiReservas` (Python): `http://localhost:8000/api`

## 🏁 Como rodar o projeto localmente

1. Certifique-se de ter o **Node.js** (v20+) instalado.
2. Clone este repositório.
3. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`
4. Inicie o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Acesse no seu navegador o endereço (geralmente `http://localhost:5173`).