-- Users profile with B2B fiscal data
CREATE TABLE users_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  ragione_sociale TEXT,
  partita_iva VARCHAR(13),
  codice_fiscale VARCHAR(16),
  codice_destinatario_sdi VARCHAR(7) DEFAULT '0000000',
  pec TEXT,
  telefono TEXT,
  ruolo TEXT DEFAULT 'client' CHECK (ruolo IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Addresses (multiple per user)
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT CHECK (tipo IN ('spedizione', 'fatturazione')) NOT NULL,
  via TEXT NOT NULL,
  citta TEXT NOT NULL,
  cap VARCHAR(5) NOT NULL,
  provincia VARCHAR(2) NOT NULL,
  paese TEXT DEFAULT 'Italia',
  predefinito BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Categories (nested)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  livello INTEGER DEFAULT 1,
  ordine INTEGER DEFAULT 0,
  immagine TEXT,
  descrizione TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  marca TEXT,
  prezzo_netto DECIMAL(10,2) NOT NULL,
  prezzo_lordo DECIMAL(10,2),
  iva_percentuale DECIMAL(4,2) DEFAULT 22.00,
  disponibilita TEXT DEFAULT 'disponibile' CHECK (disponibilita IN ('disponibile', 'in_arrivo', 'esaurito', 'su_ordinazione')),
  peso DECIMAL(8,2),
  dimensioni JSONB,
  descrizione TEXT,
  specifiche JSONB,
  immagini JSONB DEFAULT '[]',
  documenti JSONB DEFAULT '[]',
  categoria_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product accessories
CREATE TABLE product_accessories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  accessory_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, accessory_id)
);

-- Product spare parts
CREATE TABLE product_spare_parts (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  spare_part_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, spare_part_id)
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stato TEXT DEFAULT 'in_attesa' CHECK (stato IN ('in_attesa', 'confermato', 'in_preparazione', 'spedito', 'consegnato', 'annullato', 'rimborsato')),
  totale_netto DECIMAL(10,2) NOT NULL,
  totale_iva DECIMAL(10,2) NOT NULL,
  totale_lordo DECIMAL(10,2) NOT NULL,
  indirizzo_spedizione JSONB,
  dati_fatturazione JSONB,
  payment_intent_id TEXT,
  metodo_pagamento TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantita INTEGER NOT NULL DEFAULT 1,
  prezzo_unitario DECIMAL(10,2) NOT NULL,
  opzioni JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quotes
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stato TEXT DEFAULT 'in_attesa' CHECK (stato IN ('in_attesa', 'risposto', 'accettato', 'rifiutato', 'scaduto')),
  prodotti JSONB NOT NULL,
  note TEXT,
  risposta TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Guides/Content
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titolo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  contenuto TEXT,
  categoria TEXT,
  immagine TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  testo TEXT,
  approvata BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  azione TEXT NOT NULL,
  dettagli JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_products_categoria ON products(categoria_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_addresses_user ON addresses(user_id);

-- RLS Policies
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY users_profile_select ON users_profile FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY users_profile_update ON users_profile FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY users_profile_insert ON users_profile FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can manage their own addresses
CREATE POLICY addresses_select ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY addresses_insert ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY addresses_update ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY addresses_delete ON addresses FOR DELETE USING (auth.uid() = user_id);

-- Users can view their own orders
CREATE POLICY orders_select ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY order_items_select ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Users can manage their own quotes
CREATE POLICY quotes_select ON quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY quotes_insert ON quotes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anyone can read approved reviews, users can create their own
CREATE POLICY reviews_select ON reviews FOR SELECT USING (approvata = true OR auth.uid() = user_id);
CREATE POLICY reviews_insert ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories and products are publicly readable
-- (no RLS needed since they should be readable by all)

-- Activity log: users can see their own
CREATE POLICY activity_log_select ON activity_log FOR SELECT USING (auth.uid() = user_id);
