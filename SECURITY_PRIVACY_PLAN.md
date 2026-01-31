# 🔒 SECURITY & PRIVACY PLAN
## AKRASIA KILLER MVP - Compliance & Data Protection

**Data**: 31 de Janeiro de 2026
**Owner**: @architect
**Status**: ✅ PRONTO PARA IMPLEMENTAÇÃO
**Compliance**: LGPD (Lei Geral de Proteção de Dados)

---

## 📋 EXECUTIVE SUMMARY

Akrasia Killer coleta e processa dados sensíveis de saúde (PDFs nutricionais, identidade, comportamento alimentar). Este plano garante compliance com LGPD e implementa proteção máxima.

**Risk Level**: 🔴 ALTO (dados de saúde)
**Compliance**: LGPD + Práticas de Segurança de Dados Sensíveis
**Implementation**: MVP (semana 1-2)

---

## 🔐 DADOS SENSÍVEIS COLETADOS

### Categoria 1: PDFs Nutricionais
- **O quê**: Refeições, ingredientes, macros nutricionais
- **Origem**: Upload do usuário (nutricionista)
- **Sensibilidade**: 🟠 MÉDIO (pode revelar condições médicas)
- **Exemplos**: "Dieta para diabético", "Plano pós-cirúrgico"

### Categoria 2: Identidade & Personalidade
- **O quê**: Traços de personalidade (neuroticismo, conscienciosidade), história de vida (traumas, rejeições)
- **Origem**: Quiz do app
- **Sensibilidade**: 🔴 ALTO (informação íntima)
- **Exemplos**: "Abandonado na infância", "Alto grau de ansiedade"

### Categoria 3: Comportamento Alimentar & Emocional
- **O quê**: O que come, quando come, como se sente (Tríade: Comportamento + Cognição + Afeto)
- **Origem**: Rastreamento diário
- **Sensibilidade**: 🔴 ALTO (padrão comportamental)
- **Exemplos**: "Como doce quando ansioso", "Coma em segredo"

### Categoria 4: Grid de Consistência (Menos Sensível)
- **O quê**: Dias marcados (executou protocolo, seguiu plano)
- **Origem**: Marcação app
- **Sensibilidade**: 🟡 BAIXO (apenas dias)
- **Risco**: Pode inferir rotina, estado emocional

---

## 🛡️ ARQUITETURA DE SEGURANÇA

### 1. Criptografia em Trânsito

**Implementação**:
```
Client → HTTPS TLS 1.3
↓
API Gateway → mTLS (certificate-based)
↓
Backend Services → AES-256 internamente
```

**Requisitos**:
- ✅ Certificado SSL válido (Let's Encrypt free)
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ Cipher suites: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- ✅ Perfect Forward Secrecy habilitado
- ✅ No suporte a HTTP (apenas HTTPS)

**QA Gate**:
- [ ] SSL test (ssllabs.com) = A+
- [ ] HSTS header presente
- [ ] TLS 1.3 ativo

---

### 2. Criptografia em Repouso

**PDFs Nutricionais**:
```
Upload PDF
  ↓
[AES-256 encryption]
  ↓
Armazenamento S3/GCP (encrypted at rest)
  ↓
Decriptado apenas quando IA processa
```

**Dados de Usuário (DB)**:
```
PostgreSQL com:
- Encryption at rest (AES-256)
- Encrypted columns: identidade, tríade, projeto_vida
- PII masked: emails, telefones
```

**Requisitos**:
- ✅ Chave de criptografia: Armazenada em AWS KMS / Google Cloud KMS (não no código)
- ✅ Rotação de chaves: Anual
- ✅ Criptografia seletiva: Apenas colunas sensíveis
- ✅ Backup encriptado

**QA Gate**:
- [ ] Auditar criptografia em BD
- [ ] Verificar rotação de chaves

---

### 3. Controle de Acesso

**Princípio**: Least Privilege (mínimo necessário)

**Usuários**:
- Access: Apenas seus próprios dados
- Role-based: `user`, `admin`, `support`
- MFA obrigatório para admin

**IA (Claude API)**:
- Access: Apenas PDF + metadata necessária
- Sem acesso a: identidade do usuário, histórico de comportamento
- Request logging: Cada chamada fica registrada

**Backend**:
- Serviços isolados: PDF processing, identidade, grid
- Service-to-service: mTLS
- API keys: Rotacionadas mensalmente

**Requisitos**:
- ✅ JWT tokens com expiração (1 hora)
- ✅ Refresh tokens armazenados seguros (httpOnly cookie)
- ✅ Session timeout (15 minutos inatividade)
- ✅ Logout revoga tokens

**QA Gate**:
- [ ] Testar acesso cross-user (não pode ver dados de outro)
- [ ] Testar JWT expiração
- [ ] Testar logout revogação

---

### 4. Processamento de IA (Claude API)

**Risco**: Dados enviados a Claude para OCR + geração de cardápio

**Mitigação**:
```
Dados Sensíveis
  ↓
[Anonimização]
  ↓
PDF → Claude (apenas texto estruturado, sem metadata)
Cardápio request → Claude (apenas objetivo + restrições + CEP, sem história pessoal)
  ↓
[Resultado criptografado]
  ↓
Armazenado localmente
```

**Requisitos**:
- ✅ Consentimento explícito: "Seu PDF será processado por IA Claude"
- ✅ Política de retenção: Claude não retém dados (disable logging)
- ✅ Dados anonimizados antes de enviar
- ✅ No send: identidade, história de vida, padrão de comportamento

**QA Gate**:
- [ ] Verificar se dados sensíveis são anonimizados
- [ ] Confirmar logging desativado na Claude API
- [ ] Testar com dados fictícios (não reais)

---

## 📜 COMPLIANCE LGPD

### Direitos do Usuário (LGPD Art. 18)

| Direito | Implementação | Timeline |
|---------|---------------|----------|
| **Acesso** | API: GET /user/data (JSON com todos dados) | 30 dias |
| **Retificação** | PUT /user/data (editar campos sensíveis) | 30 dias |
| **Exclusão** | DELETE /user/data (apagar tudo, GDPR right to be forgotten) | 30 dias |
| **Portabilidade** | GET /user/export (download JSON/CSV) | 30 dias |
| **Objeção** | Opt-out de IA processing, marketing | Imediato |

**Requisitos**:
- ✅ Interface no app: "Seus Dados" seção
- ✅ Autenticação: Requer login + verificação email
- ✅ Logging: Cada request registrado (audit trail)
- ✅ Confirmação: Email confirma deletion

**QA Gate**:
- [ ] Testar acesso a dados (retorna tudo?)
- [ ] Testar exclusão (deleta do DB?)
- [ ] Testar exportação (JSON válido?)

---

### Consentimento (LGPD Art. 8)

**Onboarding Flow**:
```
1. "Ler Política de Privacidade" (link obrigatório)
2. Checkbox: "Autorizo processamento de dados pessoais"
3. Checkbox: "Autorizo upload e processamento de PDF por IA"
4. Checkbox: "Autorizo armazenamento de histórico alimentar"
5. Botão "Aceitar e Continuar" (sem aceitar, não entra)
```

**Requisitos**:
- ✅ Consentimento granular (não tudo de uma vez)
- ✅ Opt-in (não opt-out padrão)
- ✅ Fácil revogação: "Revogar consentimento" em Settings
- ✅ Registro de consentimento: Data + hora + versão política

**Texto a Incluir**:
```
"Seus dados serão:
- Armazenados em servidores criptografados
- Processados por IA para gerar cardápios
- Nunca vendidos a terceiros
- Deletados se solicitado
Você pode alterar consentimento em Configurações a qualquer hora."
```

**QA Gate**:
- [ ] Testar consent flow (não pode entrar sem marcar)
- [ ] Testar revogação (função)

---

### Política de Retenção

| Dados | Retenção | Motivo |
|-------|----------|--------|
| **Conta Ativa** | Enquanto ativo | Necessário para serviço |
| **Após Deletar Conta** | 90 dias | Recuperação/legal |
| **Backups** | 180 dias | Disaster recovery |
| **Logs de Acesso** | 30 dias | Security audit |
| **Grid/Histórico** | 2 anos | Valor para usuário |

**Requisitos**:
- ✅ Política clara em Privacidade
- ✅ Cleanup automático (job scheduled)
- ✅ Backup retenção: Criptografado, isolado

**QA Gate**:
- [ ] Verificar cleanup job (corre mensalmente?)
- [ ] Verificar se dados deletados saem do backup também

---

## 🚨 SEGURANÇA DE APLICAÇÃO

### Vulnerabilidades Críticas (OWASP Top 10)

#### A1: Injection
**Risco**: SQL injection via PDF parsing, cardápio input

**Mitigação**:
```
❌ NUNCA: Execute SQL raw
  DELETE FROM users WHERE id = ${input}

✅ SIM: Prepared statements
  const query = 'DELETE FROM users WHERE id = ?'
  db.run(query, [input])
```

**QA Gate**:
- [ ] Code review: Buscar raw SQL (grep -r "query\`")
- [ ] Teste: Injetar "; DROP TABLE users; --" em quiz

#### A2: Broken Authentication
**Risco**: Bypass de login, token hijacking

**Mitigação**:
- ✅ Hash passwords: bcrypt (não MD5/SHA1)
- ✅ JWT: Assinar com chave secreta (RS256, não HS256 fraco)
- ✅ Rate limiting: 5 tentativas de login = bloqueio 15 min
- ✅ Session timeout: 1 hora inatividade

**QA Gate**:
- [ ] Teste: Múltiplas tentativas login
- [ ] Teste: Usar token antigo (deve falhar)

#### A3: Sensitive Data Exposure
**Risco**: Dados sensíveis em logs, erro messages, network

**Mitigação**:
- ✅ Logs: Nunca logar passwords, tokens, PDFs
- ✅ Erros: "Erro ao processar" (não detalhes)
- ✅ HTTPS: Sempre (nunca HTTP)
- ✅ Headers: No X-Powered-By (esconde stack)

**QA Gate**:
- [ ] Buscar logs por "password", "token", "secret"
- [ ] Testar erro message (genérica ou detalhada?)

#### A4: XML External Entity (XXE)
**Risco**: PDFs podem conter XML malicioso

**Mitigação**:
- ✅ Validar upload: Apenas .pdf (magic bytes)
- ✅ Scan antivirus: ClamAV ou similar
- ✅ Não parsear XML raw

**QA Gate**:
- [ ] Testar upload de arquivo malicioso

#### A5: Broken Access Control
**Risco**: Usuário A vê dados de usuário B

**Mitigação**:
- ✅ Autorização em cada endpoint: `if user.id != requested_user_id return 403`
- ✅ Row-level security (BD): User vê apenas suas linhas

**QA Gate**:
- [ ] Teste cross-user (modificar user_id na request)

#### A7: Cross-Site Scripting (XSS)
**Risco**: Injetar script em cardápio, tríade, projeto vida

**Mitigação**:
- ✅ Sanitize input: `DOMPurify` (remove <script>)
- ✅ Content-Security-Policy header
- ✅ Escape output: Nunca `.innerHTML`, usar `.textContent`

**QA Gate**:
- [ ] Testar: Injetar `<img src=x onerror=alert('xss')>` em quiz

---

### Network & Infrastructure Security

**Requisitos**:
- ✅ Firewall: Bloquer acesso direto ao DB (apenas via API)
- ✅ WAF (Web Application Firewall): Bloquear ataques comuns
- ✅ DDoS protection: CloudFlare ou similar
- ✅ VPC/Network isolation: Dados sensíveis em subnet privada
- ✅ No public S3 bucket: PDFs armazenados com acesso privado

**QA Gate**:
- [ ] Verificar que S3 bucket é privado
- [ ] Verificar que DB não é acessível externamente

---

## 📋 AUDIT & COMPLIANCE CHECKLIST

### Antes do MVP Launch

**Segurança**:
- [ ] SSL test = A+ (ssllabs.com)
- [ ] Vulnerabilidades OWASP testadas (pelo menos Top 5)
- [ ] Passwords hasheados com bcrypt
- [ ] Tokens JWT com expiração
- [ ] Rate limiting login ativo
- [ ] Logs nunca contêm secrets

**LGPD**:
- [ ] Política de Privacidade publicada (clara, PT-BR)
- [ ] Consent granular no onboarding
- [ ] API /user/data funciona (GET dados)
- [ ] API /user/delete funciona (DELETE conta)
- [ ] API /user/export funciona (download dados)
- [ ] Dados deletados em 30 dias

**Criptografia**:
- [ ] PDFs criptografados em repouso (AES-256)
- [ ] Dados sensíveis criptografados no DB
- [ ] Chaves em KMS (não no código)
- [ ] Backup encriptado

**IA/Claude API**:
- [ ] Consentimento explícito no app
- [ ] Dados anonimizados antes de enviar
- [ ] Logging desativado (no retenção dados)
- [ ] Teste com dados fictícios

**Auditoria**:
- [ ] Logging de acessos ativado
- [ ] Audit trail para CRUD de dados sensíveis
- [ ] Logs retidos por 30 dias
- [ ] Alertas para atividades suspeitas

---

## 🚀 IMPLEMENTATION ROADMAP

### Week 1 (MVP Foundation)
- [ ] Implementar TLS 1.3 + HSTS
- [ ] Configurar DB encryption (AES-256)
- [ ] Implementar bcrypt para passwords
- [ ] Setup KMS para chaves

### Week 2 (LGPD + Consentimento)
- [ ] Escrever Política de Privacidade
- [ ] Implementar consent flow (granular)
- [ ] Implementar /user/data API
- [ ] Implementar /user/delete API

### Week 3 (Application Security)
- [ ] Input validation + sanitization (DOMPurify)
- [ ] SQL injection prevention (prepared statements)
- [ ] XSS protection (CSP header)
- [ ] Rate limiting

### Week 4 (Testing + Audit)
- [ ] Security testing (OWASP Top 5)
- [ ] LGPD compliance audit
- [ ] Code review vulnerabilities
- [ ] SSL test (A+)

---

## 📞 CONTACTS & ESCALATION

**Security Issues**:
- Report to: security@akrasia-killer.com (setup antes do launch)
- Response time: 24 horas
- Fix time: 7 dias (critical), 30 dias (high)

**LGPD Data Requests**:
- Response: 30 dias (LGPD mandatório)
- Process: Verificar identidade → Providenciar dados
- Delete: Confirmação email antes de deletar

---

## ✅ APPROVAL

Este plano deve ser:
1. ✅ Revisado por @architect (tech security)
2. ✅ Revisado por Legal/Compliance (LGPD)
3. ✅ Aprovado pelo @pm
4. ✅ Implementado 100% antes do MVP launch

**Risco de não implementar**: Multas LGPD (até 2% faturamento) + reputacional

---

**Security & Privacy Plan v1.0**
**Akrasia Killer MVP**
**31 de Janeiro de 2026**
