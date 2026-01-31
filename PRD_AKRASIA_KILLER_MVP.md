# 📋 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## AKRASIA KILLER - MVP (8-10 semanas)

**Data**: 31 de Janeiro de 2026
**Versão**: 1.0 - PRD Estratégico
**Status**: ✅ PRONTO PARA DESENVOLVIMENTO
**Product Manager**: Morgan (@pm)

---

## 🎯 EXECUTIVE SUMMARY

### Visão do Produto
**Akrasia Killer** é um **Sistema Operacional de Soberania Pessoal** focado em transformação duradoura de hábitos alimentares através de transformação de identidade, não apenas mudança comportamental.

### Diferencial Competitivo
1. **Motor Logístico**: Transforma PDFs nutricionais complexos em protocolos executáveis (< 120 minutos)
2. **Gerador de Cardápio Regional**: IA respeta regionalidade do Brasil (ingredientes acessíveis por CEP)
3. **Identidade-First**: Gamificação conecta diretamente à transformação de identidade (não peso/calorias)
4. **Neurociência Aplicada**: 12 frameworks de neurociência + leis do hábito + transformação de identidade integrados

### Target User
- **Perfil**: Pessoas com hábitos alimentares ruins que desejam **mudança duradoura**
- **Motivação**: Interesse em **desenvolvimento pessoal** + transformação de identidade
- **Problema**: Tentaram dietas, falharam; buscam abordagem diferente baseada em "quem eu preciso ser"
- **TAM**: Brasil urbano, classe B+, interessado em saúde e crescimento pessoal

### MVP Scope
- **Timeline**: 8-10 semanas até lançamento
- **Plataforma**: MVP em Web (expandir mobile em Phase 2)
- **Público Inicial**: Beta testers + comunidade (amigos, conhecidos, redes sociais)

---

## 📊 PRODUCT OVERVIEW

### Componentes Principais do MVP

#### 1. **Leitor de PDF + Motor Logístico**
- Upload de PDF nutricionais do profissional
- IA (Claude) lê PDF via OCR e transforma em "Protocolo Executável"
- Transforma receitas/refeições em **passos binários** (Mise en Place → Marinada → Forno → Corte → Montagem)
- Objetivo: Reduzir carga cognitiva ("não cozinho, executo protocolo")

#### 2. **Gerador de Cardápio (Para quem não tem PDF)**
- Quiz: Objetivo + Restrições + Preferências + CEP
- IA gera cardápio **respeitando regionalidade** (ingredientes acessíveis por região)
- Usa Templates regionais como base
- Resultado: Cardápio customizado pronto para Motor Logístico

#### 3. **Motor de Execução - Preparo Semanal**
- Timer + Notificações + Checklist integrados
- Domingo (horário customizável): "Protocolo de Preparo da Semana"
- Exemplo: "10:00 - Mise en Place (10min) ✓ | 10:10 - Frango Marinando (15min) ✓"
- Recompensa: Badge "Mestre do Preparo" após completar
- Resultado: Refeições pré-prontas para semana inteira

#### 4. **Rastreamento Diário - Grid de Consistência**
- **Domingo**: Marca "Executei Protocolo" (recompensa grande)
- **Segunda-Domingo**: Marca "Seguei Plano" (recompensa pequena)
- Visual: Grid tipo Duolingo (■■■■■■□)
- Narrativa Progressiva:
  - Dia 7: "Primeira Chama" 🔥
  - Dia 21: "Ponto de Não Retorno" 🌊
  - Dia 66: "Soberania Pessoal" 👑

#### 5. **4 Features de Transformação de Identidade**

**Feature 1: Mapeamento da Tríade**
- Usuário registra: Comportamento (o que fez) + Cognição (o que pensou) + Afeto (o que sentiu)
- App conecta padrões ("Quando você se sente ansioso, sempre pensa 'preciso de comida'")
- Objetivo: Entender a dinâmica completa, não só o comportamento

**Feature 2: Entenda Sua Origem**
- Quiz sobre Personalidade (5 traços) + História de Vida (traumas, validações, aprendizados)
- App mostra: "Você tem essa personalidade + essa história = essa identidade alimentar"
- Impacto: Reduz culpa ("não é fraqueza, é sua identidade formada")

**Feature 3: Rastreador de Ciclo**
- Acompanha progressão: Crenças → Tríade → Hábitos → Identidade
- App mostra em qual fase o usuário está
- Cada dia registrado = passo rumo à nova identidade
- Mensagens: "Dia 30: Seu hábito está se tornando automático"

**Feature 4: Seu Projeto de Vida**
- 5 passos: (1) Descreva identidade atual (2) Descreva identidade ideal (3) Hábitos dessa pessoa (4) Escolha 1 hábito para hoje (5) Rastreie 66 dias
- Conecta: "Você bebeu água. A pessoa que quer ser faria isso? Sim!"
- Dashboard: Mostra progresso rumo à "pessoa que quer ser"

---

## 🔄 USER JOURNEY - MVP

### Dia 1: Onboarding

**Escolha 1: Com PDF do Nutricionista**
```
1. "Tenho PDF do meu nutricionista"
   ↓
2. Upload do PDF
   ↓
3. Motor Logístico processa (IA lê e transforma)
   ↓
4. Quiz Identidade: "Quem você quer ser?" + "Qual seu objetivo?"
   ↓
5. Setup das 4 Features
   ↓
6. Pronto para usar
```

**Escolha 2: Sem PDF (DIY)**
```
1. "Não tenho PDF, quero que o app sugira"
   ↓
2. Quiz: Objetivo + Restrições + Preferências + CEP
   ↓
3. IA gera Cardápio (respeitando região)
   ↓
4. Quiz Identidade: "Quem você quer ser?"
   ↓
5. Setup das 4 Features
   ↓
6. Pronto para usar
```

### Semana 1-2: Consciência

**Domingo (Execução)**
- Timer + Notificações guiam preparo
- Usuário marca cada passo (checklist)
- ~120 minutos: mise en place → marinada → forno → corte → montagem
- Resultado: Refeições pré-prontas para semana

**Segunda-Domingo (Rastreamento)**
- App lembra: "Tempo de comer conforme seu plano"
- Usuário marca "Seguei Plano" no grid
- Se comeu algo fora: App pergunta Tríade ("Como você se sentiu?")

**Progresso de Identidade**
- Feature "Entenda Sua Origem" explicando por que come assim
- Feature "Seu Projeto de Vida" reforçando quem quer ser

### Semana 3-9: Consolidação

**Mesma dinâmica** mas:
- Timer notificações reduzem (usuário já conhece fluxo)
- Badges intermediárias (7 dias, 14 dias, 21 dias)
- Grid visual cresce (evidência acumulada)
- Tríade ativa menos (padrões já conhecidos)

### Dia 66: Transformação

- **Badge Final**: "Soberania Pessoal" 👑
- **Mensagem**: "Você conquistou soberania pessoal. Seu novo EU é permanente agora."
- **Nova Identidade**: "Sou alguém que [conforme plano]" é automático, não requer esforço
- **Próximas Fases**: Opção de Phase 2 (comunidade, badges avançadas, wearable)

---

## 🎮 GAMIFICAÇÃO & RETENÇÃO

### Sistema de Recompensas

**Recompensas Diárias**
- Marca "Seguei Plano": +10 pontos + Streak continua
- Cada marca consecutiva reforça ("perder dói mais")

**Recompensas Semanais (Domingo)**
- Completa Protocolo: +50 pontos + Badge Especial
- Completa Semana (Domingo + 6 dias): +100 pontos + Combo Badge

**Marcos & Badges**
- Dia 7: "Primeira Chama" 🔥 (consciência ativa)
- Dia 21: "Ponto de Não Retorno" 🌊 (metamorfose em progresso)
- Dia 66: "Soberania Pessoal" 👑 (identidade transformada)

**Desafios Especiais**
- "Executou 4 Domingos": "Mestre do Preparo"
- "Sem Quebra de Streak": "Consistência Absoluta"
- "Completou 66 Dias": "Novo Hábito Consolidado"

### Retenção através de Identidade

Não é apenas "você fez"; é **"você SE VENDO fazer"**:
- Grid visual = evidência acumulada
- Badges = reconhecimento
- Narrativa progressiva = transformação visível
- Conexão com Projeto de Vida = identidade real, não apenas comportamento

---

## 🛠️ FEATURES DETALHADAS

### Feature 1: Leitor de PDF + Motor Logístico

**Inputs**
- Upload de PDF (refeições + ingredientes da semana)

**Process**
- OCR (leitura do PDF)
- IA (Claude) transforma em protocolo
- Extrai: Refeições + Macros (para lista de compras)

**Output**
- Protocolo Executável (Mise en Place → Marinada → Forno → Corte → Montagem)
- Lista de Compras (ingredientes organizados)
- Refeições da Semana (segunda-domingo)

**Interface**
- Upload button simples
- Preview do protocolo gerado
- Editar se necessário

---

### Feature 2: Gerador de Cardápio

**Inputs (Quiz)**
- Objetivo: emagrecer / ganhar músculo / saúde geral / manutenção
- Restrições: alergias, vegetariano, sem glúten, intolerâncias
- Preferências: ingredientes que gosta/odeia
- CEP: para adaptar à regionalidade

**Process**
- IA gera cardápio respeitando:
  - Objetivo nutricional
  - Ingredientes acessíveis na região
  - Preferências do usuário
  - Templates regionais como suporte

**Output**
- Cardápio semanal customizado
- Lista de compras (por ingrediente)
- Pronto para entrar no Motor Logístico

**Interface**
- Quiz stepwise (não tudo de uma vez)
- Preview do cardápio
- Opção de "regenerar" se não gostar

---

### Feature 3: Motor de Execução (Preparo)

**Domingo - Protocolo de Preparo**

Fluxo:
1. Usuário abre app, vê: "Protocolo de Preparo - 120 minutos"
2. Timer começa
3. Notificação + Checklist guiam:
   - "10:00 - Mise en Place (10 min)" → App notifica, usuário marca ✓
   - "10:10 - Frango Marinando (15 min)" → Timer automático, notifica fim
   - etc.
4. Cada step = recompensa imediata (dopamina 0-5s)
5. Fim: "Protocolo Executado" → Badge + 50 pontos

**Segunda-Domingo - Preparo Rápido**

Fluxo:
1. App lembra: "Hora de comer conforme plano"
2. Usuário pega ingredientes pré-prontos (já preparados domingo)
3. Monta rápido (juntar arroz pré-feito + frango pré-cozido + salada)
4. Marca "Seguei Plano" → +10 pontos

---

### Feature 4: Grid de Consistência

**Visual**
```
┌─────────────────────────┐
│  Semana 1               │
│  ■ ■ ■ ■ ■ ■ □         │
│  7/7 dias + Domingo     │
└─────────────────────────┘

Progresso: Dia 7
[Primeira Chama] 🔥
"Você acendeu a chama da transformação"
```

**O que se Marca**
- Domingo: "Executei Protocolo" (peso maior)
- Segunda-Domingo: "Seguei Plano" (diário)
- Combo semanal: Domingo + 6 dias = Recompensa dobrada

**Narrativa Progressiva**
- Dia 7: Primeira Chama 🔥 ("despertar")
- Dia 21: Ponto de Não Retorno 🌊 ("metamorfose")
- Dia 66: Soberania Pessoal 👑 ("identidade transformada")

---

### Features 5-8: 4 Features de Identidade

#### Feature 5: Mapeamento da Tríade
- Dashboard: "Qual foi sua Tríade hoje?"
- Inputs: Comportamento + Cognição + Afeto
- App conecta padrões ao longo do tempo
- Insight: "Quando ansioso, você sempre pensa 'preciso comer'"

#### Feature 6: Entenda Sua Origem
- Quiz: Personalidade (5 traços) + História (7 categorias)
- Output: "Você tem essa personalidade + essa história = essa identidade"
- Mensagem: "Não é fraqueza, é sua identidade formada. Vamos transformá-la."

#### Feature 7: Rastreador de Ciclo
- Timeline: Crenças → Tríade → Hábitos → Identidade
- Mostra em qual fase o usuário está
- Cada dia registrado = progresso visível
- Mensagens personalizadas por fase

#### Feature 8: Seu Projeto de Vida
- 5 passos de jornada
- Conecta: "Você bebeu água. A pessoa que quer ser faria isso? Sim!"
- Dashboard: Progresso rumo à identidade alvo
- Reafirmação: "Você JÁ é essa pessoa" (baseado em ações)

---

## 📈 SUCESSO METRICS (KPIs)

### Retenção
| Métrica | Target | Por Quê |
|---------|--------|---------|
| **Aderência Dia 7** | 70%+ | Primeiras semanas críticas |
| **Aderência Dia 21** | 50%+ | Transição consolidação |
| **Aderência Dia 66** | 30%+ | Automaticidade alcançada |
| **Retenção 30 dias** | 40%+ | Core user base |

### Engajamento
| Métrica | Target | Por Quê |
|---------|--------|---------|
| **Protocolo Executado** | 80%+ de domingos | Core diferencial |
| **Grid Marcado Diariamente** | 60%+ | Gamificação funciona |
| **Features Identidade Acessadas** | 3+ por semana | Reforço de identidade |
| **Streak Médio** | 30+ dias | Novo hábito consolidando |

### Transformação
| Métrica | Target | Por Quê |
|---------|--------|---------|
| **Identidade Percebida** | 40%+ ("Sou realmente alguém...") | Objetivo final |
| **Satisfação com App** | 4.5+/5 | NPS high |
| **Referência para Amigos** | 30%+ | Word-of-mouth |

---

## 🗺️ ROADMAP

### MVP (8-10 semanas) - LANÇAMENTO
✅ Leitor PDF + Motor Logístico
✅ Gerador Cardápio (IA + Geolocalização)
✅ 4 Features Identidade
✅ Grid Gamificado
✅ Onboarding (PDF + Quiz)
✅ Beta testing + refinamento

### Phase 2 (2-3 meses)
⭐ Dashboard avançado (múltiplas métricas)
⭐ Badges especiais (Mestre do Preparo, Consistência)
⭐ Social Sharing (mostrar progresso)
⭐ Comunidade básica (accountability group)
⭐ Mobile app (React Native)

### Phase 3 (2-3 meses)
🚀 IA Personalization (aprende padrão do usuário)
🚀 Wearable Integration (Apple Health, Google Fit)
🚀 Leaderboard competitivo (com amigos)
🚀 Coaching IA (recomendações personalizadas)
🚀 Marketplace de Nutricionistas (premium)

---

## 🎯 GO-TO-MARKET (MVP Launch)

### Público Inicial
- **Beta Testers**: Amigos, conhecidos, comunidade pessoal
- **Comunidade**: Redes sociais (LinkedIn, Instagram, grupos saúde)
- **Influenciadores**: Micro-influenciadores saúde/desenvolvimento pessoal

### Estratégia Inicial
1. **Fase Beta (Weeks 1-2)**: 50-100 beta testers, feedback intenso
2. **Soft Launch (Weeks 3-4)**: Comunidade pessoal (300-500 usuários)
3. **Public Launch (Week 5+)**: Open access, marketing digital

### Diferencial para Pitch
- "Transformação de identidade, não dieta"
- "Motor Logístico: protocolo em < 120 minutos"
- "Neurociência aplicada: 12 frameworks integrados"
- "Regionalidade respeitada: funciona em todo Brasil"

---

## ⚠️ RISKS & MITIGATIONS

### Risk 1: Complexidade IA (Motor Logístico)
**Risco**: PDF pode estar mal formatado, IA gera protocolo ruim
**Mitigação**:
- Template de backup (se IA falhar)
- QA rigoroso com 20+ PDFs diferentes
- Opção manual: usuário edita protocolo

### Risk 2: Retenção Dia 66
**Risco**: Usuário abandona antes de consolidação
**Mitigação**:
- Badges intermediárias (7, 21, 30 dias)
- Comunidade + accountability (Phase 2)
- Reafirmação contínua de identidade

### Risk 3: Regionalidade Cardápio
**Risco**: IA gera cardápio com ingredientes não acessíveis
**Mitigação**:
- QA por CEP (testar 5 regiões diferentes)
- Opção de substituição de ingredientes
- Feedback loop (usuário marca "não encontrei")

### Risk 4: Onboarding Composto
**Risco**: Usuário se perde entre "PDF" e "Quiz"
**Mitigação**:
- UX teste de 5 usuários reais
- Fluxo simplificado (1 pergunta "Tem PDF?")
- Guia visual (imagens ajudam)

---

## 👥 STAKEHOLDER SIGN-OFF

### Personas de Aprovação

**Product Owner**: Visão estratégica ✅
**Engineering Lead**: Feasibility técnica ⏳
**Design Lead**: UX/UI alignment ⏳
**Community**: Beta feedback ⏳

---

## 📝 APPENDIX

### A. Frameworks Científicos (Referência)

**Neurociência do Hábito** (5 frameworks)
- Loop do Hábito (Gatilho → Rotina → Recompensa)
- Dopamina (motivação + antecipação)
- Gânglios Basais (automatização em 66 dias)
- Neuroplasticidade (consolidação neural)
- Extinção (novo hábito inibe antigo)

**Leis do Hábito** (7 leis)
- Lei da Causa (origem rastreável)
- Lei do Desejo (identidade > comportamento)
- Lei da Substituição (trocar, não eliminar)
- Lei do Reforço (imediato + intermitente)
- Lei da Consistência (66 dias)
- Lei do Progresso Visível (rastreamento)
- Lei da Identidade (transformação duradoura)

**Transformação de Identidade** (6 frameworks)
- Tríade da Vida Psicológica (C+A+C)
- Identidade = Personalidade × História
- Progressão: Crenças → Tríade → Hábitos → Identidade
- Projeto de Vida vs. Projetos Pontuais
- Análise em 4 Camadas (sintoma → raiz)
- Transformação de Identidade (não é apenas comportamento)

**Documentação Completa**: Ver `FRAMEWORKS_ELEMENTOS_DO_EU_COMPLETO.md`

### B. Componentes Técnicos (Para Arquiteto)

**Stack Recomendado** (@ Aria para detalhe):
- Frontend: React/Vue (web) + React Native (mobile)
- Backend: Node.js/Python + FastAPI
- IA: Claude API (OCR + cardápio gerado)
- DB: PostgreSQL (usuários, refeições, grid)
- Cache: Redis (notificações, streak)
- Infra: AWS/GCP (escalabilidade)

**Módulos Críticos**:
- OCR pipeline (PDF → texto estruturado)
- IA orchestration (prompt engenharia)
- Notificação engine (0-5s timing)
- Grid visualization (performance importante)

### C. Epics para @sm (Scrum Master)

Próximo passo: @sm quebrará este PRD em 5-7 epics:
1. **Epic 1**: Leitor PDF + Motor Logístico (4 semanas)
2. **Epic 2**: Gerador Cardápio + Geolocalização (2.5 semanas)
3. **Epic 3**: 4 Features Identidade (3 semanas)
4. **Epic 4**: Grid Gamificado + Badges (2 semanas)
5. **Epic 5**: Onboarding + Setup (2 semanas)
6. **Epic 6**: Testing + QA (2 semanas)
7. **Epic 7**: Deployment + Beta (1 semana)

---

## ✅ APPROVAL CHECKLIST

- [ ] Product Owner aprova visão
- [ ] Architect aprova feasibility técnica
- [ ] Design aprova UX flow
- [ ] Engineering estima timeline
- [ ] Marketing aprova Go-to-Market
- [ ] Community advisor valida públic inicial

---

**PRD Criado**: 31 de Janeiro de 2026
**Status**: ✅ PRONTO PARA DESENVOLVIMENTO
**Próximo Passo**: Breakdowns em Epics com @sm

---

**Assinado**:
Morgan (Product Manager)
📋 Akrasia Killer MVP - PRD v1.0
