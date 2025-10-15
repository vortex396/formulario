/*
  # Tabela de Clientes de Tarô

  1. Nova Tabela
    - `tarot_clients`
      - `id` (uuid, chave primária) - Identificador único
      - `nome_completo` (text) - Nome completo do cliente
      - `email` (text) - E-mail do cliente
      - `cpf` (text) - CPF do cliente
      - `whatsapp` (text, opcional) - WhatsApp do cliente
      - `pergunta_tarot` (text) - Pergunta para o tarô
      - `consentimento_lgpd` (boolean) - Consentimento para uso dos dados
      - `created_at` (timestamptz) - Data e hora do cadastro
      
  2. Segurança
    - Habilitar RLS na tabela `tarot_clients`
    - Política para permitir inserção pública (formulário público)
    - Política para leitura apenas por usuários autenticados (admin)
*/

CREATE TABLE IF NOT EXISTS tarot_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo text NOT NULL,
  email text NOT NULL,
  cpf text NOT NULL,
  whatsapp text,
  pergunta_tarot text NOT NULL,
  consentimento_lgpd boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tarot_clients ENABLE ROW LEVEL SECURITY;

-- Permite inserção pública (qualquer pessoa pode enviar o formulário)
CREATE POLICY "Permitir inserção pública"
  ON tarot_clients
  FOR INSERT
  TO anon
  WITH CHECK (consentimento_lgpd = true);

-- Apenas usuários autenticados podem ler os dados (admin)
CREATE POLICY "Apenas autenticados podem ler"
  ON tarot_clients
  FOR SELECT
  TO authenticated
  USING (true);