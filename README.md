# MedInventory App

Um aplicativo React Native profissional para gestão de ativos médicos, desenvolvido especificamente para a área da saúde.

## 🚀 Funcionalidades

- **Dashboard Inteligente**: Visão geral completa dos ativos com métricas em tempo real
- **Busca Avançada**: Sistema de busca e filtros para localizar equipamentos rapidamente
- **Detalhes do Ativo**: Tela completa com informações detalhadas, histórico de manutenção e ações rápidas
- **Sistema de Notificações**: Alertas para manutenções, vencimentos e eventos importantes
- **Perfil do Usuário**: Gerenciamento de conta com configurações e estatísticas pessoais
- **Relatórios Completos**: Geração de relatórios detalhados para gestão e conformidade
- **Navegação Intuitiva**: Interface mobile-first com navegação por tabs
- **Autenticação Segura**: Sistema de login com validação e recuperação de senha
- **Design Profissional**: Tema específico para área da saúde com cores azul e verde
- **Interface Responsiva**: Otimizado para smartphones e tablets

## 📱 Telas Disponíveis

- **Dashboard**: Visão geral com estatísticas, ações rápidas e atividades recentes
- **Buscar Ativos**: Sistema de busca com filtros por status, localização e categoria
- **Detalhes do Ativo**: Informações completas, histórico de manutenção e ações rápidas
- **Notificações**: Sistema de alertas com filtros por tipo e prioridade
- **Relatórios**: Geração de relatórios por categoria (Inventário, Manutenção, Conformidade, Analytics)
- **Perfil**: Gerenciamento de conta com configurações e estatísticas pessoais
- **Login**: Tela de autenticação elegante com design médico
- **Cadastro**: Formulário de registro com validação completa

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desenvolvimento
- **React Navigation**: Navegação com Stack e Bottom Tabs
- **Expo Vector Icons**: Ícones médicos e de interface
- **Expo Linear Gradient**: Gradientes elegantes
- **React Native Safe Area Context**: Área segura para diferentes dispositivos
- **React Native SVG**: Gráficos e elementos vetoriais

## 📦 Instalação

1. **Clone o repositório**:

   ```bash
   git clone <repository-url>
   cd MedInventoryApp
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o app**:

   ```bash
   npm start
   # ou
   yarn start
   ```

4. **Para executar em dispositivos específicos**:

   ```bash
   # Android
   npm run android

   # iOS
   npm run ios

   # Web
   npm run web
   ```

## 🏗️ Estrutura do Projeto

```
src/
├── styles/             # Sistema de design
│   └── theme.js        # Tema e cores específicas para área da saúde
├── contexts/           # Contextos React
│   └── AuthContext.js  # Contexto de autenticação
├── screens/            # Telas principais
│   ├── DashboardScreen.js      # Dashboard principal
│   ├── SearchAssetScreen.js    # Busca de ativos
│   ├── AssetDetailScreen.js    # Detalhes do ativo
│   ├── NotificationsScreen.js  # Sistema de notificações
│   ├── ReportsScreen.js        # Relatórios
│   ├── ProfileScreen.js        # Perfil do usuário
│   ├── LoginScreen.js          # Autenticação
│   ├── SignupScreen.js         # Cadastro
│   └── TermsScreen.js          # Termos e condições
└── assets/             # Recursos estáticos
    └── images/         # Imagens e ícones
```

## 🔧 Configuração

### Dependências Principais

- `@react-navigation/native`: ^7.1.17
- `@react-navigation/stack`: ^7.4.8
- `@react-navigation/bottom-tabs`: ^7.1.17
- `expo`: ~54.0.2
- `expo-linear-gradient`: ^15.0.7
- `@expo/vector-icons`: ^15.0.0
- `react-native-safe-area-context`: ~5.6.0
- `react-native-svg`: 15.8.0

### Scripts Disponíveis

- `start`: Inicia o servidor de desenvolvimento
- `android`: Executa no Android
- `ios`: Executa no iOS
- `web`: Executa no navegador

## 🎨 Design System

### Cores Médicas

- **Primária**: #1976D2 (Azul confiança)
- **Secundária**: #2E7D32 (Verde médico)
- **Sucesso**: #4CAF50
- **Aviso**: #FF9800
- **Erro**: #F44336
- **Background**: #FAFAFA
- **Texto**: #212121

### Tipografia

- **Fonte**: System (nativa)
- **Títulos**: 24-32px, bold
- **Corpo**: 14-16px, regular
- **Labels**: 12-14px, medium

## 🔐 Autenticação

O app inclui um sistema de autenticação profissional com:

- **Login Elegante**: Interface moderna com gradientes e validação
- **Cadastro Completo**: Formulário com validação de senha e campos obrigatórios
- **Context Global**: Gerenciamento de estado de autenticação
- **Navegação Inteligente**: Redirecionamento automático após login
- **Recuperação de Senha**: Funcionalidade para reset de senha
- **Login Social**: Integração com Google (em desenvolvimento)

## 🏥 Funcionalidades Específicas para Área da Saúde

### Dashboard Inteligente

- **Métricas em Tempo Real**: Total de ativos, em manutenção, disponíveis e vencendo
- **Ações Rápidas**: Adicionar ativo, buscar equipamento, gerar relatórios
- **Atividades Recentes**: Histórico de movimentações e manutenções
- **Indicadores Visuais**: Cores e ícones específicos para status médicos

### Sistema de Busca Avançada

- **Filtros Inteligentes**: Por status, localização, categoria e tipo
- **Busca por Texto**: Nome, modelo, número de série, localização
- **Cards Informativos**: Detalhes completos de cada equipamento
- **Navegação para Detalhes**: Acesso direto à tela de detalhes do ativo

### Detalhes do Ativo

- **Informações Completas**: Dados técnicos, financeiros e de manutenção
- **Histórico de Manutenção**: Registro completo de todas as intervenções
- **Ações Rápidas**: Agendar manutenção, gerar QR code, imprimir etiqueta
- **Status Visual**: Indicadores coloridos para diferentes estados
- **Modais Interativos**: Edição e agendamento com interface intuitiva

### Sistema de Notificações

- **Filtros por Tipo**: Manutenção, vencimento, alertas
- **Priorização**: Sistema de cores para urgência (alta, média, baixa)
- **Marcação de Lidas**: Controle de notificações visualizadas
- **Navegação Direta**: Acesso rápido aos ativos relacionados
- **Estatísticas**: Contadores de não lidas e urgentes

### Relatórios Profissionais

- **Inventário**: Lista completa, distribuição geográfica, categorização
- **Manutenção**: Pendências, histórico, análise de custos
- **Conformidade**: Certificações vencidas, próximos vencimentos, status
- **Analytics**: Utilização, tendências, ROI dos ativos

## 📱 Responsividade

O app é totalmente responsivo e se adapta a:

- **Smartphones**: Interface otimizada para uso com uma mão
- **Tablets**: Layout expandido com mais informações visíveis
- **Diferentes Densidades**: Adaptação automática para HD, Full HD, 4K

## 🚀 Próximos Passos

- [ ] Integração com API real
- [ ] Persistência de dados
- [ ] Notificações push
- [ ] Testes automatizados
- [ ] Deploy para app stores

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através dos canais oficiais.
