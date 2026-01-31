# 📋 REQUIREMENTS TRACEABILITY MATRIX (RTM)
## AKRASIA KILLER MVP - Given-When-Then Scenarios

**Data**: 31 de Janeiro de 2026
**Owner**: @qa + @pm
**Status**: ✅ PRONTO PARA TESTES
**Total Requisitos**: 42 testáveis

---

## 📊 ESTRUTURA

Cada requisito segue padrão **Given-When-Then** (BDD - Behavior Driven Development):

```
Requisito R[N]: [Feature] - [Descrição]
├─ Given: [Pré-condição]
├─ When: [Ação]
└─ Then: [Resultado esperado]
│
└─ Test Type: [Unit/Integration/E2E]
   Status: [ ] Not Started [ ] In Progress [ ] Done
```

---

## 🔹 FEATURE 1: LEITOR DE PDF + MOTOR LOGÍSTICO

### R1: Leitor PDF - Upload & Armazenamento

**Given**: Usuário autenticado na seção "Meu Plano"
**When**: Usuário clica "Upload PDF" e seleciona arquivo PDF (10MB max)
**Then**:
- [ ] Arquivo é armazenado criptografado (AES-256)
- [ ] App exibe preview do arquivo
- [ ] Passa para "Processamento com IA"

**Test Type**: E2E (interface + backend)
**QA Gate**: ✅ Deve passar antes de MVP launch

---

### R2: Motor Logístico - OCR & Parsing

**Given**: PDF foi uploadado com sucesso
**When**: App processa PDF via Claude OCR
**Then**:
- [ ] Extrai lista de refeições (café, almoço, jantar, lanches)
- [ ] Extrai ingredientes de cada refeição
- [ ] Extrai valores nutricionais (proteína, carbs, gordura, calorias)
- [ ] Estrutura dados em JSON (refeição → ingredientes → macros)

**Test Type**: Integration (Claude API + backend)
**Validação**: PDF → Ingredientes (95%+ accuracy mínimo)

**Exemplo Real**:
```
INPUT (PDF):
"Almoço: Frango Grelhado com Brócolis e Arroz Integral
Ingredientes: 200g frango, 1 xícara brócolis, 1/2 xícara arroz"

OUTPUT (JSON esperado):
{
  "refeicao": "Almoço",
  "dia": "segunda",
  "ingredientes": [
    {"nome": "Frango Grelhado", "peso": "200g", "proteina": "45g"},
    {"nome": "Brócolis", "peso": "1 xícara", "carbs": "7g"},
    {"nome": "Arroz Integral", "peso": "1/2 xícara", "carbs": "34g"}
  ]
}
```

---

### R3: Motor Logístico - Transformação em Protocolo

**Given**: Ingredientes foram extraídos com sucesso
**When**: App chama Claude com prompt de transformação
**Then**:
- [ ] Transforma receita em protocolo binário
- [ ] Identifica passos: Mise en Place → Marinada → Forno → Corte → Montagem
- [ ] Estrutura em ordem sequencial
- [ ] Estima tempo por passo (< 120 min total domingo)

**Test Type**: Integration (Claude API + backend)

**Exemplo Real**:
```
INPUT (Refeição):
"Frango Grelhado com Brócolis e Arroz"

OUTPUT (Protocolo):
PASSO 1: MISE EN PLACE (10 min)
└─ Cortar frango em filés
└─ Lavar brócolis
└─ Medir arroz

PASSO 2: MARINADA (15 min)
└─ Marinar frango (limão + alho)

PASSO 3: COZINHAR ARROZ (20 min)
└─ Fogo alto, depois baixo

PASSO 4: GRELHAR FRANGO (10 min)
└─ Fogo alto, cada lado 5 min

PASSO 5: COZINHAR BRÓCOLIS (5 min)
└─ Vapor ou água fervendo

TOTAL: ~60 minutos
```

---

### R4: Motor Logístico - Lista de Compras

**Given**: PDF processado com ingredientes extraídos
**When**: App gera lista de compras
**Then**:
- [ ] Agrupa ingredientes por categoria (frutas, carnes, vegetais, grãos)
- [ ] Remove duplicatas (se frango em 2 refeições, mostra quantidade total)
- [ ] Exportável em PDF/texto
- [ ] Checável no app (marcar ao comprar)

**Test Type**: Integration + E2E

**Exemplo**:
```
FRUTAS:
☐ Maçã - 2 unidades
☐ Banana - 3 unidades

PROTEÍNAS:
☐ Frango filé - 800g
☐ Ovos - 1 dúzia

VEGETAIS:
☐ Brócolis - 2 cabeças
☐ Alface - 1 unidade
```

---

## 🔹 FEATURE 2: GERADOR DE CARDÁPIO

### R5: Quiz Onboarding - Coleta de Dados

**Given**: Usuário sem PDF acessa "Criar Cardápio"
**When**: Responde quiz (Objetivo + Restrições + Preferências + CEP)
**Then**:
- [ ] Objetivo capturado (emagrecer, ganhar músculo, saúde, manutenção)
- [ ] Restrições capturadas (alergias, vegetariano, sem glúten, intolerâncias)
- [ ] Preferências capturadas (gosta/odeia alimentos)
- [ ] CEP capturado e validado (formato correto)
- [ ] Dados salvos em session/DB

**Test Type**: E2E (form + validação)

**Validação**:
- [ ] Quiz não pode pular pergunta (obrigatória)
- [ ] CEP validado (8 dígitos)
- [ ] Pelo menos 1 restrição ou 1 preferência

---

### R6: Gerador Cardápio - IA Gera com Geolocalização

**Given**: Quiz respondido com sucesso
**When**: App chama Claude com dados (sem identidade pessoal)
**Then**:
- [ ] IA gera cardápio semanal (segunda-domingo)
- [ ] Respeita objetivo nutricional
- [ ] Usa ingredientes acessíveis na região (por CEP)
- [ ] Respeita restrições (sem glúten se marcado)
- [ ] Respeita preferências (sem brócolis se odeia)
- [ ] Retorna estrutura: refeição → ingredientes → macros

**Test Type**: Integration (Claude + backend)

**QA Validation**:
- Testar 5 CEPs diferentes (SP, BA, RS, MG, Norte)
- Validar se ingredientes mudam por região
- Validar se macros estão corretos

---

### R7: Cardápio - Preview & Customização

**Given**: Cardápio foi gerado
**When**: Usuário vê preview e quer customizar
**Then**:
- [ ] Mostra cardápio sugerido
- [ ] Permite substituir refeição ("não gosto dessa, gera outra")
- [ ] Permite remover restrição ("na verdade, como glúten")
- [ ] Permite regenerar completamente
- [ ] Botão "Confirmar" salva cardápio final

**Test Type**: E2E (interface + backend)

---

## 🔹 FEATURE 3: MOTOR DE EXECUÇÃO (PREPARO)

### R8: Preparo - Seleção de Dia/Hora

**Given**: PDF ou Cardápio confirmado
**When**: Usuário acessa "Preparar a Semana"
**Then**:
- [ ] App sugere "Domingo às 10:00" (padrão)
- [ ] Permite mudar dia (sábado, segunda, etc)
- [ ] Permite mudar hora (9:00, 14:00, 19:00)
- [ ] Salva preferência

**Test Type**: Unit (form)

---

### R9: Protocolo - Timer + Notificações + Checklist

**Given**: Usuário confirmou horário de preparo
**When**: Hora chega (ex: domingo 10:00)
**Then**:
- [ ] Notificação: "Hora de preparar a semana!"
- [ ] App abre com Protocolo estruturado
- [ ] Timer visível (00:00 de 120 min)
- [ ] Lista de passos com checkboxes
- [ ] Cada passo mostra tempo estimado

**Test Type**: E2E (notificação + interface + timer)

**Exemplo Visual**:
```
🍳 PROTOCOLO DE PREPARO - DOMINGO
Tempo: 00:00 / 120 minutos

[10:00] PASSO 1: Mise en Place (10 min)
  ☐ Cortar frango em filés
  ☐ Lavar brócolis
  ☐ Medir arroz

[PRÓXIMO] (ativa em 10 min)

[10:10] PASSO 2: Marinada (15 min)
  ☐ Marinar frango

[TIMER RODANDO: 08:45 restantes]
```

---

### R10: Protocolo - Notificação de Cada Passo

**Given**: Protocolo iniciado, passo completado
**When**: Usuário marca checkbox de um passo
**Then**:
- [ ] Notificação em < 5 segundos ("Ótimo! Próximo passo: ...")
- [ ] Timer inicia para próximo passo
- [ ] Visual atualiza (passo muda de cor)
- [ ] Progresso mostra (3/8 passos completos)

**Test Type**: Integration (notificação + timer + DB)

**QA Gate**: Latência < 2 segundos (p99: < 5s)

---

### R11: Protocolo - Conclusão & Recompensa

**Given**: Último passo foi marcado
**When**: Usuário completa todos os 8 passos
**Then**:
- [ ] Celebração visual (animação, fireworks)
- [ ] Badge: "Mestre do Preparo" ✨
- [ ] Pontos: +50
- [ ] Grid marcado: "Domingo - Protocolo Executado" ✓
- [ ] Refeições da semana aparecem com ingredients "prontos"

**Test Type**: E2E

---

### R12: Refeições Diárias - Preparo Rápido

**Given**: Protocolo do domingo completado, segunda chegou
**When**: Hora de comer (ex: 12:00 almoço)
**Then**:
- [ ] Notificação: "Tempo de comer conforme seu plano!"
- [ ] App mostra: "Almoço de hoje: Frango + Brócolis + Arroz (30 min)"
- [ ] Mostrar ingredientes já prontos (arroz feito, frango cozido)
- [ ] Tempo de montagem: ~5 minutos
- [ ] Botão: "Marquei que comi!" (ou "Mudei de plano")

**Test Type**: E2E

---

## 🔹 FEATURE 4: GRID DE CONSISTÊNCIA

### R13: Grid - Marcação Diária (Segunda-Domingo)

**Given**: Usuário recebe notificação de refeição
**When**: Usuário clica "Marquei que comi!"
**Then**:
- [ ] Grid atualiza: Dia marcado com ✓
- [ ] Pontos adicionados: +10
- [ ] Streak continua (se não quebrou)
- [ ] Feedback positivo: "Você está consistente!"

**Test Type**: E2E

---

### R14: Grid - Marcação Domingo (Protocolo)

**Given**: Protocolo completado no domingo
**When**: Último passo foi marcado
**Then**:
- [ ] Grid mostra domingo com "PROTOCOLO ✓" (destaque maior)
- [ ] Pontos adicionados: +50 (maior que dia normal)
- [ ] Combo detectado: Se domingo + 6 dias marcados = +100 pontos extras

**Test Type**: E2E

---

### R15: Grid - Progressão & Badges

**Given**: Dias estão sendo marcados
**When**: Atinge marcos (7, 21, 66 dias)
**Then**:
- [ ] **Dia 7**: Badge "Primeira Chama" 🔥 (desbloqueado)
- [ ] **Dia 21**: Badge "Ponto de Não Retorno" 🌊 (desbloqueado)
- [ ] **Dia 66**: Badge "Soberania Pessoal" 👑 (desbloqueado)
- [ ] Notificação + celebração visual
- [ ] Dashboard atualiza com narrativa progressiva

**Test Type**: E2E + Testes de Data (simular 7, 21, 66 dias)

---

### R16: Grid - Quebra de Streak

**Given**: Usuário não marca um dia
**When**: Dia passa sem marcar (depois das 23:59)
**Then**:
- [ ] Streak reseta para 0
- [ ] Grid mostra dia em branco (□)
- [ ] Mensagem: "Sua sequência foi quebrada. Volte amanhã!"
- [ ] Pontos acumulados não desaparecem (apenas streak)

**Test Type**: Integration (com simação de tempo)

---

## 🔹 FEATURE 5: MAPEAMENTO DA TRÍADE

### R17: Tríade - Registrar Comportamento

**Given**: Usuário comeu algo (dentro ou fora do plano)
**When**: Clica "Registrar refeição" ou "Registrar desvio"
**Then**:
- [ ] Pergunta 1: "O que você comeu?" (descrição)
- [ ] Pergunta 2: "Qual era seu COMPORTAMENTO?" (ação registrada)
- [ ] App compila dados (timestamp + alimento)

**Test Type**: Unit (form)

---

### R18: Tríade - Registrar Cognição

**Given**: Comportamento foi registrado
**When**: Usuário responde "O que você pensava?"
**Then**:
- [ ] Multiple choice ou texto:
  - [ ] "Preciso de comida para acalmar"
  - [ ] "Mereço me satisfazer"
  - [ ] "Tenho direito"
  - [ ] "Não aguento esperar"
  - [ ] Custom: usuário escreve
- [ ] Pensamento é salvo

**Test Type**: Unit (form)

---

### R19: Tríade - Registrar Afeto

**Given**: Comportamento + Cognição registrados
**When**: Usuário responde "Como você se sentia?"
**Then**:
- [ ] Escala emocional (emoji + label):
  - [ ] 😢 Triste
  - [ ] 😰 Ansioso
  - [ ] 😐 Neutro
  - [ ] 😊 Feliz
  - [ ] 🤩 Animado
- [ ] Intensidade (1-10 slider)
- [ ] Afeto é salvo

**Test Type**: Unit (form)

---

### R20: Tríade - Análise de Padrões

**Given**: 7+ dias de dados Tríade registrados
**When**: Usuário abre "Análise de Padrões"
**Then**:
- [ ] App identifica padrão: "Quando você se sente [AFETO], você pensa [COGNIÇÃO], então [COMPORTAMENTO]"
- [ ] Exemplos: "Quando ansioso (afeto), você pensa 'preciso comer' (cognição), come chocolate (comportamento)"
- [ ] Frequência do padrão (X vezes essa semana)
- [ ] Sugestão: "Próxima vez, tente [ALTERNATIVA]"

**Test Type**: Integration (análise de dados)

---

## 🔹 FEATURE 6: ENTENDA SUA ORIGEM

### R21: Origem - Quiz Personalidade

**Given**: Usuário novo acessa "Entenda Você"
**When**: Responde quiz (5 traços Big Five)
**Then**:
- [ ] **Conscienciosidade**: "Como você é com organização?" (slider 1-10)
- [ ] **Neuroticismo**: "Como é sua sensibilidade emocional?" (slider 1-10)
- [ ] **Extroversão**: "Você prefere multidão ou solitude?" (slider 1-10)
- [ ] **Amabilidade**: "Você é empático com outros?" (slider 1-10)
- [ ] **Abertura**: "Você é aberto a novas experiências?" (slider 1-10)

**Test Type**: Unit (form)

---

### R22: Origem - Quiz História de Vida

**Given**: Personalidade respondida
**When**: Quiz de história (7 categorias)
**Then**:
- [ ] **Infância**: "Você foi validado? Rejeitado? Abandonado?"
- [ ] **Relações**: "Como é sua relação com afeto/segurança?"
- [ ] **Comida**: "Qual é seu histórico com comida?"
- [ ] **Traumas**: "Teve eventos que marcaram?" (opcional)
- [ ] **Sucessos**: "Quais foram seus sucessos?" (opcional)
- [ ] **Padrões**: "Qual padrão você vê em si?"
- [ ] **Aprendizado**: "O que isso ensinou a você?"

**Test Type**: Unit (form)

---

### R23: Origem - Insight Identidade

**Given**: Personalidade + História respondidas
**When**: App analisa dados
**Then**:
- [ ] Mostra insight: "Você tem alta sensibilidade (neuroticismo) + história de abandono = identidade de 'preciso de comida para segurança'"
- [ ] Mensagem empática: "Não é fraqueza, é sua história. Vamos transformá-la."
- [ ] Oferece: "Quer transformar essa identidade?" (leva para Projeto de Vida)

**Test Type**: Integration

---

## 🔹 FEATURE 7: RASTREADOR DE CICLO

### R24: Ciclo - Fase Consciência (Dias 1-14)

**Given**: Usuário novo começa
**When**: Completa 1-14 dias de consistência
**Then**:
- [ ] App mostra: "Fase de Consciência - Você está despertando"
- [ ] Mensagens: "Cada dia é um passo"
- [ ] Foco: Padrão visível (Tríade se manifesta)
- [ ] Reforço: "Você vê o padrão agora, certo?"

**Test Type**: Integration (timeline logic)

---

### R25: Ciclo - Fase Transição (Dias 15-45)

**Given**: Usuário passou dia 14
**When**: Entra em dias 15-45
**Then**:
- [ ] App mostra: "Fase de Transição - Seu cérebro está adaptando"
- [ ] Mensagens: "Novo hábito se formando automaticamente"
- [ ] Foco: Padrão muda (tríade muda, novo comportamento emerge)
- [ ] Reforço: "Você está diferente!"

**Test Type**: Integration

---

### R26: Ciclo - Fase Consolidação (Dias 46-66)

**Given**: Usuário passou dia 45
**When**: Entra em dias 46-66
**Then**:
- [ ] App mostra: "Fase de Consolidação - Novo hábito automático"
- [ ] Mensagens: "Seu cérebro mudou. Isso é permanente."
- [ ] Foco: Identidade (não precisa pensar mais)
- [ ] Reforço: "Você É essa pessoa agora"

**Test Type**: Integration

---

## 🔹 FEATURE 8: SEU PROJETO DE VIDA

### R27: Projeto - Identidade Atual

**Given**: Usuário acessa "Seu Projeto de Vida"
**When**: Clica "Passo 1: Sua Identidade Atual"
**Then**:
- [ ] Pergunta aberta: "Como você é agora com comida?"
- [ ] Exemplos oferecidos: "Sou alguém que come para anestesiar", "Sou fraco de vontade", etc.
- [ ] Usuário escreve ou seleciona
- [ ] Descrição é salva

**Test Type**: Unit (form)

---

### R28: Projeto - Identidade Ideal

**Given**: Identidade atual descrita
**When**: Clica "Passo 2: Sua Identidade Ideal"
**Then**:
- [ ] Pergunta emocional: "QUEM VOCÊ QUER SER em relação à comida?"
- [ ] Não é "O que quero fazer", mas "Que tipo de pessoa quero ser"
- [ ] Exemplos: "Alguém em paz", "Alguém que se ama", "Alguém que ouve emoções"
- [ ] Descrição detalhada é salva

**Test Type**: Unit (form)

---

### R29: Projeto - Hábitos da Pessoa Ideal

**Given**: Identidade ideal descrita
**When**: Clica "Passo 3: Hábitos dessa pessoa"
**Then**:
- [ ] Pergunta: "O que essa pessoa faz?"
- [ ] Exemplos: "Bebe água quando ansiosa", "Faz exercício", "Meditação", "Conversa com amigos"
- [ ] App sugere baseado em identidade (IA)
- [ ] Usuário confirma/customiza

**Test Type**: Integration (IA suggestions)

---

### R30: Projeto - Escolher 1 Hábito Hoje

**Given**: Hábitos listados
**When**: Clica "Passo 4: Comece hoje"
**Then**:
- [ ] Pergunta: "Qual UM hábito você quer começar HOJE?"
- [ ] Opção: Escolher 1 dos sugeridos ou criar custom
- [ ] Descrição: "Não o que você DEVE fazer, mas o que ESSA PESSOA faria"
- [ ] Hábito é salvo (será rastreado nos próximos 66 dias)

**Test Type**: Unit (form)

---

### R31: Projeto - Rastreamento 66 Dias

**Given**: 1 hábito foi escolhido
**When**: Usuário marca hábito nos 66 dias
**Then**:
- [ ] Grid específico para esse hábito (paralelo ao grid geral)
- [ ] Cada marcação: "Você bebeu água! A pessoa que quer ser faria isso? SIM!"
- [ ] Reforço contínuo de identidade
- [ ] Progresso visual: X dias de Y dias

**Test Type**: E2E

---

## 🔹 FEATURE TRANSVERSAL: ONBOARDING

### R32: Onboarding - Caminho PDF

**Given**: Usuário novo no app
**When**: Seleciona "Tenho PDF do meu nutricionista"
**Then**:
- [ ] Upload PDF (forma)
- [ ] Quiz Identidade: "Quem você quer ser?"
- [ ] Setup das 4 features (check cada)
- [ ] Pronto para preparar

**Test Type**: E2E

---

### R33: Onboarding - Caminho Quiz

**Given**: Usuário novo no app
**When**: Seleciona "Não tenho PDF, quer que o app crie?"
**Then**:
- [ ] Quiz (Objetivo + Restrições + Preferências + CEP)
- [ ] IA gera cardápio
- [ ] Quiz Identidade: "Quem você quer ser?"
- [ ] Setup das 4 features
- [ ] Pronto para preparar

**Test Type**: E2E

---

### R34: Onboarding - Consent & Privacy

**Given**: Ambos caminhos completando
**When**: Antes de finalizar onboarding
**Then**:
- [ ] Mostra "Leia Política de Privacidade" (link)
- [ ] 3 checkboxes obrigatórios:
  - [ ] "Autorizo processamento de dados pessoais"
  - [ ] "Autorizo upload de PDF por IA"
  - [ ] "Autorizo armazenamento de histórico alimentar"
- [ ] Botão "Aceitar e Continuar" (desabilitado se não marcar)

**Test Type**: E2E

---

## 🔹 FEATURE CRÍTICA: NOTIFICAÇÕES

### R35: Notificação - Preparo Domingo

**Given**: Domingo às hora configurada chega
**When**: Timer dispara
**Then**:
- [ ] Notificação push: "🍳 Hora de preparar a semana! (120 min)"
- [ ] Botão: "Começar Agora" (abre protocolo)
- [ ] Latência: < 2 segundos (p99: < 5s)

**Test Type**: Integration (notificação engine)

---

### R36: Notificação - Refeição Diária

**Given**: Horário da refeição chega
**When**: Timer dispara (segunda-domingo, 3x por dia: 8h, 12h, 19h)
**Then**:
- [ ] Notificação push: "🍽️ Tempo de comer conforme seu plano!"
- [ ] Botão: "Marquei que comi" (marca grid)
- [ ] Latência: < 2 segundos

**Test Type**: Integration

---

### R37: Notificação - Protocolo Passo a Passo

**Given**: Protocolo em execução
**When**: Cada passo completado
**Then**:
- [ ] Notificação: "✅ Mise en Place feito! Próximo: Marinada (15 min)"
- [ ] Latência: < 2 segundos
- [ ] Timer inicia para próximo passo

**Test Type**: Integration

---

## 🔹 FEATURE PERFORMANCE & CONFIABILIDADE

### R38: Performance - Tempo de Carregamento

**Given**: Usuário abre app
**When**: Página carrega
**Then**:
- [ ] Time to Interactive: < 3 segundos
- [ ] Primeiros elementos: < 1.5 segundos
- [ ] Dados históricos: Lazy loaded (não no initial)

**Test Type**: Load testing

---

### R39: Performance - Grid Rendering

**Given**: Grid com 66+ dias
**When**: Usuário navega/scroll
**Then**:
- [ ] Frame rate: 60 FPS (smooth)
- [ ] Sem lag ao marcar
- [ ] Animações fluidas

**Test Type**: Performance testing

---

### R40: Confiabilidade - Sincronização Offline

**Given**: Usuário sem internet
**When**: Tenta marcar refeição/protocolo
**Then**:
- [ ] Ação salva localmente (service worker)
- [ ] Quando volta online: sync automático
- [ ] Sem duplicatas

**Test Type**: Integration (offline logic)

---

### R41: Confiabilidade - Tratamento de Erros

**Given**: API falha (timeout, 500 error)
**When**: Usuário tenta marcar/registrar
**Then**:
- [ ] Mensagem amigável: "Erro ao salvar. Tentando novamente..."
- [ ] Retry automático (3 tentativas)
- [ ] Se falhar: "Salvo localmente. Será sincronizado depois"
- [ ] Nunca perde dados

**Test Type**: Integration (error handling)

---

### R42: Acessibilidade

**Given**: Usuário com deficiência visual/motor
**When**: Usa app
**Then**:
- [ ] WCAG AA compliance (contrast, text size)
- [ ] Suporte a screen readers
- [ ] Navegação por teclado
- [ ] Labels acessíveis em inputs

**Test Type**: Accessibility audit

---

## 📊 MATRIZ DE RASTREABILIDADE

| ID | Feature | Requisito | Test Type | Status | Prioridade |
|----|---------|-----------|-----------|---------|----|
| R1 | PDF Upload | Armazenamento criptografado | E2E | ⏳ | P0 |
| R2 | OCR | Parsing de ingredientes (95%+) | Integration | ⏳ | P0 |
| R3 | Motor Logístico | Protocolo < 120 min | Integration | ⏳ | P0 |
| R4 | Lista Compras | Agrupação + remoção duplicatas | Integration | ⏳ | P1 |
| R5 | Quiz | Coleta Objetivo+Restrições+Pref | E2E | ⏳ | P0 |
| R6 | IA Cardápio | Gera com geolocalização | Integration | ⏳ | P0 |
| R7 | Customização | Preview + regenerar | E2E | ⏳ | P1 |
| R8 | Preparo - Agendamento | Selecionar dia/hora | Unit | ⏳ | P1 |
| R9 | Timer+Notif+Checklist | Protocolo step-by-step | E2E | ⏳ | P0 |
| R10 | Notif Passo | < 5s latência | Integration | ⏳ | P0 |
| R11 | Conclusão | Badge + pontos + grid | E2E | ⏳ | P1 |
| R12 | Refeições Diárias | Notificação + montagem | E2E | ⏳ | P1 |
| R13 | Grid Diário | Marcação seg-dom | E2E | ⏳ | P0 |
| R14 | Grid Domingo | Protocolo + combo | E2E | ⏳ | P0 |
| R15 | Badges | Dia 7, 21, 66 | E2E | ⏳ | P0 |
| R16 | Quebra Streak | Reset + msg | Integration | ⏳ | P1 |
| R17-R20 | Tríade | C+A+C + padrão | Integration | ⏳ | P1 |
| R21-R23 | Origem | Personalidade+História+Insight | Integration | ⏳ | P1 |
| R24-R26 | Ciclo | Fases conscienza/transição/consol | Integration | ⏳ | P1 |
| R27-R31 | Projeto de Vida | 5 passos + 66 dias | Integration | ⏳ | P0 |
| R32-R34 | Onboarding | PDF + Quiz + Consent | E2E | ⏳ | P0 |
| R35-R37 | Notificações | Preparo + refeição + passo | Integration | ⏳ | P0 |
| R38-R39 | Performance | Load < 3s, 60 FPS | Load test | ⏳ | P1 |
| R40-R41 | Confiabilidade | Offline + error handling | Integration | ⏳ | P1 |
| R42 | Acessibilidade | WCAG AA | Audit | ⏳ | P2 |

---

## ✅ QA GATE CRITERIA

### Todos os requisitos P0 devem:
- [ ] ✅ Ter teste automatizado (Unit/Integration/E2E)
- [ ] ✅ Passar em QA antes de merge
- [ ] ✅ Ter validação manual (5+ usuários)

### Requisitos P1 devem:
- [ ] ✅ Ter teste automatizado (mínimo)
- [ ] ✅ Passar em QA antes de MVP launch

### Requisitos P2 podem:
- [ ] ⭐ Ser tratados em Phase 2

---

**Requirements Traceability Matrix v1.0**
**Akrasia Killer MVP**
**31 de Janeiro de 2026**
