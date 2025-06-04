# SafeZone Mobile
> **IMPORTANTE:** Para o melhor funcionamento do projeto, recomenda-se utilizar o **emulador Pixel 6 Pro** no Android Studio, pois ele oferece a melhor compatibilidade visual com os componentes utilizados, especialmente os modais e mapas.

Aplicativo desenvolvido para a Global Solution FIAP 2025, com foco em **segurança comunitária em desastres naturais**. Esta solução mobile foi construída com **React Native + Expo**, totalmente integrada a uma **API REST em ASP.NET Core 8**, e projetada para uso tanto por **cidadãos** quanto por **agentes de campo**.

---

## Visão Geral do Projeto

A SafeZone é uma solução que une dados em tempo real, gestão de riscos e apoio à população. O projeto completo é composto por:

*  **App Mobile (este repositório)**
*  **Painel Web com Razor Pages (.NET)**
*  **Dashboard em tempo real**
*  **API RESTful central em ASP.NET Core**

---

##  Funcionalidades do App

###  Login (sem API)

* **Dois perfis**:

  * `Cidadão` (login: `cidadao`, senha: `12345`)
  * `Agente` (login: `agente`, senha: `54321`)
* Após login, o app exibe as telas conforme o perfil e controla permissões dinamicamente.

---

##  Para o Agente:

###  Alertas

* CRUD de alertas emergenciais
* Campos: tipo do alerta, descrição e localização geográfica
* Alertas são exibidos também para o cidadão no mapa

###  Zonas de Risco

* CRUD de zonas afetadas
* Campos: nome, tipo de evento (ex: enchente), coordenadas
* Utilizado para exibição geográfica no mapa

###  Moradores

* CRUD de moradores afetados em zonas de risco
* Campos: nome, CPF, prioridade (Alta, Média, Baixa)

### Kits Emergenciais (Gerenciamento)

* Exibição dos pedidos feitos pelos cidadãos
* Possível **confirmar** ou **excluir** pedidos
* Confirmação remove da fila de pedidos

---

##  Para o Cidadão:

###  Mapa de Risco

* Exibe as zonas e alertas em tempo real com base na localização
* Integração com Google Maps API
* Círculos e marcadores coloridos indicam risco e tipo de alerta

###  Solicitação de Kits

* Formulário para requisitar kits (ex: água, alimento, mantimentos)
* Status do pedido: "Em análise"
* Lista de pedidos com opção de **editar** ou **excluir**

---

##  Tecnologias Utilizadas

###  Frontend

* [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
* Expo Router para navegação
* Axios para chamadas HTTP
* AsyncStorage para controle de login local
* Google Maps API (somente para o mapa de risco)

### Backend/API

* ASP.NET Core 8 com EF Core
* Banco de dados Oracle
* Documentação Swagger/OpenAPI
* Endpoints RESTful com controllers

---

## Link da API no Render
[API .NET](https://dashboard.render.com/web/srv-d0vhjpu3jp1c73e792sg)

## Instalação e Execução

```bash
git clone https://github.com/tcguus/SafeZone-Mobile.git
cd SafeZone-Mobile
npm install
npx expo start
```

**Login de Teste:**

* Agente: `agente` / `54321`
* Cidadão: `cidadao` / `12345`

---

## Nossos integrantes
- **Gustavo Camargo de Andrade**
- RM555562
- 2TDSPF
-------------------------------------------
- **Rodrigo Souza Mantovanello**
- RM555451
- 2TDSPF
-------------------------------------------
- **Leonardo Cesar Rodrigues Nascimento**
- RM558373
- 2TDSPF
