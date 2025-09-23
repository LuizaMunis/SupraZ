## Sugestões de Pull Requests

### PR 1 — Corrigir inconsistências no estado de processados
- Descrição: Unificar o formato do `processed_db.json` para uma chave raiz `processed` (lista de objetos `{ filename, hash, ts }`) usada por `api/status`. Atualizar `utils/io.py` para ler/gravar nesse formato, preservando retrocompatibilidade.
- Arquivos:
  - `src/utils/io.py`
  - `src/api/server.py` (ajuste de leitura se necessário)
- Justificativa: O `status` espera `processed_db.json` com chave `processed`, enquanto o utilitário atual grava um dicionário por hash. Isso impede contagem/visualização corretas.

### PR 2 — Corrigir template de e-mail para incluir `max_score`
- Descrição: Incluir `max_score = 100` no contexto ao renderizar e ajustar `notification.html` para usar variável disponível, garantindo consistência.
- Arquivos:
  - `src/notify/emailer.py` (passar `max_score`)
  - `src/notify/templates/notification.html` (garantir uso seguro da variável)
- Justificativa: O template referencia `result.max_score`, mas `ScoreResult` não possui esse campo. Hoje pode quebrar ou exibir vazio.

### PR 3 — Adicionar `.env.example` e validações de boot
- Descrição: Criar `.env.example` com todas as variáveis exigidas e validação inicial no `Settings` para campos obrigatórios (SMTP/GROQ) com mensagens de erro claras.
- Arquivos:
  - `.env.example` (novo)
  - `src/config.py` (mensagens claras quando valores obrigatórios ausentes)
- Justificativa: Onboarding e redução de erros de configuração.

### PR 4 — Add Docker healthcheck e CORS básico na API
- Descrição: 
  - Healthcheck Docker (com curl para `/health`) e `restart: unless-stopped` já existe; apenas garantir `HEALTHCHECK` no Dockerfile.
  - Ativar CORS permissivo por padrão em `server.py` (configurável via env).
- Arquivos:
  - `Dockerfile`
  - `src/api/server.py`
- Justificativa: Melhor operabilidade e integração com frontends/ops.

### PR 5 — Testes mínimos e CI
- Descrição: Adicionar testes unitários para `chunk_pages`, `robust_json_parse`, `heuristic_fallback` e status da API; configurar GitHub Actions para lint+test.
- Arquivos:
  - `tests/test_chunking.py`, `tests/test_scoring_parse.py` (já citados no README; conferir/atualizar)
  - `.github/workflows/ci.yml` (novo)
- Justificativa: Segurança de mudanças e qualidade contínua.

### PR 6 — Harden do Google Drive Monitor
- Descrição: 
  - Tratar ausência de `drive_token.json` com mensagem de ação e link de doc.
  - Backoff exponencial em erros e proteção contra looping infinito quando API falha.
- Arquivos:
  - `src/drive/final_monitor.py`
- Justificativa: Resiliência em produção.

### PR 7 — Parâmetros de concorrência e limites do LLM
- Descrição: Tornar `MAX_CHUNKS_PER_BATCH`, `GROQ_MAX_TOKENS_PER_REQUEST` e `LLM_TIMEOUT` ajustáveis por env e logar valores no boot.
- Arquivos:
  - `src/config.py`
  - `src/llm/groq.py`
- Justificativa: Controle de custo e performance.

### PR 8 — Suporte a DOCX (Word) na ingestão
- Descrição: Adicionar suporte a `.docx` via `python-docx`, com pipeline unificado de extração e validação de MIME no `/upload`.
- Arquivos:
  - `requirements.txt`
  - `src/pdf/extract.py` (ou módulo `docx/extract.py`)
  - `src/api/server.py` (validar extensões)
- Justificativa: A ata pede upload de Word além de PDF.

### PR 9 — Ingestão e matching de atestados
- Descrição: Ler pasta de atestados, extrair métricas/quantidades e armazenar JSON estruturado; implementar somatório e equivalências no matching contra requisitos do edital.
- Arquivos:
  - `src/utils/io.py` (novas funções de leitura/indexação)
  - `src/scoring/evaluate.py` (matching e relatório)
  - `src/config.py` (caminho dos atestados)
- Justificativa: Habilitação técnica é um dos 5 pilares do MVP.

### PR 10 — Equivalências configuráveis (HST/UST/PF)
- Descrição: Parametrizar equivalências via `.env` ou arquivo JSON (ex.: `PF=8h`), aplicar no matching e logar conversões usadas no relatório.
- Arquivos:
  - `src/config.py`
  - `src/scoring/evaluate.py`
- Justificativa: Editais/atestados usam nomenclaturas diferentes.

### PR 11 — Tela mínima de Validação GO/NO GO
- Descrição: Página simples servida pela API para visualizar o relatório e registrar decisão GO/NO GO (persistência em JSON no `state_dir`).
- Arquivos:
  - `src/api/server.py` (rotas)
  - `src/utils/io.py` (persistência de decisões)
  - `src/notify/templates/` (se necessário)
- Justificativa: Alinha com a ata para decisão rápida dos diretores.
