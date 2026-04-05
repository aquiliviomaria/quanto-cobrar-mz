export const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS utilizadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  telefone TEXT,
  empresa TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS insumos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilizador_id INTEGER NOT NULL DEFAULT 1,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  quantidade_comprada REAL NOT NULL,
  unidade TEXT NOT NULL,
  preco_total REAL NOT NULL,
  custo_unitario REAL NOT NULL,
  tipo_ingrediente TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilizador_id INTEGER NOT NULL DEFAULT 1,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  rendimento REAL NOT NULL DEFAULT 1,
  unidade_rendimento TEXT NOT NULL DEFAULT 'unidade',
  custo_extra REAL NOT NULL DEFAULT 0,
  margem_padrao REAL NOT NULL DEFAULT 30,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produto_insumos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  insumo_id INTEGER NOT NULL,
  quantidade_usada REAL NOT NULL,
  custo_calculado REAL NOT NULL DEFAULT 0,
  unidade_usada TEXT,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  FOREIGN KEY (insumo_id) REFERENCES insumos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orcamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_nome TEXT,
  produto_id INTEGER NOT NULL,
  quantidade REAL NOT NULL DEFAULT 1,
  margem_aplicada REAL NOT NULL,
  custo_total REAL NOT NULL,
  valor_lucro REAL NOT NULL,
  preco_sugerido REAL NOT NULL,
  preco_arredondado REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  observacoes TEXT,
  descricao_pedido TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS configuracoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  moeda TEXT NOT NULL DEFAULT 'MT',
  margem_padrao REAL NOT NULL DEFAULT 30,
  arredondamento_ativo INTEGER NOT NULL DEFAULT 1,
  tipo_arredondamento TEXT NOT NULL DEFAULT 'dezena',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;
