NEVA YALI — Onaylı Taşeron Tablosu (Frontend)

Kurulum (yerelde):

- Node.js 18+
- `cp .env.local.example .env.local` (isteğe bağlı, Supabase entegrasyonu sonraya kalacak)
- `npm install`
- `npm run dev`

Özellikler (UI - Mock):

- Ana liste: onaylı ve tamamlanmamış görevler
- Blok | Şirket | Görev | Başlangıç | Bitiş | Durum | Kalan/Gecikme | Uyarı | İşlemler
- Arama: şirket+görev+blok alanlarında
- Kırmızıları öne al (varsayılan açık)
- Satır rengi yalnız due_date’e göre (geç = kırmızı, aksi = yeşil)
- Üstte proje gün sayacı (Neva Yalı örneği)
- Kullanıcıya özel butonlar (mock: Beta Beton)

Notlar:

- Tarihler string (YYYY-MM-DD) olarak tutulur; tarayıcıda yerel saat dilimi kullanılır. SSR ortamında `TZ=Europe/Istanbul` ayarlayın.
- Supabase şema ve RLS politikaları ayrı SQL dosyasında tanımlanacak ve sonrasında API route’ları doldurulacak.

