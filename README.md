# **User-Auth API**

## **Descrição**

A **User-Auth API** é uma API para um sistema de autenticação de usuários, projetada para fornecer funcionalidades completas de gerenciamento de usuários, incluindo autenticação segura. Este projeto é parte de um portfólio profissional, demonstrando proficiência em NodeJS, bancos de dados NoSQL, e tecnologias de DevOps como Docker e Cloud.

## **Motivação**

O objetivo deste projeto é criar um portfólio que demonstre habilidades técnicas avançadas em desenvolvimento backend com NodeJS e MongoDB, além de destacar o domínio de práticas DevOps através do uso de Docker e implementação em ambientes de Cloud, como o Vercel.

## **Tecnologias Utilizadas**

- **Linguagem**: Typescript
- **Tecnologias**: NodeJS, Docker, Vercel, MongoDB
- **Bibliotecas**: Express, Bcrypt, JWT, BodyParser

## **Requisitos de Sistema**

(Preencher posteriormente)

## **Como Rodar o Projeto**

(Preencher posteriormente)

## **Funcionalidades**

- **CRUD Completo de Usuários**
  - Criação, leitura, atualização e exclusão de usuários.
- **Autenticação**
  - Implementação de autenticação com JSON Web Tokens (JWT).
  
## **Estrutura do Projeto**

O projeto segue padrões e princípios sólidos de engenharia de software para garantir manutenibilidade e escalabilidade:

- **Patterns Adotados**:
  - **Domain-Driven Design (DDD)**
  - **Repository Pattern**
  - **CQRS (Command Query Responsibility Segregation)**

- **Princípios**:
  - **SOLID**
  - **Clean Architecture**

- **Camadas DDD**:
  - **Presentation**: Recebe solicitações dos usuários, chama serviços da aplicação, e retorna respostas. Lida com a interação do mundo externo com a aplicação.

  - **Application**:  Orquestra casos de uso, coordenando a lógica de domínio e gerenciando fluxos de trabalho, sem conter lógica de negócio.

  - **Domain**: Contém a lógica de negócio central, definindo regras e conceitos do problema que o sistema resolve, independente de infraestrutura.

  - **Data**: Gerencia a persistência e comunicação com bancos de dados e serviços externos, implementando os repositórios definidos na camada de domínio.

## **Autores**

- **Cainã da Costa Jucá**

## **Referências e Links**

(Preencher posteriormente)


Apagar abaixo:
		"build": "yarn workspaces run build",
		"lint": "yarn workspaces run lint",
		"test": "yarn workspaces run test",
		"start": "yarn workspace @user-auth/1-presentation start",
		"dev": "yarn workspace @user-auth/1-presentation dev",
		"clean": "yarn workspaces run clean && rm -rf node_modules"
