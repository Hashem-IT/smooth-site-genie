
-- Profiltabelle für Benutzer
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('business', 'driver')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- RLS-Richtlinien für Profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Öffentliche Profile sind für alle lesbar" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Benutzer können nur ihr eigenes Profil bearbeiten" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger zum automatischen Einfügen eines Profils bei der Registrierung
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'business')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Bestellungstabelle
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES profiles(id) NOT NULL,
  business_name TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL NOT NULL,
  weight DECIMAL NOT NULL,
  size TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'booked', 'confirmed', 'delivered')) DEFAULT 'pending',
  driver_id UUID REFERENCES profiles(id),
  driver_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
  from_address TEXT,
  to_address TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL
);

-- RLS-Richtlinien für Bestellungen
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Fahrer können alle Bestellungen sehen
CREATE POLICY "Fahrer können alle Bestellungen sehen" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'driver')
  );

-- Unternehmen können nur ihre eigenen Bestellungen sehen
CREATE POLICY "Unternehmen sehen nur ihre eigenen Bestellungen" ON orders
  FOR SELECT USING (
    business_id = auth.uid()
  );

-- Unternehmen können nur ihre eigenen Bestellungen erstellen
CREATE POLICY "Unternehmen können nur ihre eigenen Bestellungen erstellen" ON orders
  FOR INSERT WITH CHECK (
    business_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'business')
  );

-- Unternehmen können nur ihre eigenen Bestellungen aktualisieren
CREATE POLICY "Unternehmen können nur ihre eigenen Bestellungen aktualisieren" ON orders
  FOR UPDATE USING (
    business_id = auth.uid() OR 
    (driver_id = auth.uid() AND status IN ('booked', 'confirmed'))
  );

-- Nachrichtentabelle
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('business', 'driver')),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- RLS-Richtlinien für Nachrichten
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Nachrichten können nur von beteiligten Personen gesehen werden
CREATE POLICY "Nachrichtensichtbarkeit für Beteiligte" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id AND (
        orders.business_id = auth.uid() OR
        orders.driver_id = auth.uid()
      )
    )
  );

-- Nachrichten können nur von beteiligten Personen erstellt werden
CREATE POLICY "Nachrichtenerstellung für Beteiligte" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id AND (
        orders.business_id = auth.uid() OR
        orders.driver_id = auth.uid()
      )
    ) AND
    sender_id = auth.uid()
  );

-- Speicher für Bilder einrichten
INSERT INTO storage.buckets (id, name, public) VALUES ('order-images', 'order-images', true);

-- RLS-Richtlinien für Bildspeicher
CREATE POLICY "Bilder sind öffentlich lesbar" ON storage.objects
  FOR SELECT USING (bucket_id = 'order-images');

CREATE POLICY "Authentifizierte Benutzer können Bilder hochladen" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'order-images' AND
    auth.role() = 'authenticated'
  );
