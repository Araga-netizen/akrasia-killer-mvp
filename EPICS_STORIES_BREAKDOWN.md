# 🌊 EPICS & STORIES BREAKDOWN
## Akrasia Killer MVP - 7 Epics, 40+ Stories

**Data**: 31 de Janeiro de 2026
**Scrum Master**: River (@sm)
**Status**: ✅ READY FOR SPRINT 1
**Total Timeline**: 8-10 semanas

---

## 📋 EPICS OVERVIEW

| Epic | Descrição | Timeline | Prioridade | Stories |
|------|-----------|----------|-----------|---------|
| **E1** | Leitor PDF + Motor Logístico | 4 semanas | P0 | 6 |
| **E2** | Gerador Cardápio IA | 2.5 semanas | P0 | 5 |
| **E3** | 4 Features Identidade | 3 semanas | P0 | 8 |
| **E4** | Grid Gamificado + Badges | 2 semanas | P0 | 4 |
| **E5** | Onboarding + Setup | 2 semanas | P0 | 6 |
| **E6** | Notificações + Integração | 2 semanas | P1 | 5 |
| **E7** | Testing + Deployment | 2 semanas | P0 | 6 |
| **TOTAL** | | **8-10 semanas** | | **40 stories** |

---

## 🎯 EPIC 1: LEITOR PDF + MOTOR LOGÍSTICO
**Timeline**: 4 semanas | **Prioridade**: P0 (Core differentiator)
**Owner**: @dev | **Reviewer**: @qa
**Valor**: Diferencial core - transforma PDF em protocolo < 120min

### E1-S1: PDF Upload & Storage Infrastructure
```
User Story: Como usuário, quero fazer upload de um PDF do meu nutricionista
para que o app possa processar meu plano alimentar

Acceptance Criteria:
- [ ] POST /api/nutrition/pdf/upload endpoint (multipart form)
- [ ] Validação: arquivo máx 10MB, tipo .pdf, magic bytes
- [ ] Storage: S3 com criptografia AES-256
- [ ] Response: { pdf_id, processing_status: "queued" }
- [ ] Error: Se PDF protegido, retornar erro descritivo
- [ ] Security: Usuário só pode acessar seus PDFs

Test Scenarios (Given-When-Then):
Given: Usuário autenticado com token válido
When: Upload PDF 5MB válido
Then: pdf_id gerado, arquivo em S3, status "queued"

Given: PDF protegido por senha
When: Tenta fazer upload
Then: Erro 400 "PDF protegido"

Dependencies:
- Auth middleware (E5)
- S3 configuration
- Error handling layer

Story Points: 3
```

### E1-S2: OCR Pipeline with Claude Vision
```
User Story: Como dev, quero um serviço de OCR que converta PDF em texto estruturado
para que o Motor Logístico possa processar o conteúdo

Acceptance Criteria:
- [ ] Serviço OCR que lê PDF com Claude Vision
- [ ] Extrai: dias, refeições, ingredientes, macros
- [ ] Output: JSON estruturado { plan: [...] }
- [ ] Accuracy: 95%+ (validado com 20 PDFs teste)
- [ ] Timeout: 30 segundos max
- [ ] Retry: 3 tentativas com backoff exponencial
- [ ] Logging: Tokens de entrada/saída para cost tracking

Test Scenarios:
Given: PDF com receita simples (arroz+frango+brócolis)
When: OCR processa
Then: Ingredientes extraídos 100%, macros corretos

Given: PDF mal formatado (tabelas, imagens)
When: OCR processa
Then: Accuracy >= 90%

Given: PDF timeout > 30s
When: Claude não responde
Then: Retry automático, fallback se falhar 3x

Dependencies:
- Claude API key configurada
- Error handling
- Logging infrastructure

Story Points: 5
```

### E1-S3: Motor Logístico - Transformação em Protocolo
```
User Story: Como usuário, quero que meu PDF seja transformado em passos sequenciais
para que eu possa executar o preparo em < 120 minutos

Acceptance Criteria:
- [ ] Service que transforma receitas em protocolo binário
- [ ] Passos: Mise en place → Marinada → Cozimento → Corte → Armazenamento
- [ ] Cada passo tem: nome, descrição, tempo estimado, ações
- [ ] Total: <= 120 minutos
- [ ] JSON schema definido (vide MOTOR_LOGISTICO_SPEC.md)
- [ ] Validação: Sequência lógica (mise en place primeiro, armazenamento último)
- [ ] Fallback: Se IA falha, retornar template protocol

Test Scenarios:
Given: JSON de ingredientes extraído
When: Motor Logístico processa
Then: Protocolo com 5-8 passos, sequência lógica, < 120 min

Given: IA falha (timeout ou erro)
When: Motor tenta novamente (retry)
Then: Se 3 falhas, retornar template fallback

Dependencies:
- OCR service (E1-S2)
- Claude API
- Prompt engineering (vide spec)

Story Points: 8
```

### E1-S4: Protocol Data Persistence
```
User Story: Como dev, quero persistir protocolos em DB
para que usuários possam acessar protocolos salvos

Acceptance Criteria:
- [ ] Criar tabela: protocols (id, meal_plan_id, steps_json, total_time, created_at)
- [ ] Validação: Total time <= 120 min
- [ ] Índices: (user_id, created_at) para query rápida
- [ ] Soft delete: is_deleted flag (não hard delete)
- [ ] Encrypted: steps_json criptografado em repouso

Test Scenarios:
Given: Protocolo gerado válido
When: Salva em DB
Then: Recuperável por user_id, ordem correta

Dependencies:
- Database migrations (Prisma)
- Encryption at rest

Story Points: 3
```

### E1-S5: Shopping List Generation
```
User Story: Como usuário, quero uma lista de compras organizada
para que eu saiba exatamente o que comprar

Acceptance Criteria:
- [ ] GET /api/nutrition/shopping-list
- [ ] Agrupa ingredientes por categoria (frutas, proteínas, vegetais, etc)
- [ ] Remove duplicatas (se frango em 2 refeições, soma quantidades)
- [ ] Exportável: PDF, CSV, texto
- [ ] Checar itens: Marcar como comprado (UI + DB)
- [ ] Persiste: Salvar lista para referência futura

Test Scenarios:
Given: Protocolo com frango em 2 dias
When: Gera shopping list
Then: "Frango filé 1000g" (não 2x 500g)

Given: Usuário marca item como comprado
When: Recarrega página
Then: Item marcado persiste

Dependencies:
- Protocolo persistido (E1-S4)
- UI para marcar itens

Story Points: 3
```

### E1-S6: List Retrieval & Status Endpoints
```
User Story: Como dev, quero endpoints para verificar status do processamento
para que usuário saiba quando protocolo está pronto

Acceptance Criteria:
- [ ] GET /api/nutrition/pdf/{pdf_id}/status
  Response: { status: "processing|ready|error", progress: 0-100 }
- [ ] GET /api/nutrition/pdf/{pdf_id}/protocol
  Response: Protocolo completo (se pronto)
- [ ] GET /api/nutrition/meal-plan
  Response: Refeições da semana + macros
- [ ] Timeout: 5 minutos max (depois: erro "processamento demorou")

Test Scenarios:
Given: PDF sendo processado
When: Checa status a cada 2s
Then: status muda "processing" → "ready"

Given: Processamento falha
When: Checa status
Then: status "error", mensagem descritiva

Dependencies:
- OCR + Motor (E1-S2, E1-S3)
- Background job queue (opcional)

Story Points: 3
```

---

## 🎯 EPIC 2: GERADOR CARDÁPIO IA
**Timeline**: 2.5 semanas | **Prioridade**: P0
**Owner**: @dev | **Reviewer**: @qa
**Valor**: Permite users sem nutricionista; regionalizado

### E2-S1: Quiz Onboarding (Objetivo + Restrições)
```
User Story: Como usuário sem PDF, quero responder um quiz
para que o app gere um cardápio customizado

Acceptance Criteria:
- [ ] POST /api/nutrition/quiz
  Request: { objetivo, restrições, preferências, cep }
  Response: { quiz_id, validated: true }
- [ ] Validações:
  - Objetivo: enum ["emagrecer", "ganhar_musculo", "saúde", "manutenção"]
  - Restrições: min 0, max ilimitado (vegetariano, sem glúten, etc)
  - Preferências: lista de alimentos que gosta/odeia
  - CEP: 8 dígitos, formato válido
- [ ] Obrigatório: Pelo menos 1 restrição OU 1 preferência
- [ ] Erro: Se dados inválidos, retornar campo específico com mensagem

Test Scenarios:
Given: Quiz com objetivo "emagrecer" + sem glúten
When: POST /api/nutrition/quiz
Then: quiz_id gerado, validado

Given: CEP inválido "123"
When: POST
Then: Erro 400 "CEP deve ter 8 dígitos"

Dependencies:
- Validação framework (Zod)
- Database storage

Story Points: 3
```

### E2-S2: IA Gerador de Cardápio (com Geolocalização)
```
User Story: Como usuário, quero um cardápio gerado por IA
que respeita minha região do Brasil

Acceptance Criteria:
- [ ] POST /api/nutrition/cardapio/generate
- [ ] IA (Claude) gera cardápio baseado em:
  - Objetivo (macros alinhadas)
  - Restrições (sem alimentos não permitidos)
  - Preferências (usa alimentos que gosta)
  - CEP (ingredientes acessíveis na região)
- [ ] Output: Cardápio semanal (segunda-domingo)
  Cada dia: café, almoço, lanche, jantar com macros
- [ ] Validação: Macros totalizadas = objetivo
- [ ] Caching: Se mesmo quiz depois, retorna cache (TTL 1 hora)
- [ ] Cost tracking: Log de tokens input/output

Test Scenarios:
Given: Quiz com objetivo "emagrecer", CEP São Paulo
When: IA gera cardápio
Then: Cardápio usa ingredientes paulistas (açaí, peixe fresco, etc)

Given: Vegetariano + sem glúten
When: IA gera
Then: Nenhum alimento com glúten ou carne animal

Given: Mesmo quiz 30 min depois
When: Gera novamente
Then: Retorna cache (não chama Claude de novo)

Dependencies:
- Claude API (com geolocalização context)
- Redis cache
- Prompt engineering (vide MOTOR_LOGISTICO_SPEC.md)

Story Points: 8
```

### E2-S3: Cardápio Preview & Customization
```
User Story: Como usuário, quero visualizar e editar o cardápio gerado
para que eu possa customizar conforme preferência

Acceptance Criteria:
- [ ] GET /api/nutrition/cardapio/{cardapio_id}
  Response: Cardápio completo (semanal)
- [ ] PUT /api/nutrition/cardapio/{cardapio_id}
  Request: { meals: [...] (atualizado) }
  Response: Cardápio atualizado
- [ ] Ação: "Não gosto dessa refeição" → Regenera apenas 1 dia
- [ ] Ação: "Criar novo cardápio" → Regenera tudo
- [ ] Validação: Customizações respeitam restrições/preferências

Test Scenarios:
Given: Cardápio gerado
When: Usuário clica "Não gosto do almoço de segunda"
Then: App regenera apenas segunda, mantém resto

Given: Usuário salva customizações
When: Recarrega página
Then: Customizações persistem

Dependencies:
- Cardápio gerado (E2-S2)
- UI para edição

Story Points: 5
```

### E2-S4: Cardápio → Protocol Conversion
```
User Story: Como dev, quero converter cardápio para protocolo
para que o fluxo seja completo (Quiz → Cardápio → Protocolo)

Acceptance Criteria:
- [ ] POST /api/nutrition/cardapio/{id}/to-protocol
- [ ] Reutilizar Motor Logístico (E1-S3)
- [ ] Output: Protocolo idêntico ao vindo de PDF
- [ ] Teste: 5 cardápios diferentes convertidos com sucesso

Test Scenarios:
Given: Cardápio gerado IA
When: Converte para protocolo
Then: Protocolo válido, < 120 min, sequência lógica

Dependencies:
- Motor Logístico (E1-S3)
- Cardápio gerado (E2-S2)

Story Points: 3
```

### E2-S5: Cardápio Persistence & History
```
User Story: Como usuário, quero ver histórico de cardápios anteriores
para que eu possa reutilizar ou aprender com passado

Acceptance Criteria:
- [ ] Tabela: meal_plans (user_id, cardapio_json, created_at, is_active)
- [ ] GET /api/nutrition/cardapio/history
  Response: { cardapios: [...] (últimos 5) }
- [ ] Ação: "Usar cardápio anterior" → Reativa
- [ ] Soft delete: Desativar sem deletar

Test Scenarios:
Given: Usuário criou 3 cardápios
When: GET history
Then: Retorna 3 cardápios em ordem reversa (mais recente primeiro)

Dependencies:
- Database migrations
- Soft delete pattern

Story Points: 3
```

---

## 🎯 EPIC 3: 4 FEATURES IDENTIDADE
**Timeline**: 3 semanas | **Prioridade**: P0
**Owner**: @dev | **Reviewer**: @qa
**Valor**: Core diferential - transformação de identidade

### E3-S1: Mapeamento da Tríade (Behavior + Cognition + Affect)
```
User Story: Como usuário, quero registrar meu comportamento, pensamento e afeto
para que eu entenda meus padrões alimentares completamente

Acceptance Criteria:
- [ ] POST /api/identity/triad
  Request: { date, behavior, cognition, affect, intensity: 1-10 }
  Response: { triad_id, pattern_detected: boolean }
- [ ] Cognition: free text (500 chars max)
- [ ] Affect: enum + intensity slider
- [ ] Behavior: linked to meal (ou free text)
- [ ] Pattern detection: Se 3+ mesmos padrão em semana, flag
- [ ] Persistência: Salvar para análise posterior

Test Scenarios:
Given: Usuário registra "comi brigadeiro + estava ansioso + pensei 'preciso me acalmar'"
When: POST
Then: triad_id gerado, armazenado

Given: 5 registros no mesmo padrão (ansiedade → brigadeiro)
When: Checa padrão
Then: pattern_detected = true, recomendação sugerida

Dependencies:
- Database schema (triad_logs table)
- Pattern detection algorithm

Story Points: 5
```

### E3-S2: Análise de Padrões da Tríade
```
User Story: Como usuário, quero ver padrões detectados em meu histórico
para que eu entenda gatilhos e possa mudar

Acceptance Criteria:
- [ ] GET /api/identity/patterns
  Response: { patterns: [{ trigger, cognition, frequency, recommendation }] }
- [ ] Análise: Agrupa por (affect + cognition) → mostra frequência
- [ ] Exemplo: "Quando ansioso, você pensa 'preciso comer' → 5 vezes essa semana"
- [ ] Recommendation: App sugere alternativa (beber água, respirar, etc)
- [ ] Período: Últimos 30 dias default, customizável

Test Scenarios:
Given: 7 dias de dados Tríade
When: GET patterns
Then: Padrões identificados + frequência + sugestão

Dependencies:
- Tríade registrada (E3-S1)
- Pattern analysis algorithm

Story Points: 5
```

### E3-S3: Entenda Sua Origem (Personalidade + História)
```
User Story: Como usuário, quero entender minha personalidade e história
para que eu saiba por que como assim (sem culpa)

Acceptance Criteria:
- [ ] POST /api/identity/origin/quiz
  Request: { personality_traits: {...}, life_history: {...} }
  Response: { origin_id, insight }
- [ ] Personalidade: 5 traços Big Five (sliders 1-10)
  - Conscienciosidade, Neuroticismo, Extroversão, Amabilidade, Abertura
- [ ] História: 7 perguntas (dropdown + text):
  - Infância (validação/rejeição/abandono)
  - Relações (afeto/segurança)
  - Comida (histórico)
  - Traumas (optional)
  - Sucessos (optional)
  - Padrões (self-reflection)
  - Aprendizado (lessons)
- [ ] Insight: IA gera mensagem empática + acionável

Test Scenarios:
Given: Personalidade "alta sensibilidade (neuroticismo) + história de abandono"
When: POST
Then: Insight: "Você é sensível + aprendeu que comida = segurança"

Dependencies:
- Claude API (para gerar insight)
- Database storage

Story Points: 8
```

### E3-S4: Rastreador de Ciclo (Consciência → Consolidação)
```
User Story: Como usuário, quero ver em qual fase estou (consciência/transição/consolidação)
para que eu entenda que meu cérebro está mudando

Acceptance Criteria:
- [ ] GET /api/identity/progress
  Response: { phase, day, narrative, badges }
- [ ] Lógica:
  - Dias 1-14: Fase "Consciência" (despertando)
  - Dias 15-45: Fase "Transição" (cérebro adaptando)
  - Dias 46-66: Fase "Consolidação" (automático)
  - Dia 66+: "Consolidado"
- [ ] Narrativa: Mensagem customizada por fase
- [ ] Badges: Desbloqueia conforme progride

Test Scenarios:
Given: Usuário no dia 7
When: GET progress
Then: phase = "Consciência", mensagem sobre "despertar"

Given: Usuário no dia 30
When: GET progress
Then: phase = "Transição", mensagem sobre "mudança no cérebro"

Dependencies:
- Days counted from first tracking
- Narrative engine

Story Points: 3
```

### E3-S5: Seu Projeto de Vida (5 Passos)
```
User Story: Como usuário, quero definir quem quero ser
para que meus hábitos alinhem com minha identidade ideal

Acceptance Criteria:
- [ ] 5 passos (sequencial):
  1. "Quem você é agora com comida?" (text)
  2. "QUEM VOCÊ QUER SER?" (text)
  3. "Quais hábitos essa pessoa teria?" (suggested + custom)
  4. "Qual UM hábito quer começar hoje?" (choice)
  5. "Rastrear 66 dias" (automatic from Grid)
- [ ] POST /api/identity/project (cada passo)
- [ ] GET /api/identity/project (ver projeto inteiro)
- [ ] Reforço: Cada ação registrada = "A pessoa que quer ser faria isso? SIM!"

Test Scenarios:
Given: Usuário quer ser "Alguém em paz com comida"
When: Completa 5 passos
Then: Projeto salvo, pronto para rastreamento

Given: Usuário marca "bebi água em vez de comer"
When: Registra
Then: App diz: "Sim! A pessoa que quer ser faria isso"

Dependencies:
- Identity features (E3-S1, E3-S2, E3-S3, E3-S4)
- Grid integration (E4)

Story Points: 8
```

---

## 🎯 EPIC 4: GRID GAMIFICADO + BADGES
**Timeline**: 2 semanas | **Prioridade**: P0
**Owner**: @dev | **Reviewer**: @qa
**Valor**: Retenção - diferencial vs. concorrentes

### E4-S1: Grid Data Model & Persistence
```
User Story: Como dev, quero persistir grid data
para que usuário veja progresso visual

Acceptance Criteria:
- [ ] Tabela: grid_entries (user_id, date, protocol_executed, meals_followed, streak_current, points)
- [ ] Campos:
  - protocol_executed: boolean (domingo = protocolo feito?)
  - meals_followed: integer (quantos dias seguiu plano)
  - streak_current: integer (dias consecutivos)
  - points: integer (cumulativo)
- [ ] Índices: (user_id, date) para query rápida
- [ ] Soft delete: Nunca deletar (histórico)

Test Scenarios:
Given: Usuário marca segunda-feira
When: POST /api/grid/mark
Then: grid_entry criada, meals_followed = 1

Dependencies:
- Database migrations

Story Points: 3
```

### E4-S2: Grid Marking Endpoints
```
User Story: Como usuário, quero marcar meu dia no grid
para que eu acumule evidência de nova identidade

Acceptance Criteria:
- [ ] POST /api/grid/mark
  Request: { date, type: "protocol|meal", value: boolean }
  Response: { streak, points_earned, badge_unlocked?: string }
- [ ] Lógica:
  - protocol_executed (domingo): +50 pontos
  - meals_followed (seg-dom): +10 pontos
  - Combo (domingo + 6 dias): +100 pontos extras
- [ ] Streak:
  - Se marcar dia consecutivo: streak++
  - Se pula dia: streak = 0 (msg empática)
- [ ] Notificação: Push notification confirmando

Test Scenarios:
Given: Usuário marca segunda após domingo feito
When: POST
Then: streak = 2, points += 10, notif enviada

Given: Usuário pula um dia
When: Tenta marcar dia 3 sem marcar dia 2
Then: streak reseta, msg: "Sua sequência foi quebrada"

Dependencies:
- Notifications (E6)
- Badge logic (E4-S3)

Story Points: 5
```

### E4-S3: Badge System & Unlocking
```
User Story: Como usuário, quero ganhar badges conforme progresso
para que minha transformação seja reconhecida e recompensada

Acceptance Criteria:
- [ ] Badges:
  - Dia 7: "Primeira Chama" 🔥
  - Dia 21: "Ponto de Não Retorno" 🌊
  - Dia 66: "Soberania Pessoal" 👑
  - Special: "Mestre do Preparo" (4 domingos protocolo)
  - Special: "Consistência Absoluta" (sem quebra streak)
- [ ] POST /api/badges/check (chamado ao marcar grid)
- [ ] GET /api/badges (ver todas conquistadas)
- [ ] Celebração: Animação + notif ao desbloquear
- [ ] Persistência: user_badges table (user_id, badge_id, unlocked_at)

Test Scenarios:
Given: Usuário atinge dia 7
When: Sistema checa badges
Then: "Primeira Chama" desbloqueada, celebração visual

Given: Usuário completa 4 domingos com protocolo
When: Sistema checa
Then: "Mestre do Preparo" desbloqueada

Dependencies:
- Grid marking (E4-S2)
- Notifications (E6)

Story Points: 5
```

### E4-S4: Grid Visualization & Dashboard
```
User Story: Como usuário, quero ver meu grid visual
para que eu reconheça meu progresso de 66 dias

Acceptance Criteria:
- [ ] GET /api/grid/current
  Response: {
    grid: [{ date, protocol_executed, meals_followed }],
    streak: 23,
    points: 450,
    phase: "Transição",
    narrative: "Seu cérebro está se adaptando",
    badges: ["Primeira Chama"]
  }
- [ ] Visual: Grid tipo Duolingo (quadrinhos por dia)
  - ■ = feito (verde)
  - □ = não feito (cinza)
  - Domingo maior/destacado
- [ ] Metadata: Streak count + pontos totais visíveis

Test Scenarios:
Given: Usuário no dia 23
When: GET /api/grid/current
Then: Grid mostra 23 dias, streak = 23, badges = 1

Dependencies:
- Grid data (E4-S1, E4-S2)
- Frontend components

Story Points: 3
```

---

## 🎯 EPIC 5: ONBOARDING + SETUP
**Timeline**: 2 semanas | **Prioridade**: P0
**Owner**: @dev | **Reviewer**: @qa
**Valor**: UX crítica - primeiras impressões

### E5-S1: Authentication Infrastructure (JWT + MFA)
```
User Story: Como dev, quero autenticação segura
para que usuários tenham contas protegidas

Acceptance Criteria:
- [ ] POST /api/auth/signup
  Request: { email, password (>= 12 chars), consent_gdpr: boolean }
  Response: { user_id, token, refresh_token }
- [ ] POST /api/auth/login
  Request: { email, password }
  Response: { token, requires_mfa: boolean }
- [ ] Segurança:
  - Password: bcrypt (10+ rounds)
  - Token: JWT RS256, 1 hora expiry
  - Refresh: httpOnly cookie, 30 dias
  - MFA: TOTP (Google Authenticator)
- [ ] Rate limiting: 5 tentativas/15 min

Test Scenarios:
Given: Email novo + password válido
When: POST /signup
Then: user_id gerado, token retornado

Given: Tenta login 6 vezes com password errado
When: 6ª tentativa
Then: 429 Too Many Requests

Dependencies:
- Database (users table)
- Secrets Manager (JWT key)
- Rate limiting middleware

Story Points: 5
```

### E5-S2: Consent & Privacy Compliance
```
User Story: Como app, quero coletar consentimento LGPD
para que usuários saibam como dados são usados

Acceptance Criteria:
- [ ] Onboarding: Antes de criar conta
- [ ] 3 checkboxes obrigatórios:
  1. "Li a Política de Privacidade" (link)
  2. "Autorizo processamento de dados pessoais"
  3. "Autorizo upload de PDF por IA Claude"
- [ ] Salvar: consent_logs table (user_id, consent_date, version)
- [ ] Revogar: User Settings → "Revogar Consentimento"

Test Scenarios:
Given: Usuário tenta signup sem marcar checkboxes
When: Clica "Criar Conta"
Then: Botão desabilitado, msg: "Marque as 3 opções"

Given: Usuário revoga consentimento
When: Clica "Revogar"
Then: IA processing desativado, dados criptografados

Dependencies:
- Privacy policy document
- Consent version tracking

Story Points: 3
```

### E5-S3: Onboarding Flow - Path Selection
```
User Story: Como usuário novo, quero escolher meu caminho
para que eu possa usar PDF ou gerar cardápio

Acceptance Criteria:
- [ ] POST /api/onboarding/select-path
  Request: { path: "pdf" | "quiz" }
- [ ] Path PDF:
  - "Tenho PDF do meu nutricionista"
  - Leva para upload (E1-S1)
- [ ] Path Quiz:
  - "Quero que o app crie um cardápio"
  - Leva para quiz (E2-S1)
- [ ] UX: Botões grandes, descrição clara

Test Scenarios:
Given: Usuário novo escolhe "pdf"
When: Clica button
Then: Redirecionado para upload PDF

Dependencies:
- UI/UX flow
- Routing

Story Points: 2
```

### E5-S4: Identity Onboarding Quiz
```
User Story: Como usuário, quero preencher meu perfil de identidade
para que o app entenda meu "quem sou" e "quem quero ser"

Acceptance Criteria:
- [ ] POST /api/identity/onboarding
  Request: { personality (5 traits), life_history (7 fields), ideal_identity (text) }
- [ ] Sequencial: Não todo de uma vez (UX better)
- [ ] Validação: life_history obrigatório, personality + ideal optional
- [ ] Insights: IA gera mensagem empática pós-preenchimento

Test Scenarios:
Given: Usuário completa quiz identidade
When: POST
Then: Origin insight gerado, guardado

Dependencies:
- Origem service (E3-S3)
- UI sequencial

Story Points: 5
```

### E5-S5: Feature Setup Checklist
```
User Story: Como usuário, quero guia de setup das features
para que eu comece a usar o app com confiança

Acceptance Criteria:
- [ ] POST-onboarding: Checklist com:
  1. "Preencher Projeto de Vida" (E3-S5)
  2. "Agendar Preparo Semanal" (E6-S1)
  3. "Habilitar Notificações" (E6-S2)
  4. "Primeira marcação no Grid" (E4-S2)
- [ ] Opcional: Features Tríade, Padrões, etc
- [ ] Progress: Mostra quantos passos completou
- [ ] Reward: Ao completar todos → badge "Pronto para Começar"

Test Scenarios:
Given: Usuário novo completa onboarding
When: Vê checklist
Then: 4 items, 0/4 completos

Given: Completa "Agendar Preparo"
When: Volta ao checklist
Then: 1/4, progress bar atualizado

Dependencies:
- Features base (E3, E4, E6)

Story Points: 3
```

### E5-S6: Local Branch Creation for Feature Development
```
User Story: Como dev, quero criar branches locais para cada feature
para que trabalho seja organizado e pronto para push

Acceptance Criteria:
- [ ] Criar branch local para cada epic:
  feature/1.1-pdf-upload
  feature/2.1-quiz-cardapio
  feature/3.1-identity-triad
  feature/4.1-grid-gamification
  feature/5.1-authentication
  feature/6.1-notifications
  feature/7.1-testing-deployment
- [ ] Naming: feature/{epic}-{short-description}
- [ ] Base: Criar de main branch
- [ ] Checkout: Após criar, dev faz checkout

Test Scenarios:
Given: Iniciando E1
When: SM cria branch feature/1.1-pdf-upload
Then: Branch criada, dev faz checkout

Dependencies:
- Git local setup

Story Points: 1 (não é story dev, é SM task)
```

---

## 🎯 EPIC 6: NOTIFICAÇÕES + INTEGRAÇÃO
**Timeline**: 2 semanas | **Prioridade**: P1
**Owner**: @dev | **Reviewer**: @qa
**Valor**: Engagement & retenção

### E6-S1: Notification Service Infrastructure
```
User Story: Como dev, quero serviço de notificações robusto
para que usuários recebam alerts com < 2 segundos latência

Acceptance Criteria:
- [ ] POST /api/notifications/schedule
  Request: { user_id, type: "protocol|meal|badge", scheduled_at, message }
- [ ] Providers:
  - Firebase Cloud Messaging (push)
  - Email (SendGrid)
  - SMS (Twilio, optional)
- [ ] Latência: < 2 segundos (p99: < 5s)
- [ ] Retry: 3 tentativas se falha
- [ ] Logging: Cada notif logada para analytics

Test Scenarios:
Given: Usuário agendou protocolo para domingo 10:00
When: Hora chega
Then: Notif enviada < 2 segundos

Given: FCM falha
When: Retry automático
Then: Tenta email se FCM falha 3x

Dependencies:
- Firebase setup
- SendGrid API key
- Background job queue

Story Points: 5
```

### E6-S2: Notification Preferences & Opt-In
```
User Story: Como usuário, quero controlar quais notificações recebo
para que não seja incomodado

Acceptance Criteria:
- [ ] GET/PUT /api/user/notification-preferences
  Request: { protocol_alerts, meal_alerts, badge_alerts, email_digest }
- [ ] Defaults: Tudo ativado (opt-out)
- [ ] Cada tipo: On/Off + time range (ex: não notif depois 20h)
- [ ] Email digest: Semanal (opção)

Test Scenarios:
Given: Usuário desativa "meal_alerts"
When: Hora de comer chega
Then: Nenhuma notif push (mas grid pode ser acessado)

Dependencies:
- Preferences table (user_notification_preferences)

Story Points: 3
```

### E6-S3: Timer Notifications for Protocol
```
User Story: Como usuário, quero notificações para cada passo do protocolo
para que eu saiba exatamente quando fazer o próximo passo

Acceptance Criteria:
- [ ] POST /api/protocol/start
  Request: { protocol_id, start_time }
  Response: { execution_id, steps_with_notifications }
- [ ] Cada step: Notif automática no start_time
  "Passo 1: Mise en Place (10 min)"
- [ ] Content: Step name + duration
- [ ] Latência: < 2 segundos
- [ ] Cancelamento: User pode skip step ou parar protocolo

Test Scenarios:
Given: Protocolo iniciado 10:00
Step 1: Mise en Place (10 min)
When: 10:00 chega
Then: Notif "Passo 1: Mise..." enviada

Given: Usuário marca passo antes de tempo
When: Clica "Completo"
Then: Próximo step notif envia

Dependencies:
- Protocol execution (E1)
- Scheduler

Story Points: 5
```

### E6-S4: Real-time Grid Updates (WebSocket Optional)
```
User Story: Como usuário, quero ver grid atualizar instantaneamente
para que feedback seja imediato (opcional, pode ser polling)

Acceptance Criteria:
- [ ] Option A (Polling - MVP):
  - Frontend: GET /api/grid/current a cada 5s
  - Simples, rápido de implementar
- [ ] Option B (WebSocket - Phase 2):
  - Server: Socket.io adapter com Redis
  - User marca dia → todos navegadores recebem atualização
- [ ] Para MVP: Implementar Option A
- [ ] UX: Grid atualiza após POST /api/grid/mark

Test Scenarios:
Given: Usuário marca refeição
When: POST retorna
Then: Frontend atualiza grid imediatamente

Dependencies:
- Grid endpoints (E4)
- Frontend refresh logic

Story Points: 3 (polling), 8 (websocket)
```

### E6-S5: Email Notifications & Digests
```
User Story: Como usuário, quero receber email semanal de progresso
para que fique motivado mesmo sem abrir app

Acceptance Criteria:
- [ ] Weekly digest (sexta-feira 18h):
  - Streak atual
  - Pontos dessa semana
  - Badges desbloqueadas
  - Padrão detectado
  - Dica personalizada
- [ ] Template: HTML bonito, link para app
- [ ] Unsubscribe: Link na email
- [ ] A/B test: 2 templates, medir click-through

Test Scenarios:
Given: Sexta-feira 18:00 chega
When: Digest job roda
Then: Email enviado com progresso

Dependencies:
- SendGrid template
- Scheduled job
- Analytics

Story Points: 5
```

---

## 🎯 EPIC 7: TESTING + DEPLOYMENT
**Timeline**: 2 semanas | **Prioridade**: P0
**Owner**: @qa + @dev | **Reviewer**: @architect
**Valor**: MVP viável e confiável

### E7-S1: Unit Tests (Auth + Services)
```
User Story: Como dev, quero unit tests para cada serviço
para que código seja confiável e refatorável

Acceptance Criteria:
- [ ] Test framework: Vitest + Node test runner
- [ ] Coverage mínima: 80% de todos os serviços
- [ ] Testes:
  - Auth (signup, login, MFA, token refresh)
  - PDF upload (validação)
  - OCR (parsing)
  - Motor (protocolo generation)
  - IA cardápio (geração com geolocalização)
  - Grid (marking, streak reset)
  - Badges (unlocking logic)
- [ ] Mocks: Mockar Claude API, S3, DB
- [ ] CI/CD: Tests rodam em GitHub Actions

Test Scenarios:
Given: Auth service
When: Test signup with valid email + password
Then: User created, token returned

Given: Grid service
When: Test streak reset on missed day
Then: Streak = 0, msg = "sequência quebrada"

Dependencies:
- Test framework setup
- Mock libraries

Story Points: 8
```

### E7-S2: Integration Tests (API Endpoints)
```
User Story: Como dev, quero integration tests para endpoints
para que API seja confiável ponta-a-ponta

Acceptance Criteria:
- [ ] Test framework: Supertest + Jest/Vitest
- [ ] Coverage: Todos os 20+ endpoints
- [ ] Scenarios:
  - Authentication flow (signup → login → protected route)
  - PDF upload → OCR → Protocol generation
  - Quiz → Cardápio generation → Protocol
  - Grid marking → Streak update → Badge unlock
  - Notifications scheduling
- [ ] Database: Use test DB (separate)
- [ ] Cleanup: Each test isolates data

Test Scenarios:
Given: Complete auth flow
When: POST /signup → POST /login → GET /protected
Then: All succeed, JWT validated

Given: PDF upload flow
When: POST upload → GET status (polling) → GET protocol
Then: Full flow works, data consistent

Dependencies:
- Test DB setup
- Supertest
- Test utilities

Story Points: 8
```

### E7-S3: E2E Tests (User Flows)
```
User Story: Como qa, quero e2e tests para main user flows
para que MVP seja testado realista

Acceptance Criteria:
- [ ] Test framework: Playwright
- [ ] Flows:
  1. Signup → Onboarding → Setup → First Protocol
  2. Quiz → Cardápio → Execution → Grid Marking
  3. Identity Features → Padrão Detection
  4. Badge Unlocking (simulated 7, 21, 66 days)
- [ ] Coverage: Happy path + error cases
- [ ] Devices: Desktop (mobile em Phase 2)
- [ ] CI/CD: Roda em GitHub Actions

Test Scenarios:
Given: User opens app
When: Complete full onboarding to first grid mark
Then: All steps succeed, persisted correctly

Given: Protocol execution
When: Mark all steps
Then: Badge "Mestre do Preparo" unlocked

Dependencies:
- Playwright setup
- Frontend code (E5)
- Test data fixtures

Story Points: 8
```

### E7-S4: Security Testing
```
User Story: Como qa, quero testar segurança
para que MVP não tenha vulnerabilidades OWASP Top 10

Acceptance Criteria:
- [ ] OWASP tests:
  - A1 Injection: SQL injection, command injection
  - A2 Authentication: Token hijacking, MFA bypass
  - A3 Sensitive Data: SSL test, data exposure
  - A4 XXE: PDF parsing security
  - A5 Access Control: Cross-user data access
  - A7 XSS: Input validation, output escaping
- [ ] Tools:
  - Manual testing
  - CodeRabbit automated review
  - SSL Labs test (A+)
- [ ] Remediation: All HIGH/CRITICAL fixed

Test Scenarios:
Given: PDF upload
When: Try upload malicious file (XXE, etc)
Then: Rejected, error msg

Given: User A
When: Try to access User B's data
Then: 403 Forbidden

Dependencies:
- Security tools
- Manual QA time

Story Points: 8
```

### E7-S5: Performance Testing & Optimization
```
User Story: Como qa, quero performance tests
para que MVP seja rápido em condições reais

Acceptance Criteria:
- [ ] Load testing: 1000 concurrent users
  - API response time: < 200ms (p95)
  - Database query: < 50ms (p95)
  - Grid loading: < 3s (Web Vital: LCP)
- [ ] Tools: Apache JMeter, Lighthouse
- [ ] Metrics:
  - Time to Interactive < 3s
  - Cumulative Layout Shift < 0.1
  - First Input Delay < 100ms
- [ ] Bottleneck identification & fix

Test Scenarios:
Given: 1000 users fetching grid simultaneously
When: Load test runs
Then: Response time < 200ms for 95% of requests

Given: Homepage load
When: Lighthouse audit
Then: LCP < 2.5s, CLS < 0.1

Dependencies:
- Load testing tools
- Optimization time

Story Points: 8
```

### E7-S6: Deployment & Monitoring Setup
```
User Story: Como devops, quero deployment automation
para que MVP seja deployável facilmente

Acceptance Criteria:
- [ ] CI/CD Pipeline (GitHub Actions):
  1. Tests pass (unit + integration + e2e)
  2. CodeRabbit review passes
  3. Build Docker image
  4. Push to ECR
  5. Deploy to ECS Fargate
  6. Run smoke tests
- [ ] Environments:
  - dev (automatic on PR)
  - staging (manual trigger)
  - production (manual, requires approval)
- [ ] Monitoring:
  - CloudWatch logs + metrics
  - Sentry error tracking
  - Health checks (every 30s)
- [ ] Rollback: Auto if 503+ errors > 10% requests

Test Scenarios:
Given: Dev pushes to feature branch
When: GitHub Actions trigger
Then: Tests run, image builds, deploys to staging

Given: Deployment fails
When: Error rate > 10%
Then: Automatic rollback to previous version

Dependencies:
- GitHub Actions setup
- Docker + ECS knowledge
- CloudWatch + Sentry account

Story Points: 8
```

---

## 📊 SPRINT PLANNING

### Sprint 1 (Week 1-2): Foundations
**Stories**: E1-S1, E5-S1, E5-S2, E5-S3, E7-S6 (deploy setup)
**Owner**: @dev
**QA**: @qa (E7-S1 unit tests)

### Sprint 2 (Week 3-4): PDF + Quiz
**Stories**: E1-S2, E1-S3, E1-S4, E2-S1, E2-S2, E7-S2 (integration)

### Sprint 3 (Week 5-6): Features
**Stories**: E3-S1, E3-S2, E3-S3, E3-S4, E3-S5, E4-S1, E4-S2

### Sprint 4 (Week 7-8): Gamification + Notifications
**Stories**: E4-S3, E4-S4, E6-S1, E6-S2, E6-S3, E6-S4, E6-S5

### Sprint 5 (Week 9-10): Testing + Polish
**Stories**: E7-S3, E7-S4, E7-S5, E2-S3, E2-S4, E2-S5, E1-S5, E1-S6

---

## ✅ ACCEPTANCE CRITERIA CHECKLIST

All stories have:
- ✅ Clear Acceptance Criteria (testable)
- ✅ Test Scenarios (Given-When-Then)
- ✅ Dependencies listed
- ✅ Story Points estimated
- ✅ Linked to REQUIREMENTS_TRACEABILITY.md

All epics have:
- ✅ 4-6 stories each
- ✅ Clear timeline
- ✅ P0/P1 prioritization
- ✅ Ownership assigned

---

## 🚀 READY FOR SPRINT 1

**Status**: ✅ ALL STORIES DRAFTED & READY
**Total Stories**: 40+
**Total Points**: ~180 (for 8-10 weeks)
**Velocity**: ~18-22 points/week
**Deployment**: Week 11 (Beta launch)

---

**Epics & Stories Breakdown v1.0**
**Akrasia Killer MVP**
**31 de Janeiro de 2026 - River (@sm)**
**READY FOR @dev TO BEGIN SPRINT 1**
