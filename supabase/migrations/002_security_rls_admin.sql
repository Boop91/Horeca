-- 002_security_rls_admin.sql
-- Migrazione di sicurezza: policy RLS per admin, funzioni helper, trigger

-- =============================================================
-- SEZIONE 1: Funzione helper per verificare il ruolo admin
-- =============================================================
-- Crea una funzione SQL che controlla se l'utente corrente ha ruolo 'admin'
-- nella tabella users_profile. Usata nelle policy RLS per semplificare
-- la logica di autorizzazione.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users_profile
    WHERE user_id = auth.uid()
    AND ruolo = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Commento: SECURITY DEFINER permette alla funzione di leggere users_profile
-- anche se l'utente non avrebbe accesso diretto (evita loop RLS).
-- STABLE indica che il risultato non cambia all'interno della stessa query.

-- =============================================================
-- SEZIONE 2: Policy RLS per accesso ADMIN a tutte le tabelle
-- =============================================================
-- Gli admin devono poter leggere e modificare tutti i dati per gestire
-- il back-office (ordini, clienti, catalogo, recensioni, ecc.)

-- 2.1 users_profile: admin può vedere e modificare tutti i profili
CREATE POLICY admin_users_profile_select ON users_profile FOR SELECT USING (public.is_admin());
CREATE POLICY admin_users_profile_update ON users_profile FOR UPDATE USING (public.is_admin());
CREATE POLICY admin_users_profile_delete ON users_profile FOR DELETE USING (public.is_admin());

-- 2.2 addresses: admin può vedere tutti gli indirizzi (per spedizioni)
CREATE POLICY admin_addresses_select ON addresses FOR SELECT USING (public.is_admin());
CREATE POLICY admin_addresses_update ON addresses FOR UPDATE USING (public.is_admin());

-- 2.3 orders: admin gestisce tutti gli ordini (modifica stato, note, ecc.)
CREATE POLICY admin_orders_select ON orders FOR SELECT USING (public.is_admin());
CREATE POLICY admin_orders_update ON orders FOR UPDATE USING (public.is_admin());
CREATE POLICY admin_orders_insert ON orders FOR INSERT WITH CHECK (public.is_admin());

-- 2.4 order_items: admin può vedere tutti gli articoli degli ordini
CREATE POLICY admin_order_items_select ON order_items FOR SELECT USING (public.is_admin());

-- 2.5 quotes: admin gestisce tutti i preventivi (risponde, modifica stato)
CREATE POLICY admin_quotes_select ON quotes FOR SELECT USING (public.is_admin());
CREATE POLICY admin_quotes_update ON quotes FOR UPDATE USING (public.is_admin());

-- 2.6 reviews: admin modera le recensioni (approva, rifiuta, elimina)
CREATE POLICY admin_reviews_select ON reviews FOR SELECT USING (public.is_admin());
CREATE POLICY admin_reviews_update ON reviews FOR UPDATE USING (public.is_admin());
CREATE POLICY admin_reviews_delete ON reviews FOR DELETE USING (public.is_admin());

-- 2.7 activity_log: admin vede tutto il registro attività
CREATE POLICY admin_activity_log_select ON activity_log FOR SELECT USING (public.is_admin());
CREATE POLICY admin_activity_log_insert ON activity_log FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = user_id);

-- =============================================================
-- SEZIONE 3: RLS per tabelle pubbliche (categories, products, guides)
-- =============================================================
-- Queste tabelle sono leggibili da tutti (anche visitatori non autenticati)
-- ma modificabili SOLO dagli admin.

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_spare_parts ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica: chiunque può navigare il catalogo
CREATE POLICY categories_public_read ON categories FOR SELECT USING (true);
CREATE POLICY products_public_read ON products FOR SELECT USING (true);
CREATE POLICY guides_public_read ON guides FOR SELECT USING (published = true);
CREATE POLICY accessories_public_read ON product_accessories FOR SELECT USING (true);
CREATE POLICY spare_parts_public_read ON product_spare_parts FOR SELECT USING (true);

-- Scrittura solo admin
CREATE POLICY categories_admin_insert ON categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY categories_admin_update ON categories FOR UPDATE USING (public.is_admin());
CREATE POLICY categories_admin_delete ON categories FOR DELETE USING (public.is_admin());

CREATE POLICY products_admin_insert ON products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY products_admin_update ON products FOR UPDATE USING (public.is_admin());
CREATE POLICY products_admin_delete ON products FOR DELETE USING (public.is_admin());

CREATE POLICY guides_admin_select ON guides FOR SELECT USING (public.is_admin());
-- Note: this allows admin to see unpublished guides too
CREATE POLICY guides_admin_insert ON guides FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY guides_admin_update ON guides FOR UPDATE USING (public.is_admin());
CREATE POLICY guides_admin_delete ON guides FOR DELETE USING (public.is_admin());

CREATE POLICY accessories_admin_insert ON product_accessories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY accessories_admin_delete ON product_accessories FOR DELETE USING (public.is_admin());

CREATE POLICY spare_parts_admin_insert ON product_spare_parts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY spare_parts_admin_delete ON product_spare_parts FOR DELETE USING (public.is_admin());

-- =============================================================
-- SEZIONE 4: Trigger per aggiornamento automatico di updated_at
-- =============================================================
-- Ogni volta che una riga viene modificata, il campo updated_at
-- si aggiorna automaticamente al timestamp corrente.

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applica il trigger a tutte le tabelle con campo updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users_profile
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================
-- SEZIONE 5: Trigger per creazione automatica profilo utente
-- =============================================================
-- Quando un nuovo utente si registra via Supabase Auth,
-- viene creato automaticamente un record in users_profile
-- con ruolo 'client' di default.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (user_id, ruolo)
  VALUES (NEW.id, 'client')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================
-- SEZIONE 6: Funzione per logging attività admin
-- =============================================================
-- Registra ogni azione amministrativa nel registro attività
-- per audit trail completo.

CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_azione TEXT,
  p_dettagli JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.activity_log (user_id, azione, dettagli)
  VALUES (auth.uid(), p_azione, p_dettagli)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================
-- SEZIONE 7: Indici aggiuntivi per performance delle query di sicurezza
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_users_profile_ruolo ON users_profile(ruolo);
CREATE INDEX IF NOT EXISTS idx_users_profile_partita_iva ON users_profile(partita_iva);
CREATE INDEX IF NOT EXISTS idx_activity_log_azione ON activity_log(azione);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stato ON orders(stato);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_approvata ON reviews(approvata);
CREATE INDEX IF NOT EXISTS idx_guides_published ON guides(published);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
