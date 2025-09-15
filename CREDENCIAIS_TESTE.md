# 🔐 Credenciais de Teste - MedInventory

## Usuários Pré-cadastrados

### 👨‍💼 Administrador

- **Email:** admin@medinventory.com
- **Senha:** 123456
- **Nome:** João Silva
- **Hospital:** Hospital Central
- **Cargo:** Administrador

### 👩‍⚕️ Enfermeiro

- **Email:** enfermeiro@medinventory.com
- **Senha:** 123456
- **Nome:** Maria Santos
- **Hospital:** Hospital Central
- **Cargo:** Enfermeiro

## 🆕 Criar Nova Conta

Você também pode criar uma nova conta usando o formulário de cadastro com:

- Nome e sobrenome
- Email único
- Senha (mínimo 6 caracteres)
- Hospital/Instituição
- Cargo/Função
- Aceitar termos de uso

## ✨ Funcionalidades Implementadas

### 🔑 Sistema de Autenticação

- ✅ Login com validação de credenciais
- ✅ Cadastro de novos usuários
- ✅ Validação de formulários
- ✅ Simulação de delay de rede
- ✅ Verificação de email duplicado
- ✅ Logout funcional

### 📱 Telas de Autenticação

- ✅ Tela de Login elegante
- ✅ Tela de Cadastro completa
- ✅ Validação em tempo real
- ✅ Feedback visual de loading
- ✅ Navegação entre telas

### 🏠 Dashboard Personalizado

- ✅ Informações do usuário logado
- ✅ Nome e cargo dinâmicos
- ✅ Hospital/instituição exibida
- ✅ Integração com AuthContext

## 🚀 Como Testar

1. **Login com usuário existente:**

   - Use as credenciais acima
   - Veja as informações personalizadas no dashboard

2. **Criar nova conta:**

   - Clique em "Cadastre-se" na tela de login
   - Preencha todos os campos obrigatórios
   - Faça login automaticamente após o cadastro

3. **Testar validações:**
   - Tente fazer login com credenciais incorretas
   - Tente cadastrar com email já existente
   - Teste validações de formulário

## 🔧 Tecnologias Utilizadas

- **React Native** - Framework principal
- **React Context API** - Gerenciamento de estado de autenticação
- **Expo Linear Gradient** - Gradientes visuais
- **React Navigation** - Navegação entre telas
- **Ionicons** - Ícones da interface
- **AsyncStorage** - Persistência de dados (simulada)

## 📝 Notas Importantes

- Este é um sistema de **demonstração** com simulação de backend
- Os dados são armazenados apenas em memória
- Para produção, integre com uma API real
- Implemente criptografia de senhas
- Adicione validação de email mais robusta
- Configure autenticação JWT ou similar
