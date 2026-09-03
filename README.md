# Kübra Terzioğlu — Dijital Kartvizit

QR okutunca açılan tek sayfalık dijital kartvizit + "Bağlantı kur" formu.
Form → n8n webhook → Google Sheet + Kübra'ya e-posta bildirimi.

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Kartvizit sayfası (linkler, vCard butonu, bağlantı formu) |
| `styles.css` | Tasarım |
| `app.js` | vCard üretimi + form gönderimi (n8n webhook) |
| `assets/kubra.png` | Profil foto (AI headshot — `AI-PHOTO\03395bd2...e2e6e.0.png`) |
| `assets/kubra-terzioglu-cv.pdf` | CV (kaynak: `Downloads\Kubra_Terzioglu_CV (2).pdf`, 18 Ağu) |
| `qr.html` | Yayınlanan URL için QR kod üretici (indir butonlu) |
| `n8n/workflow-backup.json` | n8n workflow yedeği (import edilebilir) |

## Ne çalışıyor (test edildi)

- Kartvizit sayfası + tüm linkler
- **Rehbere ekle** → `Kubra_Terzioglu.vcf` iner (telefon YOK — sadece isim, ünvan, e-posta, LinkedIn, site, Kaggle, Medium)
- **Bağlantı formu** → `https://kubrat.app.n8n.cloud/webhook/kartvizit-baglanti`
  - Geçerli kayıt → Google Sheet'e satır + Kübra'ya e-posta, tarayıcıya `{"ok":true}`
  - Eksik alan / bozuk e-posta / honeypot → `400`, Sheet'e yazılmaz
  - CORS: n8n OPTIONS preflight'ı ve `Access-Control-Allow-Origin` başlığını veriyor — GitHub Pages'ten çalışır

## n8n

- Instance: `kubrat.app.n8n.cloud`
- Workflow: **Dijital Kartvizit — Network Bağlantıları** (ID `oUeKQovMnVlhU3rW`) — AKTİF
- Webhook (prod): `POST https://kubrat.app.n8n.cloud/webhook/kartvizit-baglanti`
- Akış: Webhook → Parse & Doğrula (Code) → Geçerli mi? (If) → Satır (Set) → Sheet'e Ekle → Kübra'ya Bildir (Gmail) → 200 OK
- Google Sheet: **Kübra — Network Bağlantıları**
  `https://docs.google.com/spreadsheets/d/1RCWAOkVFZ0OZh6ef02Zx8YFrjrzTb8_tR_x3k3XpGRA/edit`
  Başlık satırı ilk gerçek kayıtta otomatik oluşur.
- Bildirim e-postası: `kubraterzioglu06@gmail.com` (Gmail OAuth2 API credential)
- Kullanılan credential'lar: `Google Sheets OAuth2 API`, `Gmail OAuth2 API` (ikisi de mevcut)

## GitHub Pages'e yayınlama

GitHub kullanıcı: **Kbrterz** → yayın URL'si: `https://kbrterz.github.io/dijital-kartvizit/`

1. GitHub'da yeni repo aç: `dijital-kartvizit` (public), README ekleme (boş bırak).
2. Bu klasör zaten `git init` + ilk commit ile hazır. Push et:
   ```bash
   cd "C:\Users\terzi\Desktop\dijital-kartvizit"
   git remote add origin https://github.com/Kbrterz/dijital-kartvizit.git
   git push -u origin main
   ```
   (Push'ta GitHub kullanıcı adı + Personal Access Token istenir.)
3. Repo → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `root` → Save.
4. 1-2 dk sonra canlı: `https://kbrterz.github.io/dijital-kartvizit/`
5. QR kod `qr.png` olarak hazır (bu URL'ye işaret ediyor). Değiştirmek istersen `qr.html`'i aç.

## Düzenlemek istersen

- Metin / linkler: `index.html`
- vCard içeriği: `app.js` içindeki `CONTACT` objesi
- Renk: `styles.css` en üstteki `--accent` vs.
- Foto değiştir: `assets/kubra.png` üzerine yaz (kare/dikey, yüz üstte)
- Webhook URL değişirse: `app.js` içindeki `N8N_WEBHOOK_URL`
