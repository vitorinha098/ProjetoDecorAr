# DecorAR - Aplicação de Decoração Virtual

## Visão Geral
DecorAR é uma aplicação web moderna e minimalista que permite aos utilizadores fazer upload de fotos das suas divisões e decorá-las virtualmente com móveis. A aplicação oferece uma experiência intuitiva de arrastar e soltar, com uma biblioteca curada de móveis e controlos de propriedades em tempo real.

## Arquitetura do Projeto

### Stack Tecnológico
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **UI**: Tailwind CSS + Shadcn UI
- **Estado**: TanStack Query (React Query)
- **Routing**: Wouter
- **Storage**: In-memory (MemStorage)

### Estrutura de Diretórios
```
client/
  src/
    components/     # Componentes React reutilizáveis
      DecorCanvas.tsx       # Canvas de edição com drag & drop
      FurnitureLibrary.tsx  # Biblioteca de móveis com filtros
      PropertiesPanel.tsx   # Painel de propriedades (rotação, tamanho)
      Toolbar.tsx           # Barra de ferramentas principal
      UploadZone.tsx        # Zona de upload drag & drop
      ThemeProvider.tsx     # Gestão de tema claro/escuro
      ThemeToggle.tsx       # Botão toggle de tema
    pages/
      Home.tsx             # Página principal da aplicação
    lib/                   # Utilitários
server/
  routes.ts              # Rotas da API
  storage.ts             # Camada de armazenamento
shared/
  schema.ts              # Schemas partilhados (Drizzle + Zod)
attached_assets/
  generated_images/      # Imagens de móveis geradas
```

## Funcionalidades Implementadas

### Fase 1: Schema & Frontend ✅
- ✅ Schema de dados (Furniture, Projects, CanvasFurnitureItem)
- ✅ Geração de 8 imagens de móveis profissionais
- ✅ Design system configurado (Inter + Plus Jakarta Sans)
- ✅ Tema claro/escuro funcional
- ✅ Componente FurnitureLibrary com busca e filtros por categoria
- ✅ Componente UploadZone com drag & drop
- ✅ Componente DecorCanvas com manipulação de móveis
- ✅ Componente PropertiesPanel com sliders para rotação/tamanho
- ✅ Componente Toolbar com ações principais
- ✅ Sistema de histórico (Undo/Redo)
- ✅ Layout responsivo de 3 painéis

### Próximas Fases
- Fase 2: Backend - API endpoints para guardar/carregar projetos, upload de imagens
- Fase 3: Integração - Ligar frontend ao backend, estados de loading/erro

## Design Guidelines
O design segue princípios inspirados em Canva, Pinterest, IKEA e Figma:
- Layout de 3 painéis: Sidebar esquerda (280px), Canvas central (flexível), Painel direito (300px)
- Tipografia: Inter para UI, Plus Jakarta Sans para headings
- Espaçamento consistente: p-2, p-4, p-6, p-8
- Animações subtis e transições suaves
- Tema claro/escuro com variáveis CSS

## Categorias de Móveis
- **Sala** (living): Sofás, mesas de centro, mesas de jantar
- **Quarto** (bedroom): Camas, mesas de cabeceira
- **Escritório** (office): Secretárias, estantes
- **Decoração** (decor): Candeeiros, plantas

## User Journeys Principais
1. **Upload → Decorar → Guardar**
   - Utilizador faz upload de foto da divisão
   - Adiciona móveis da biblioteca através de clique
   - Manipula posição, tamanho e rotação
   - Guarda o projeto

2. **Editar → Exportar**
   - Ajusta propriedades dos móveis no painel direito
   - Usa Undo/Redo para reverter alterações
   - Faz download da imagem final

## Estado do Desenvolvimento
**Status Atual**: Fase 1 completa - Frontend totalmente implementado com design excecional
**Próximo Passo**: Implementar backend (Fase 2)

## Alterações Recentes
- 2025-11-05: Criação inicial do projeto com todos os componentes frontend
- 2025-11-05: Geração de 8 imagens de móveis profissionais
- 2025-11-05: Configuração do design system e tema claro/escuro
