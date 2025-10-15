/*
  # Adicionar campos de pesquisa ao cadastro de clientes

  1. Mudanças
    - Adiciona coluna `ja_conhecia` - Se o cliente já conhecia a Mãe Neusa
    - Adiciona coluna `area_foco` - Área de interesse para a leitura
    - Adiciona coluna `area_foco_outro` - Campo livre caso escolha "Outra"
    - Adiciona coluna `como_conheceu` - Como o cliente chegou até o serviço
    - Adiciona coluna `como_conheceu_outro` - Campo livre caso escolha "Outro"
    
  2. Observações
    - Campos de texto para respostas específicas de múltipla escolha
    - Permite entender melhor o perfil e origem dos clientes
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_clients' AND column_name = 'ja_conhecia'
  ) THEN
    ALTER TABLE tarot_clients ADD COLUMN ja_conhecia text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_clients' AND column_name = 'area_foco'
  ) THEN
    ALTER TABLE tarot_clients ADD COLUMN area_foco text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_clients' AND column_name = 'area_foco_outro'
  ) THEN
    ALTER TABLE tarot_clients ADD COLUMN area_foco_outro text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_clients' AND column_name = 'como_conheceu'
  ) THEN
    ALTER TABLE tarot_clients ADD COLUMN como_conheceu text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_clients' AND column_name = 'como_conheceu_outro'
  ) THEN
    ALTER TABLE tarot_clients ADD COLUMN como_conheceu_outro text;
  END IF;
END $$;