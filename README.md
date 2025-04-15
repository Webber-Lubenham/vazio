# Vazio - Sistema de Monitoramento de Localização

Um sistema moderno de monitoramento de localização construído com TypeScript, Express e React, projetado para permitir que responsáveis acompanhem a localização de seus dependentes em tempo real.

## Objetivos do Sistema

- Fornecer localização em tempo real para responsáveis
- Garantir a segurança e bem-estar dos dependentes
- Permitir o acompanhamento de rotas e trajetos
- Notificar responsáveis em caso de desvios de rota
- Manter histórico de localizações

## Funcionalidades Principais

### Sistema de Autenticação
- **Cadastro de Usuários**
  - Responsáveis podem se cadastrar com email, nome completo e senha
  - Dependentes são cadastrados pelos responsáveis
  - Validação de dados e verificação de email
  - Senhas são criptografadas para segurança

- **Login**
  - Autenticação segura com JWT
  - Diferentes níveis de acesso (responsável, dependente)
  - Recuperação de senha via email
  - Sessões persistentes com refresh tokens

### Dashboard do Responsável
- **Visão Geral**
  - Mapa com localização em tempo real dos dependentes
  - Histórico de localizações
  - Status atual de cada dependente
  - Notificações de desvios de rota

- **Funcionalidades**
  - Visualização de localização em tempo real
  - Definição de zonas seguras
  - Configuração de rotas permitidas
  - Histórico de deslocamentos
  - Alertas de emergência

- **Recursos Adicionais**
  - Compartilhamento de localização com outros responsáveis
  - Relatórios de deslocamento
  - Configuração de horários de monitoramento
  - Sistema de alertas personalizáveis

## Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL
- npm ou yarn

## Configuração

1. Clone o repositório:
```bash
git clone https://github.com/yourusername/vazio.git
cd vazio
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Configure o banco de dados:
```bash
npm run db:migrate
```

5. Inicie os servidores de desenvolvimento:
```bash
# Inicie o servidor backend
npm run dev:server

# Em um novo terminal, inicie o frontend
npm run dev:client
```

## Estrutura do Projeto

```
vazio/
├── src/
│   ├── client/          # Aplicação React frontend
│   ├── server/          # Aplicação Express backend
│   ├── db/              # Configuração e migrações do banco de dados
│   ├── services/        # Lógica de negócios
│   ├── utils/           # Funções utilitárias
│   └── types/           # Definições de tipos TypeScript
├── package.json
└── README.md
```

## Scripts Disponíveis

- `npm run dev:server` - Inicia o servidor backend de desenvolvimento
- `npm run dev:client` - Inicia o frontend de desenvolvimento
- `npm run build` - Compila tanto o frontend quanto o backend
- `npm run db:migrate` - Executa as migrações do banco de dados
- `npm run test` - Executa os testes
- `npm run lint` - Executa o linter

## Contribuição

1. Faça um fork do repositório
2. Crie sua branch de feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Webber Lubenham - [@seu_twitter](https://twitter.com/seu_twitter)

Link do projeto: [https://github.com/Webber-Lubenham/vazio](https://github.com/Webber-Lubenham/vazio)
