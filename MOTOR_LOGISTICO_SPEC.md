# ⚙️ MOTOR LOGÍSTICO - TECHNICAL SPECIFICATION
## PDF → Protocolo Executável (< 120 minutos)

**Data**: 31 de Janeiro de 2026
**Owner**: @architect
**Status**: ✅ PRONTO PARA IMPLEMENTAÇÃO
**Technology**: Claude API (GPT-4 Vision) + OCR + Prompt Engineering

---

## 🎯 VISÃO

O **Motor Logístico** transforma PDFs nutricionais complexos em **protocolos executáveis binários**:

```
📄 PDF (Receita)
   ↓
🤖 IA (OCR + Claude)
   ↓
📋 Protocolo (Passos sequenciais)
   ↓
⏱️ Timer + Checklist (Execução < 120 min)
```

**Objetivo**: Reduzir carga cognitiva ("não cozinho, apenas executo protocolo")

---

## 📥 INPUT: PDF NUTRICIONAL

### Formato Esperado

PDFs vêm de nutricionistas com estrutura típica:

```
PLANO SEMANAL - [Nome Usuário]

SEGUNDA
└─ Café: Aveia, leite, banana
└─ Almoço: Frango grelhado, brócolis, arroz integral
└─ Lanche: Maçã com amendoim
└─ Jantar: Omelete com vegetais

TERÇA
└─ [similar]

...

VALORES NUTRICIONAIS (por refeição):
Proteína: 40g
Carboidratos: 50g
Gordura: 15g
```

### Variações Reais

PDFs podem ser:
- ✅ Texto estruturado (ideial)
- ✅ Tabelas (comum)
- ⚠️ Imagens scaneadas (OCR necessário)
- ⚠️ Handwriting (improvável, ignorar)
- ❌ PDFs protegidos (rejeitar)

---

## 🔄 PROCESSO: 3 ESTÁGIOS

### ESTÁGIO 1: OCR & EXTRAÇÃO

**Input**: PDF (até 10MB)
**Output**: Texto estruturado + Metadados

#### 1.1 Upload & Validação
```python
def validate_pdf(file):
    # Validação
    if file.size > 10*1024*1024:  # 10MB max
        return ERROR("PDF muito grande")

    if file.mime_type != "application/pdf":
        return ERROR("Arquivo não é PDF")

    if is_password_protected(file):
        return ERROR("PDF protegido")

    return OK(file)
```

#### 1.2 OCR com Claude Vision
```python
def extract_text_from_pdf(pdf_file):
    """
    Converte PDF em texto usando Claude Vision API
    """
    # Renderizar PDF em imagens (1 img por página)
    images = pdf_to_images(pdf_file)

    extracted_text = ""
    for img in images:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": img_base64
                            }
                        },
                        {
                            "type": "text",
                            "text": """
                            Extrair EXATAMENTE o texto deste PDF.
                            Manter formatação:
                            - Nomes de refeições (Café, Almoço, etc)
                            - Ingredientes (com quantidades)
                            - Valores nutricionais se houver

                            NÃO interpretar, apenas extrair texto.
                            """
                        }
                    ]
                }
            ]
        )
        extracted_text += response.content[0].text + "\n"

    return extracted_text
```

#### 1.3 Estruturação
```python
def structure_extracted_text(raw_text):
    """
    Estrutura texto em JSON
    Identifica: Dias, Refeições, Ingredientes, Macros
    """
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=3000,
        messages=[
            {
                "role": "user",
                "content": f"""
                Estruture este plano nutricional em JSON:

                {raw_text}

                Retorne JSON com esta estrutura:
                {{
                    "plan": [
                        {{
                            "day": "segunda",
                            "meals": [
                                {{
                                    "type": "café",
                                    "ingredients": [
                                        {{"name": "aveia", "amount": "50g"}},
                                        {{"name": "leite", "amount": "200ml"}}
                                    ],
                                    "macros": {{
                                        "protein_g": 10,
                                        "carbs_g": 45,
                                        "fat_g": 5
                                    }}
                                }}
                            ]
                        }}
                    ]
                }}
                """
            }
        ]
    )

    json_text = response.content[0].text
    parsed = json.loads(json_text)
    return parsed
```

---

### ESTÁGIO 2: TRANSFORMAÇÃO EM PROTOCOLO

**Input**: JSON estruturado
**Output**: Protocolo Binário (passos sequenciais)

#### 2.1 Prompt Engineering para Protocolo

```python
def generate_protocol(structured_data):
    """
    Transforma refeições em passos de protocolo
    Foco: Mise en place → Marinada → Cozimento → Corte → Montagem
    """

    meals_text = json.dumps(structured_data, indent=2)

    prompt = f"""
    Transforme este plano nutricional em PROTOCOLO EXECUTÁVEL para Domingo:

    {meals_text}

    IMPORTANTE:
    1. Combine TODAS as refeições da semana em 1 preparo
    2. Agrupe ingredientes similares (todo arroz junto, toda carne junto, etc)
    3. Estruture em PASSOS BINÁRIOS:
       - Mise en Place (preparação de ingredientes)
       - Marinada (se necessário)
       - Cozimento (forno, panela, etc)
       - Corte/Processamento (picar, moer, etc)
       - Montagem/Armazenamento
    4. TEMPO TOTAL: Máximo 120 minutos
    5. Cada passo deve ter tempo estimado

    Formato esperado:
    {{
        "protocol": [
            {{
                "step_number": 1,
                "step_name": "MISE EN PLACE",
                "description": "Preparar e organizar todos os ingredientes",
                "actions": [
                    {{"action": "Cortar frango em filés", "time_minutes": 5}},
                    {{"action": "Lavar e picar brócolis", "time_minutes": 3}}
                ],
                "total_time_minutes": 8,
                "cumulative_time_minutes": 8
            }}
        ],
        "total_protocol_time_minutes": 120,
        "meals_covered": ["segunda", "terça", "quarta"],
        "storage_instructions": "Armazenar em potes vidro, geladeira, duração 3 dias"
    }}
    """

    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4000,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    protocol_text = response.content[0].text
    protocol = json.loads(protocol_text)
    return protocol
```

#### 2.2 Exemplos Reais (Few-Shot Learning)

Para melhorar qualidade, incluir exemplos no prompt:

```python
PROTOCOL_EXAMPLES = """
EXEMPLO 1: Frango + Brócolis + Arroz

INPUT (Refeições):
- Almoço: Frango grelhado, brócolis, arroz integral
- Jantar: Frango com legumes, brócolis, batata doce
- Lanche: Salada (alface, brócolis)

OUTPUT (Protocolo):
PASSO 1: MISE EN PLACE (10 min)
├─ Cortar todo frango em filés (200g × 5 dias) = 1000g
├─ Lavar brócolis, separar flores (3 cabeças)
├─ Descascar batata doce, cortar em cubos
├─ Lavar alface, secar em centrífuga
Total: 10 min

PASSO 2: MARINADA (15 min)
├─ Marinar frango: limão + sal + alho (15 min)
├─ Deixar repouso

PASSO 3: COZINHAR BRÓCOLIS (5 min)
├─ Água fervendo + sal
├─ Brócolis 5 min (al dente)
├─ Resfriare armazenar em pote

PASSO 4: COZINHAR BATATA DOCE (20 min)
├─ Fogo alto, depois médio
├─ 20 min até macio
├─ Esfriar

PASSO 5: GRELHAR FRANGO (15 min)
├─ Lote 1: 5 filés × 3 min cada lado = 6 min
├─ Lote 2: 5 filés × 3 min cada lado = 6 min
├─ Lote 3: 5 filés × 3 min cada lado = 6 min
├─ Total: ~18 min (com descanso 1 min entre lotes)

PASSO 6: COZINHAR ARROZ (20 min)
├─ Fogo alto: água fervendo + arroz
├─ Depois fogo baixo, tampado
├─ 15 min até pronto

PASSO 7: ARMAZENAMENTO (10 min)
├─ Pote 1: Frango + Brócolis (segunda, terça)
├─ Pote 2: Frango + Brócolis (quarta, quinta)
├─ Pote 3: Frango + Batata (sexta)
├─ Pote 4: Salada (segunda, terça, quarta - preparar a cada 3 dias)
├─ Arroz: Distribua entre potes

TEMPO TOTAL: ~93 minutos
"""
```

---

### ESTÁGIO 3: FORMATAÇÃO PARA APP

**Input**: Protocolo estruturado
**Output**: UI-ready JSON (para timer + checklist)

#### 3.1 Transformação para Timer

```python
def format_for_timer(protocol):
    """
    Converte protocolo em formato pronto para timer + notificações
    """

    timer_steps = []
    cumulative_time = 0

    for step in protocol["protocol"]:
        timer_steps.append({
            "step_id": step["step_number"],
            "step_name": step["step_name"],
            "description": step["description"],
            "start_time": cumulative_time,
            "duration_minutes": step["total_time_minutes"],
            "checklist_items": [
                {
                    "item_id": f"{step['step_number']}-{i+1}",
                    "text": action["action"],
                    "duration_minutes": action["time_minutes"],
                    "checked": False
                }
                for i, action in enumerate(step["actions"])
            ]
        })
        cumulative_time += step["total_time_minutes"]

    return {
        "protocol_id": str(uuid.uuid4()),
        "total_duration_minutes": protocol["total_protocol_time_minutes"],
        "steps": timer_steps,
        "meals_covered": protocol["meals_covered"],
        "storage": protocol["storage_instructions"]
    }
```

#### 3.2 JSON Schema Final

```json
{
    "protocol_id": "uuid-...",
    "created_at": "2026-01-31T10:00:00Z",
    "user_id": "user-...",
    "pdf_filename": "Plano_Nutricional.pdf",

    "total_duration_minutes": 95,
    "target_start_time": "2026-02-02T10:00:00Z",  # Domingo 10:00

    "steps": [
        {
            "step_id": 1,
            "step_name": "MISE EN PLACE",
            "description": "Preparar e organizar ingredientes",
            "start_time": 0,
            "duration_minutes": 10,
            "checklist_items": [
                {
                    "item_id": "1-1",
                    "text": "Cortar frango em filés (1000g)",
                    "duration_minutes": 5,
                    "checked": false,
                    "notification_at": 0  # Notifica no início
                },
                {
                    "item_id": "1-2",
                    "text": "Lavar brócolis, separar flores",
                    "duration_minutes": 3,
                    "checked": false,
                    "notification_at": 0
                }
            ]
        },
        {
            "step_id": 2,
            "step_name": "MARINADA",
            "description": "Marinar frango",
            "start_time": 10,
            "duration_minutes": 15,
            "checklist_items": [
                {
                    "item_id": "2-1",
                    "text": "Colocar frango em marinada (limão + sal + alho)",
                    "duration_minutes": 2,
                    "checked": false,
                    "notification_at": 10
                },
                {
                    "item_id": "2-2",
                    "text": "Deixar em repouso",
                    "duration_minutes": 13,
                    "checked": false,
                    "notification_at": 10
                }
            ]
        }
    ],

    "meals_covered": ["segunda", "terça", "quarta", "quinta", "sexta"],
    "storage_instructions": "Armazenar em potes vidro, geladeira, duração 3 dias",

    "shopping_list": [
        {
            "ingredient": "Frango filé",
            "amount": "1000g",
            "category": "Proteínas"
        },
        {
            "ingredient": "Brócolis",
            "amount": "3 cabeças",
            "category": "Vegetais"
        }
    ]
}
```

---

## 🛡️ VALIDAÇÃO & QA

### Accuracy Checks

**Validação 1: Ingredientes Extraídos**
```python
def validate_ingredients_extracted(original_pdf, extracted_json):
    """
    Comparar ingredientes do PDF com JSON extraído
    Target: 95%+ accuracy
    """

    # Manual QA: Ler PDF, contar ingredientes
    # Compare com extracted_json["ingredients"]

    match_rate = matched_ingredients / total_ingredients

    if match_rate < 0.95:
        log_quality_issue("Low ingredient extraction rate", match_rate)
        return NEEDS_MANUAL_REVIEW

    return OK
```

**Validação 2: Tempo Total < 120 min**
```python
def validate_protocol_timing(protocol):
    """
    Garantir que protocolo cabe em 120 minutos
    """

    if protocol["total_protocol_time_minutes"] > 120:
        # Automático: Sugerir paralelização
        return WARN("Protocolo > 120 min. Sugerir paralelizar passos")

    return OK
```

**Validação 3: Passos Sequenciais**
```python
def validate_protocol_steps(protocol):
    """
    Garantir que passos fazem sentido logicamente
    """

    # Verificar que:
    # 1. Mise en place vem primeiro
    # 2. Cozimento antes de corte
    # 3. Armazenamento por último

    if not is_logical_sequence(protocol["steps"]):
        return NEEDS_MANUAL_REVIEW("Passos fora de ordem")

    return OK
```

---

### Testing Strategy

#### Manual Testing (20+ PDFs)
```
✅ PDF 1: Simples (arroz + frango + brócolis)
   Result: PASSA

✅ PDF 2: Complexo (múltiplas proteínas, alergias)
   Result: PASSA

✅ PDF 3: Com tabelas
   Result: PASSA

✅ PDF 4: Escanear (imagem)
   Result: PASSA com 92% OCR

⚠️ PDF 5: Proteção (senha)
   Result: FALHA (esperado, tratado)
```

#### QA Gate
- [ ] 20 PDFs testados manualmente
- [ ] 95%+ accuracy em ingredientes
- [ ] 100% < 120 minutos
- [ ] 100% sequência lógica
- [ ] Score final: PASS

---

## 🚀 IMPLEMENTATION ROADMAP

### Week 1: MVP Core
- [ ] PDF upload + validação
- [ ] OCR com Claude Vision
- [ ] Extração básica (ingredientes)
- [ ] Protocolo básico (sem otimização)

### Week 2: Polish
- [ ] Estruturação JSON
- [ ] Validação de acuracy
- [ ] Few-shot learning (exemplos no prompt)
- [ ] Timer formatting

### Week 3: Testing
- [ ] 20 PDFs testados
- [ ] Refinement baseado em erros
- [ ] Performance optimization
- [ ] Error handling

### Week 4: QA & Launch
- [ ] QA final
- [ ] Security review (dados sensíveis)
- [ ] Documentação
- [ ] Beta launch

---

## 💰 COST ESTIMATION

**Claude API Pricing** (Jan 2026):
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens

**Por PDF (estimar)**:
- OCR (vision): ~1000 tokens input, ~500 tokens output
- Estruturação: ~2000 tokens input, ~1000 tokens output
- Protocolo: ~3000 tokens input, ~2000 tokens output
- **Total**: ~6000 tokens input, ~3500 tokens output

**Custo por PDF**:
- Input: (6000 / 1M) × $3 = $0.018
- Output: (3500 / 1M) × $15 = $0.0525
- **Total**: ~$0.07 por PDF

**MVP Projections** (1000 usuários):
- 100% upload PDF na semana 1 = 1000 processamentos
- Custo semana 1: 1000 × $0.07 = $70
- Mensal (steady): 300 novos users × $0.07 = $21 + 300 reutilizações × $0.035 (cache) = $31/mês

**Caching Strategy**: Se usuário re-usa PDF (regenera cardápio), usar cache (50% do custo)

---

## 🎯 SUCCESS CRITERIA

| Critério | Target | Medida |
|----------|--------|--------|
| **OCR Accuracy** | 95%+ | Ingredientes extraídos vs. PDF |
| **Protocolo Quality** | 90%+ | Usuários marcam "útil" |
| **Tempo < 120 min** | 100% | Protocolos gerados |
| **Latência** | < 30s | Tempo resposta IA |
| **Custo** | < $0.10 | Por PDF processado |

---

## ⚠️ FALLBACK STRATEGY

Se Motor Logístico falhar:

**Opção 1: Template Fallback**
- App tem 20 templates pré-prontos (arroz+frango, macarrão+carne, etc)
- Usuário escolhe template similar ao PDF
- Não é perfeito, mas funciona

**Opção 2: Manual Structuring**
- Se IA falha, interface manual para usuário estruturar
- Mais trabalho, mas garante que funciona

**Opção 3: Rollback**
- Se > 20% PDFs falham, voltar para MVP sem Motor Logístico
- Apenas Gerador de Cardápio (sem PDF reader)

---

**Motor Logístico Specification v1.0**
**Akrasia Killer MVP**
**31 de Janeiro de 2026**
