/* ===========================================================================
   Kübra Terzioğlu — dijital kartvizit
   1) "Rehbere ekle"  -> istemci tarafında .vcf üretir ve indirir
   2) "Bağlantı kur"  -> formu n8n webhook'una POST eder (Google Sheet'e düşer)
   =========================================================================== */

/* n8n Webhook Production URL — kubrat.app.n8n.cloud
   Workflow aktifleşince buraya prod URL yapıştırılacak. */
var N8N_WEBHOOK_URL = "https://kubrat.app.n8n.cloud/webhook/kartvizit-baglanti";

/* --------------------------- vCard ---------------------------------------- */
var CONTACT = {
  first: "Kübra",
  last: "Terzioğlu",
  full: "Kübra Terzioğlu",
  title: "Senior Project Manager — Aerospace, Defense & Data Analysis",
  email: "kubraterzioglu06@gmail.com",
  site: "https://www.kubraterzioglu.com",
  linkedin: "https://www.linkedin.com/in/kubra-terzioglu/",
  kaggle: "https://www.kaggle.com/kubraterz",
  medium: "https://medium.com/@kubra_terzioglu",
  github: "https://github.com/Kbrterz"
};

function buildVCard() {
  // \r\n satır sonu — vCard spec gereği
  var L = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:" + CONTACT.last + ";" + CONTACT.first + ";;;",
    "FN:" + CONTACT.full,
    "TITLE:" + CONTACT.title,
    "EMAIL;TYPE=INTERNET,PREF:" + CONTACT.email,
    "URL:" + CONTACT.site,
    "X-SOCIALPROFILE;TYPE=linkedin:" + CONTACT.linkedin,
    "item1.URL:" + CONTACT.linkedin,
    "item1.X-ABLabel:LinkedIn",
    "item2.URL:" + CONTACT.kaggle,
    "item2.X-ABLabel:Kaggle",
    "item3.URL:" + CONTACT.medium,
    "item3.X-ABLabel:Medium",
    "item4.URL:" + CONTACT.github,
    "item4.X-ABLabel:GitHub",
    "REV:" + new Date().toISOString(),
    "END:VCARD"
  ];
  return L.join("\r\n");
}

function downloadVCard() {
  var blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "Kubra_Terzioglu.vcf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
}

var saveBtn = document.getElementById("saveContact");
if (saveBtn) saveBtn.addEventListener("click", downloadVCard);

/* --------------------------- Bağlantı formu ------------------------------- */
var form = document.getElementById("connectForm");
var msg = document.getElementById("formMsg");
var submitBtn = document.getElementById("submitBtn");

function setMsg(text, kind) {
  msg.textContent = text;
  msg.className = "form__msg" + (kind ? " " + kind : "");
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // honeypot — bot doldurursa sessizce "başarılı" göster, gönderme
    if (form.website_hp && form.website_hp.value.trim() !== "") {
      form.classList.add("done");
      setMsg("Teşekkürler, bilgilerin alındı.", "ok");
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var payload = {
      name: form.name.value.trim(),
      title: form.title.value.trim(),
      company: form.company.value.trim(),
      email: form.email.value.trim(),
      cv: form.cv.value.trim(),
      source: "dijital-kartvizit",
      page: location.href,
      ua: navigator.userAgent,
      submitted_at: new Date().toISOString()
    };

    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.indexOf("REPLACE_WITH") === 0) {
      console.warn("[kartvizit] N8N_WEBHOOK_URL ayarlanmamış. Payload:", payload);
      setMsg("Form altyapısı henüz bağlanmadı (webhook URL yok).", "err");
      return;
    }

    submitBtn.disabled = true;
    setMsg("Gönderiliyor…");

    // text/plain -> basit istek, CORS preflight tetiklemez
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        form.classList.add("done");
        setMsg("Teşekkürler! Kübra'nın ağına eklendin. Yakında bağlantı kuracak.", "ok");
      })
      .catch(function (err) {
        console.error("[kartvizit] gönderim hatası:", err);
        submitBtn.disabled = false;
        setMsg("Gönderilemedi. Bağlantını kontrol edip tekrar dene.", "err");
      });
  });
}

/* --------------------------- ufak dokunuşlar ----------------------------- */
var yr = document.getElementById("yr");
if (yr) yr.textContent = new Date().getFullYear();
