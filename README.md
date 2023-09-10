# DrivenPass - Gerenciador de Senhas
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Descrição
O DrivenPass é um gerenciador de senhas projetado para proteger suas informações confidenciais na era digital. Com o aumento constante de ameaças virtuais, é essencial manter senhas seguras e únicas para cada conta online. No entanto, lembrar senhas complexas e longas pode ser um desafio. O DrivenPass resolve esse problema permitindo que você armazene todas as suas senhas de forma segura e lembre-se apenas de uma senha mestra, que também deve ser forte e segura.

A versão demo para testes do DrivenPass pode acessada em [https://drivenpass-22qv.onrender.com](https://drivenpass-22qv.onrender.com).

## Sobre

O DrivenPass é inspirado em gerenciadores de senha populares, como 1Password, BitWarden e LastPass. Sua missão é fornecer uma solução confiável para proteger suas credenciais online e simplificar sua vida digital. Algumas das principais funcionalidades do DrivenPass incluem:

- Armazenamento seguro de senhas e credenciais com criptografia avançada.
- Armazenamento seguro de dados de cartão com criptografia avançada.
- Armazenamento seguro de notas pessoais.
- Acesso rápido às suas senhas com uma senha mestra.
- Acesso seguro em diversos navegadores e dispositivos.

Este projeto foi motivado pela crescente necessidade de segurança cibernética e pela paixão em criar soluções que tornem a vida digital mais segura e conveniente. O objetivo do projeto é continuar aprimorando o DrivenPass e adicionar recursos como novos tipos de dados seguros e a geração de senhas seguras.

### Próximos passos

- Implementação de autenticação de dois fatores utilizando aplicativos moveis.
- Geração de senhas seguras.
- Adição de gerenciamento de chaves de API e outros recursos sensiveis.

## Tecnologias
- NestJS: O DrivenPass é uma API REST desenvolvida utilizando o framework NestJS, que oferece uma estrutura robusta para construir aplicativos web escaláveis.
- Postgres: Os dados são persistidos em um banco de dados relacional PostgreSQL, visando a confiabilidade, performance e escalabilidade do sistema.
- TypeScript: A linguagem TypeScript nos permite escrever código mais seguro e legível, facilitando a manutenção do projeto.

## Instalação

Para executar o DrivenPass localmente, siga estas etapas:

1. Certifique-se de ter o Node.Js e o Postgres instalados.

2. Clone o projeto no seu computador:
```bash
git clone https://github.com/kadioba/projeto23-drivenpass-nest
cd projeto23-drivenpass-nest
```

3. Instale as dependências do projeto:
```bash
npm install
```
4. Configure as variáveis de ambiente necessárias, como a chave de criptografia e as configurações de banco de dados, no arquivo `.env`.

## Rodando o projeto

```bash
# desenvolvimento
$ npm run start

# modo de depuração
$ npm run start:dev

# modo de produção
$ npm run start:prod
```

Agora você pode acessar o DrivenPass em http://localhost:3000 e começar a usar seu gerenciador de senhas seguro!

## Testes

```bash
# testes unitários
$ npm run test

# testes de integração
$ npm run test:e2e

# cobertura de testes
$ npm run test:cov
```
