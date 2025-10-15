/*
  # Remover campos WhatsApp e Pergunta do Tarô

  1. Mudanças
    - Remove a coluna `whatsapp` da tabela `tarot_clients`
    - Remove a coluna `pergunta_tarot` da tabela `tarot_clients`
    
  2. Observações
    - Simplifica o formulário para capturar apenas informações essenciais
    - Mantém nome completo, e-mail, CPF e consentimento LGPD
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_clients' AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE tarot_clients DROP COLUMN whatsapp;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_clients' AND column_name = 'pergunta_tarot'
  ) THEN
    ALTER TABLE tarot_clients DROP COLUMN pergunta_tarot;
  END IF;
END $$;