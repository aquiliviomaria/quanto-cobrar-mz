# Quanto Cobrar MZ

**Saiba quanto cobrar. Venda sem prejuízo.**

Aplicação mobile Android para precificação inteligente de produtos e serviços, desenvolvida para pequenos empreendedores em Moçambique.

---

## Sobre o projecto

O **Quanto Cobrar MZ** resolve um problema real: pequenos negócios que cobram "no olho", sem saber o custo real dos seus produtos. A app calcula automaticamente o custo de produção, sugere o preço de venda com margem de lucro, e gera orçamentos profissionais.

**Público-alvo:** Confeiteiras, costureiras, salões de beleza, decoradores, técnicos e outros prestadores de serviços em Moçambique.

---

## Funcionalidades

- **Gestão de Insumos** — Regista ingredientes e materiais com custo unitário automático
- **Produtos / Serviços** — Cria receitas com insumos, calcula custo total
- **Conversor de Medidas** — Converte medidas caseiras (chávenas, colheres) para gramas/ml
- **Calculadora de Preço** — Custo + margem de lucro = preço sugerido
- **Orçamentos** — Gera orçamentos com descrição do pedido
- **Partilha** — Envia orçamento por mensagem ou PDF profissional
- **Histórico** — Registo de todos os orçamentos com status
- **Multi-conta** — Cada utilizador tem os seus próprios dados isolados
- **Offline** — Funciona sem internet (SQLite local)
- **Moeda MZN** — Tudo em Meticais (MT)

---

## Stack técnica

| Tecnologia | Versão |
|---|---|
| React Native | 0.79+ |
| Expo | ~53.0 |
| expo-sqlite | ~15.x |
| Zustand | ^4.5 |
| React Hook Form | ^7.51 |
| Zod | ^3.23 |
| @expo/vector-icons | ^15 |
| expo-print | ~15.x |
| expo-sharing | ~14.x |

---

## Estrutura do projecto

```
src/
├── assets/images/        # Logo QCMZ e Ku_kulaDevz
├── components/
│   ├── common/           # CustomInput, CustomButton, SelectPicker, etc.
│   └── produtos/         # InsumoSelectorModal
├── database/             # SQLite schema e migrations
├── navigation/           # AppNavigator (auth + tabs)
├── screens/
│   ├── auth/             # Login, Registar
│   ├── home/             # Dashboard
│   ├── insumos/          # Lista e formulário
│   ├── produtos/         # Lista e formulário
│   ├── orcamentos/       # Novo orçamento, resultado, histórico
│   ├── configuracoes/    # Perfil, senha, preferências
│   └── conversor/        # Conversor de medidas caseiras
├── services/             # Lógica de negócio e acesso à DB
├── store/                # Zustand stores
├── theme/                # Cores e tipografia
├── types/                # TypeScript interfaces
└── utils/                # Conversões, moeda, constantes
```

---

## Base de dados (SQLite)

| Tabela | Descrição |
|---|---|
| `utilizadores` | Contas de utilizador |
| `insumos` | Ingredientes e materiais por utilizador |
| `produtos` | Produtos/serviços por utilizador |
| `produto_insumos` | Relação produto ↔ insumos com custo calculado |
| `orcamentos` | Orçamentos gerados por utilizador |
| `configuracoes` | Preferências globais |

---

## Como correr localmente

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Iniciar o servidor de desenvolvimento
npx expo start --offline

# Gerar APK para distribuição manual
eas build -p android --profile preview

# Gerar AAB para Google Play
eas build -p android --profile production
```

---

## Ícones da app

| Ficheiro | Tamanho | Uso |
|---|---|---|
| `assets/icon.png` | 1024×1024 | Ícone principal (iOS + Android) |
| `assets/adaptive-icon.png` | 1024×1024 | Adaptive icon Android (com margem para não ser cortado) |
| `assets/splash-icon.png` | 1024×1024 | Ecrã de splash |



---

## Desenvolvido por

**Ku_kulaDevz**

---

*Quanto Cobrar MZ — Calcule o preço certo. Venda com lucro.*
