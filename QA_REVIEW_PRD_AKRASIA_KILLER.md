# ✅ QA REVIEW - PRD AKRASIA KILLER MVP
## Análise Completa de Requisitos, Clareza e Gaps

**Data**: 31 de Janeiro de 2026
**Revisor**: Quinn (@qa)
**Escopo**: PRD_AKRASIA_KILLER_MVP.md
**Status**: ✅ PRONTO COM RECOMENDAÇÕES

---

## 📊 SCORE GERAL: 8.5/10

| Aspecto | Score | Status |
|---------|-------|--------|
| **Completude de Requisitos** | 8.5/10 | ✅ Muito Bom |
| **Clareza & Estrutura** | 9.0/10 | ✅ Excelente |
| **Rastreabilidade** | 7.5/10 | ⚠️ Médio |
| **Feasibility Técnica** | 8.0/10 | ✅ Bom |
| **Risco & Mitigação** | 8.0/10 | ✅ Bom |
| **Success Metrics** | 8.5/10 | ✅ Muito Bom |

---

## ✅ VALIDAÇÃO DETALHADA

### 1️⃣ COMPLETUDE DE REQUISITOS

#### **O que está Excelente:**

✅ **8 Features bem definidas**
- Leitor PDF ✓
- Motor Logístico ✓
- Gerador Cardápio ✓
- Grid Gamificado ✓
- 4 Features Identidade ✓

✅ **User Journey Claro**
- Onboarding (2 caminhos) ✓
- Semanas 1-2 (Consciência) ✓
- Semanas 3-9 (Consolidação) ✓
- Dia 66 (Transformação) ✓

✅ **KPIs Definidos**
- Retenção (7, 21, 66 dias) ✓
- Engajamento (protocolo, grid, features) ✓
- Transformação (identidade) ✓

✅ **Roadmap Claro**
- MVP (8-10 semanas) ✓
- Phase 2 (2-3 meses) ✓
- Phase 3 (2-3 meses) ✓

---

#### **Gaps Identificados (MÉDIO RISCO):**

⚠️ **Gap 1: Detalhes de Segurança/Privacy**
- **Problema**: PRD não menciona:
  - LGPD compliance (Lei Geral de Proteção de Dados)
  - Armazenamento de dados de saúde (sensível)
  - Criptografia de PDFs
  - Consentimento do usuário
- **Severidade**: 🟠 MÉDIO (risco legal)
- **Recomendação**:
  ```
  Adicionar seção "Privacy & Compliance":
  - LGPD compliance checklist
  - Criptografia de dados em trânsito/repouso
  - Consentimento explícito para IA
  - Data retention policy
  ```

⚠️ **Gap 2: Especificação do Quiz (Onboarding)**
- **Problema**: Não há questões específicas do quiz
- **Severidade**: 🟡 BAIXO (pode ser detalhe)
- **Recomendação**: Criar `QUIZ_SPECIFICATION.md` com:
  - 10-15 perguntas exatas (Objetivo + Restrições + Preferências + CEP)
  - Formato de respostas (múltipla escolha / texto / slider)
  - Validação de entradas

⚠️ **Gap 3: Especificação do Protocolo (Motor Logístico)**
- **Problema**: Como exatamente IA transforma "Receita" em "Protocolo"?
- **Severidade**: 🟡 BAIXO (detalhe técnico)
- **Recomendação**: Criar `MOTOR_LOGISTICO_SPEC.md` com:
  - Exemplos reais: PDF → Protocolo (mise en place, marinada, forno, corte, montagem)
  - Prompt engineering para Claude
  - Template do protocolo estruturado

⚠️ **Gap 4: API Contracts (Backend)**
- **Problema**: Não há especificação de endpoints
- **Severidade**: 🟡 BAIXO (para arquiteto definir)
- **Recomendação**: Deixar para @architect, mas mencionar:
  ```
  POST /user/profile (identidade + objetivo)
  POST /pdf/upload (arquivo)
  GET /pdf/protocol (protocolo gerado)
  POST /daily-checkin (marca refeição)
  GET /grid (grid de consistência)
  ```

---

### 2️⃣ CLAREZA & ESTRUTURA

#### **O que Está Excelente:**

✅ **Estrutura Lógica**
- Executive Summary → Overview → User Journey → Features → Metrics → Roadmap
- Fluxo natural e fácil de seguir

✅ **Linguagem Clara**
- PT-BR excelente
- Exemplos práticos ("comi chocolate" → "identidade de alguém que come para acalmar")
- Distinção clara entre MVP e Phase 2/3

✅ **Detalhes Suficientes**
- Features descritas com inputs/process/output
- User journey dia a dia
- KPIs têm target específico

---

#### **Pontos para Melhoria:**

⚠️ **Ponto 1: Diagrama Falta**
- **Problema**: Muito texto, pouco visual
- **Severidade**: 🟡 BAIXO
- **Recomendação**: Adicionar 2 diagramas:
  1. **Feature Map**: Qual framework → qual feature do app
  2. **User Journey Visual**: Timeline com marcos (7 dias, 21, 66)

⚠️ **Ponto 2: Precedência entre Features**
- **Problema**: PRD não deixa claro qual feature é essencial vs. nice-to-have
- **Severidade**: 🟡 BAIXO
- **Recomendação**: Adicionar MoSCoW:
  - **MUST**: Leitor PDF, Motor Logístico, Grid, Tríade
  - **SHOULD**: Gerador Cardápio, Projeto de Vida
  - **COULD**: Badges especiais, Desafios
  - **WONT**: Social sharing (deixa para Phase 2)

---

### 3️⃣ RASTREABILIDADE (Requisitos → Testes)

#### **Análise:**

⚠️ **Gap Crítico: Faltam Given-When-Then Scenarios**

Exemplo do que FALTA:

```
FEATURE: Motor Logístico - Timer + Notificações + Checklist

✗ NÃO TEM REQUISITOS TESTÁVEIS:
  - "Transforma PDF em protocolo" (vago)
  - "Timer guia execução" (vago)
  - "Checklist marca progresso" (vago)

✓ DEVERIAM SER:
  Requisito R1: Motor Logístico - Parsing de PDF
  Given: Um PDF com refeições (arroz, frango, salada)
  When: Usuário faz upload
  Then: App extrai: refeições + ingredientes + macros
  AND: Estrutura em protocolo binário (Mise en place → Marinada → Forno → Corte)

  Requisito R2: Timer + Notificações
  Given: Protocolo iniciado às 10:00
  When: Passo 1 marcado como feito
  Then: App notifica em < 5 segundos
  AND: Timer inicia para próximo passo

  Requisito R3: Checklist Completo
  Given: 8 passos do protocolo
  When: Usuário marca 7 passos
  Then: App mostra progresso 7/8
  AND: Botão "Próximo Passo" habilitado
```

**Severidade**: 🟠 MÉDIO (affects testing)
**Recomendação**: Criar `REQUIREMENTS_TRACEABILITY.md` com:
- 30-40 requisitos testáveis (Given-When-Then)
- Mapeamento para cada feature
- Acceptance criteria específicas

---

### 4️⃣ FEASIBILITY TÉCNICA

#### **O que Está Bom:**

✅ **Stack Realista**
- React/Vue (frontend) ✓
- Node.js/Python (backend) ✓
- Claude API (IA) ✓
- PostgreSQL (DB) ✓

✅ **Componentes Críticos Identificados**
- OCR pipeline ✓
- IA orchestration ✓
- Notificação engine ✓
- Grid visualization ✓

---

#### **Concerns Técnicos:**

⚠️ **Concern 1: OCR Accuracy (PDF Complex)**
- **Risco**: PDFs nutricionais podem ser:
  - Scaneados (não texto)
  - Mal formatados
  - Com tabelas/imagens
- **Severidade**: 🟠 MÉDIO
- **Recomendação**:
  ```
  Validation Plan:
  - Testar com 20+ PDFs reais
  - Set accuracy target: 95%+ texto extraído
  - Fallback: Manual upload de ingredientes se OCR < 90%
  - QA Gate: Testes de OCR com PDFs brasileiros
  ```

⚠️ **Concern 2: IA Prompt Engineering (Motor Logístico)**
- **Risco**: Claude pode não estruturar protocolo perfeitamente
- **Severidade**: 🟡 BAIXO-MÉDIO
- **Recomendação**:
  ```
  Validation Plan:
  - Few-shot prompting: 5-10 exemplos de PDF → Protocolo
  - Template estruturado para resposta
  - Validação de output (todas as receitas → protocolo?)
  - QA Gate: 20 PDFs diferentes, validação manual
  ```

⚠️ **Concern 3: Geolocalização Cardápio (IA)**
- **Risco**: IA pode gerar ingredientes não acessíveis em região X
- **Severidade**: 🟡 BAIXO-MÉDIO
- **Recomendação**:
  ```
  Validation Plan:
  - Testar cardápio gerado para 5 regiões (SP, BA, RS, MG, Norte)
  - Validar ingredientes com base de dados regional
  - Feedback loop: usuário marca "não encontrei este ingrediente"
  - Fallback: Sugerir substituição similar
  ```

⚠️ **Concern 4: Notificação Timing (0-5s)**
- **Risco**: Baixa latência é crítica (Lei do Reforço)
- **Severidade**: 🟡 MÉDIO
- **Recomendação**:
  ```
  Validation Plan:
  - Performance test: latência média de notificação
  - Target: < 2 segundos (p99: < 5s)
  - Load testing: 1000+ usuários simultâneos
  - QA Gate: Testes de carga com notificação
  ```

---

### 5️⃣ RISCO & MITIGAÇÃO

#### **O que Está Bem:**

✅ **4 Riscos Identificados**
- Complexidade IA ✓
- Retenção Dia 66 ✓
- Regionalidade Cardápio ✓
- Onboarding Composto ✓

✅ **Mitigações Realistas**
- Templates de backup ✓
- Badges intermediárias ✓
- QA por CEP ✓
- UX teste ✓

---

#### **Riscos Faltantes (NÃO MAPEADOS):**

⚠️ **Risco R1: Dependência de Nutricionista (Go-to-Market)**
- **Problema**: MVP oferece 2 caminhos (com PDF / sem PDF). Se ninguém tem PDF, falha
- **Severidade**: 🟠 MÉDIO (affects adoption)
- **Mitigação Sugerida**:
  ```
  - Beta: Recrutar usuários que já têm PDF (fácil)
  - Criar 5-10 cardápios template por região
  - Partnership com 5-10 nutricionistas para beta
  - Se não funcionar: pivot para "apenas com PDF" (MVP mais simples)
  ```

⚠️ **Risco R2: Retenção Semanal (Domingo = Crítico)**
- **Problema**: Se usuário não faz protocolo domingo, semana inteira fica vazia
- **Severidade**: 🟠 MÉDIO (affects engagement)
- **Mitigação Sugerida**:
  ```
  - Feature: "Preparar em outro dia" (sábado ou segunda)
  - Reminder forte: 3 notificações domingo (8h, 12h, 15h)
  - Gamificação: "Preparou em outra hora? Válido!"
  - Comunidade: Desafio semanal (quem prepara ganha badge)
  ```

⚠️ **Risco R3: Dados Sensíveis de Saúde (LGPD)**
- **Problema**: App coleta PDFs nutricionais, identidade, comportamento alimentar
- **Severidade**: 🔴 ALTO (legal risk)
- **Mitigação Sugerida**:
  ```
  - LGPD compliance audit (semana 1)
  - Criptografia dados em repouso (AES-256)
  - Anonimização de grid visual (não mostra nomes)
  - Política de retenção: Deletar dados após 1 ano de inatividade
  - Consentimento explícito: "Seu PDF é processado por IA"
  - QA Gate: Security review de dados sensíveis
  ```

⚠️ **Risco R4: Burnout do Motor Logístico**
- **Problema**: Se Motor Logístico falha (OCR ruim, IA falha), MVP perde valor
- **Severidade**: 🟠 MÉDIO (core feature)
- **Mitigação Sugerida**:
  ```
  - Fallback: Interface manual para estruturar protocolo
  - Templates: 20+ protocolos pré-prontos (para testar)
  - QA rigorosa: 100+ PDFs testados antes de launch
  - Revert strategy: Se > 20% PDFs falham, voltar para versão template
  ```

---

### 6️⃣ SUCCESS METRICS

#### **O que Está Bom:**

✅ **KPIs Específicos**
- Aderência (7, 21, 66 dias) com targets ✓
- Engajamento (protocolo, grid, features) ✓
- Transformação (identidade percebida) ✓

---

#### **Melhorias para Metrics:**

⚠️ **Métrica 1: Como Medir "Identidade Percebida"?**
- **Problema**: "40%+ ('Sou realmente alguém...')" é vago
- **Severidade**: 🟡 BAIXO
- **Recomendação**:
  ```
  Implementar:
  - Post-66 dias: Survey "Você se vê diferente?" (escala 1-5)
  - Métrica: % usuários com score 4+ = "identidade percebida"
  - Target: 40%+ respondentes dão 4 ou 5
  ```

⚠️ **Métrica 2: Motor Logístico Accuracy**
- **Problema**: PRD não tem métrica para "protocolo bem gerado"
- **Severidade**: 🟡 BAIXO
- **Recomendação**:
  ```
  Adicionar métrica:
  - "OCR Accuracy": % de ingredientes extraídos corretamente
  - Target: 95%+
  - "Protocol Quality": % protocolos marcados como "útil" por usuário
  - Target: 80%+
  ```

⚠️ **Métrica 3: Custo de Execução**
- **Problema**: PRD não menciona quanto custa rodar IA (Claude API)
- **Severidade**: 🟡 BAIXO
- **Recomendação**:
  ```
  Adicionar tracking:
  - "Cost per user": $ gasto com Claude API / usuário ativo
  - Target: < $0.50 por usuário
  - Monitor: Otimizar prompts se custo > target
  ```

---

## 🚨 LISTA DE VALIDAÇÕES PRÉ-DEV

### CRÍTICO (Deve fazer antes de dev)
- [ ] Criar `SECURITY_PRIVACY_PLAN.md` (LGPD compliance)
- [ ] Criar `REQUIREMENTS_TRACEABILITY.md` (Given-When-Then scenarios)
- [ ] Criar `MOTOR_LOGISTICO_SPEC.md` (Prompt engineering)
- [ ] Criar `QUIZ_SPECIFICATION.md` (Questões exatas)
- [ ] Tech stack review com @architect

### IMPORTANTE (Antes de beta)
- [ ] OCR accuracy testing (20+ PDFs)
- [ ] Geolocalização testing (5 regiões)
- [ ] Notificação timing validation (< 5s)
- [ ] UX test do onboarding (5 usuários)
- [ ] Security review de dados sensíveis

### BOM TER (Antes de launch)
- [ ] Diagramas visuais (Feature map + Timeline)
- [ ] MoSCoW prioritization (MUST/SHOULD/COULD/WONT)
- [ ] Detalhes de substituição de ingredientes
- [ ] Plano de rollback (se Motor falha)

---

## 📋 RECOMENDAÇÕES PRIORITY-ORDERED

### P1 - CRÍTICO
1. **LGPD Compliance Plan** (legal risk)
   - Duração: 5-8 horas
   - Deliverable: `SECURITY_PRIVACY_PLAN.md`
   - Owner: @architect + @pm

2. **Requirements Traceability** (affects testing)
   - Duração: 8-12 horas
   - Deliverable: `REQUIREMENTS_TRACEABILITY.md` (30-40 scenarios)
   - Owner: @qa + @pm

### P2 - MUITO IMPORTANTE
3. **Motor Logístico Specification** (core feature)
   - Duração: 6-8 horas
   - Deliverable: `MOTOR_LOGISTICO_SPEC.md` com exemplos
   - Owner: @architect + @pm

4. **Quiz Specification** (onboarding critical)
   - Duração: 4-6 horas
   - Deliverable: `QUIZ_SPECIFICATION.md` (15 questões)
   - Owner: @pm + @design

### P3 - IMPORTANTE
5. **Risco Mapping** (mitigate unknowns)
   - Duração: 4-6 horas
   - Deliverable: Atualizar "Risks & Mitigations" com R1-R4
   - Owner: @pm

6. **Visual Diagrams** (stakeholder comms)
   - Duração: 3-4 horas
   - Deliverable: 2 diagramas (Feature map + Timeline)
   - Owner: @design + @pm

---

## ✅ GATE DECISION

### **Status: PASS WITH RECOMMENDATIONS**

**Decisão Final**: ✅ **PRD APROVADO para desenvolvimento com condições**

**Condições para Aprovação:**

1. **MUST-HAVE** (Blocker se não fizer):
   - [ ] LGPD Compliance Plan criado
   - [ ] Requirements Traceability documento (min 30 scenarios)
   - [ ] Motor Logístico Spec com exemplos reais

2. **SHOULD-HAVE** (Melhora qualidade):
   - [ ] Quiz Specification documento
   - [ ] Visual diagrams (Feature + Timeline)
   - [ ] MoSCoW prioritization

3. **NICE-TO-HAVE** (Não bloqueia):
   - [ ] Detalhes de fallback para OCR
   - [ ] Plano de A/B testing de reforços

### **Próximo Passo:**
- Criar tickets para P1 e P2 (que @sm pode quebrar em tasks)
- Reunião com @architect sobre feasibility técnica
- Depois: Breakdowns em Epics

---

## 📊 CHECKLIST DE VALIDAÇÃO

### Completude
- ✅ Visão clara
- ✅ Features bem definidas
- ✅ User journey completo
- ✅ KPIs específicos
- ✅ Roadmap 3 fases
- ✅ Go-to-market
- ✅ Risks & mitigations
- ⚠️ Security/Privacy (falta detalhe)
- ⚠️ Traceability (falta scenarios)

### Clareza
- ✅ Estrutura lógica
- ✅ Linguagem clara
- ✅ Exemplos práticos
- ⚠️ Faltam diagramas
- ⚠️ Precedência features (MUST/SHOULD) não clara

### Feasibility
- ✅ Stack realista
- ✅ Componentes críticos identificados
- ⚠️ OCR accuracy não validado
- ⚠️ IA prompt eng. não detalhe
- ⚠️ Notificação timing não testado

### Risco
- ✅ 4 riscos mapeados
- ✅ Mitigações realistas
- ⚠️ Faltam 4 riscos (Go-to-market, retenção semanal, LGPD, core feature burnout)

---

## 🎯 RESUMO FINAL

**O PRD está 85% pronto para desenvolvimento.**

**Pontos Fortes:**
- Visão estratégica clara
- Features bem definidas
- User journey dia-a-dia
- KPIs mensuráveis
- Roadmap realista

**Gaps Críticos:**
1. LGPD compliance (legal risk)
2. Requirements traceability (testing enablement)
3. Motor Logístico spec (core feature risk)

**Score Final: 8.5/10** ✅

**Recomendação: APROVAR com 3 documentos de suporte antes de dev iniciar**

---

**Quinn (@qa)**
**31 de Janeiro de 2026**
**QA Review Completa - PRD Akrasia Killer MVP**
