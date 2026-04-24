/* =====================================================
   Sistem Perolehan — Standalone HTML/CSS/JS version
   Calls OpenAI directly. Fill in your API key + model below.
   ===================================================== */

// >>>>>>>>>>>>>>>>>>>>  CONFIGURE THESE  <<<<<<<<<<<<<<<<<<<<
const OPENAI_API_KEY = "PASTE_YOUR_OPENAI_API_KEY_HERE";  // e.g. "sk-proj-..."
const OPENAI_MODEL   = "gpt-4o-mini";                     // e.g. "gpt-4o", "gpt-4o-mini", "gpt-5.2"
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const VALID_CREDENTIALS = [
  { id: "admin", password: "admin123" },
  { id: "user01", password: "password" },
];

const JENIS_LABEL = {
  bekalan: "Bekalan",
  perkhidmatan: "Perkhidmatan",
  kerja: "Kerja",
};

const SYSTEM_PROMPT = `Kamu adalah pakar sistem perolehan kerajaan Malaysia yang mahir dalam Pekeliling Perbendaharaan Malaysia PK 2.9 (Kaedah Sebut Harga). Berikan panduan tepat berdasarkan dokumen PK 2.9 sahaja dalam Bahasa Malaysia yang formal.

FORMAT JAWAPAN (gunakan markdown):

## Kaedah Perolehan
[Nyatakan kaedah perolehan yang terpakai — Sebut Harga, Pembelian Terus, atau Tender — berdasarkan jenis dan nilai perolehan]

## Pekeliling / Arahan Yang Perlu Dirujuk
[Senaraikan pekeliling dan arahan yang berkaitan dengan nombor rujukan tepat]

## Sebab Pekeliling Ini Dipilih
[Terangkan mengapa kaedah dan pekeliling ini digunakan berdasarkan had nilai dan jenis perolehan]

## Syarat dan Tatacara Pelaksanaan
[Huraikan syarat dan tatacara khusus mengikut PK 2.9]

## Dokumen / Lampiran Yang Perlu Disediakan
[Senaraikan semua dokumen dan lampiran yang diperlukan dalam bentuk senarai bernombor]

---

PANDUAN HAD NILAI MENGIKUT PK 2.9:

BEKALAN DAN PERKHIDMATAN:
- RM50,000 ke bawah: Pembelian Terus (bukan skop Sebut Harga PK 2.9)
- Melebihi RM50,000 hingga RM100,000: Sebut Harga — pelawaan kepada pembuat/pembekal tempatan bertaraf Bumiputera yang berdaftar dengan Kementerian Kewangan (di negeri berkenaan), tempoh notis sekurang-kurangnya 7 hari berturut-turut, penilaian 1 atau 2 peringkat, kelulusan Jawatankuasa Sebut Harga (JKSH)
- Melebihi RM100,000 hingga RM500,000: Sebut Harga — pelawaan kepada pembuat/pembekal tempatan yang berdaftar dengan Kementerian Kewangan, tempoh notis 7 hari, penilaian 1 atau 2 peringkat, kelulusan JKSH
- Melebihi RM500,000: Tender (bukan skop PK 2.9)

KERJA:
- RM50,000 ke bawah: Pembelian Terus (bukan skop Sebut Harga PK 2.9)
- Melebihi RM50,000 hingga RM200,000: Sebut Harga — pelawaan kepada sekurang-kurangnya 5 kontraktor tempatan/daerah Gred G1 yang berdaftar dengan CIDB dan mempunyai SPKK
- Melebihi RM200,000 hingga RM500,000: Sebut Harga — pelawaan kepada sekurang-kurangnya 5 kontraktor tempatan Gred G2 yang berdaftar dengan CIDB dan mempunyai SPKK
- Kerja elektrik (melebihi RM50,000 hingga RM500,000): Sebut Harga — pelawaan kepada sekurang-kurangnya 5 kontraktor elektrik tempatan
- Melebihi RM500,000: Tender (bukan skop PK 2.9)

SYARAT AM PK 2.9:
- Agensi dilarang memecah kecil perolehan bagi mengelakkan pelawaan sebut harga (PK 2.9, Seksyen 1.1)
- Bekalan & perkhidmatan mesti dilaksanakan melalui Sistem ePerolehan (eP) secara dalam talian sepenuhnya; kerja dilaksanakan secara manual (PK 2.9, Seksyen 2.1)
- Notis/pemberitahuan sebut harga hendaklah dipaparkan di Portal MyPROCUREMENT dan papan kenyataan agensi (PK 2.9, Seksyen 6.2)
- Tempoh sah laku tawaran tidak melebihi 90 hari (PK 2.9, Seksyen 8.1)
- Tawaran kewangan dan teknikal (bekalan/perkhidmatan) hendaklah dikemukakan dalam 2 sampul surat berlakri berasingan; kerja dalam 1 sampul (PK 2.9, Seksyen 6.9)
- Sebut harga diklasifikasikan sebagai SULIT di bawah Akta Rahsia Rasmi 1972 [Akta 88] (PK 2.9, Seksyen 10.1)
- Harga Indikatif Jabatan mesti dimasukkan ke dalam peti tawaran sebelum tarikh tutup (PK 2.9, Seksyen 7.1)
- Peti tawaran ditutup pada jam 12.00 tengah hari pada hari bekerja (PK 2.9, Seksyen 7.1)
- Semua ahli Jawatankuasa mesti menandatangani Integrity Pact (PK 2.9, Seksyen 2.2)

DOKUMEN SEBUT HARGA BEKALAN/PERKHIDMATAN (PK 2.9, Seksyen 4.1):
- Borang Q (Lampiran 1 PK 2.9)
- Arahan Kepada Penyebut Harga (Lampiran 3 PK 2.9)
- Syarat-syarat am dan syarat-syarat khas
- Format kontrak (jika berkaitan)
- Spesifikasi teknikal
- Pengalaman / Senarai Pesanan bekalan/perkhidmatan (jika perlu)
- Senarai Semakan (Lampiran 8 PK 2.9)
- Harga Indikatif Jabatan (dimasukkan ke peti tawaran)
- Integrity Pact (untuk semua ahli jawatankuasa)
- Akuan Sumpah di bawah Akta Rahsia Rasmi 1972 [Akta 88]

DOKUMEN SEBUT HARGA KERJA (PK 2.9, Seksyen 4.2):
- Arahan Kepada Penyebut Harga (Lampiran 2 PK 2.9) — format JKR/JPS
- Syarat-Syarat Sebut Harga Untuk Kerja (Lampiran 4 PK 2.9)
- Borang Sebut Harga Kerja (Lampiran 5 PK 2.9)
- Ringkasan Sebut Harga Kuantiti (Lampiran 6 PK 2.9) atau Ringkasan Sebut Harga Pukal (Lampiran 7 PK 2.9)
- Spesifikasi teknikal
- Pelan Tapak Bina dan Lukisan Teknikal (jika ada)
- Pengalaman dan Senarai Kerja Dalam Tangan
- Senarai Semakan (Lampiran 8 PK 2.9)
- Sijil Akuan Pendaftaran CIDB dan Sijil Perolehan Kerja Kerajaan (SPKK)
- Sijil Perakuan Pendaftaran Kontraktor (PPK)
- Sijil Taraf Bumiputera (STB) jika berkaitan
- Harga Indikatif Jabatan (dimasukkan ke peti tawaran)
- Integrity Pact (untuk semua ahli jawatankuasa)
- Akuan Sumpah di bawah Akta Rahsia Rasmi 1972 [Akta 88]

JAWATANKUASA YANG TERLIBAT (PK 2.9, Seksyen 9, 13, 14, 18):
- Jawatankuasa Spesifikasi
- Jawatankuasa Pembuka Sebut Harga (sekurang-kurangnya 2 pegawai, pengerusi dari Kumpulan Pengurusan dan Profesional)
- Jawatankuasa Penilaian Sebut Harga (sekurang-kurangnya 3 orang — 1 pengerusi + 2 ahli)
  - Penilaian 1 Peringkat (1-tier): JK Spesifikasi + JK Penilaian Gabungan
  - Penilaian 2 Peringkat (2-tier): JK Spesifikasi + JK Pembuka + JK Penilaian Teknikal + JK Penilaian Kewangan
- Jawatankuasa Sebut Harga (JKSH) — pihak berkuasa melulus, dilantik oleh Pegawai Pengawal
- Tempoh penilaian: seboleh-bolehnya dalam tempoh 14 hari

LAPORAN SEBUT HARGA (PK 2.9, Lampiran 9):
- Format Laporan Perolehan Secara Sebut Harga (Lampiran 9 PK 2.9) perlu disediakan`;

/* ---------- View routing ---------- */
const viewLogin = document.getElementById("view-login");
const viewPerolehan = document.getElementById("view-perolehan");

function showLogin() {
  viewLogin.classList.remove("hidden");
  viewPerolehan.classList.add("hidden");
}
function showPerolehan() {
  viewLogin.classList.add("hidden");
  viewPerolehan.classList.remove("hidden");
  document.getElementById("welcome-user").textContent =
    sessionStorage.getItem("userId") || "Pengguna";
}

if (sessionStorage.getItem("loggedIn") === "true") {
  showPerolehan();
} else {
  showLogin();
}

/* ---------- Login ---------- */
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginError.classList.add("hidden");
  loginError.textContent = "";

  const id = document.getElementById("login-id").value.trim();
  const password = document.getElementById("login-password").value;

  document.getElementById("err-login-id").textContent = id ? "" : "ID pengguna diperlukan";
  document.getElementById("err-login-password").textContent = password ? "" : "Kata laluan diperlukan";
  if (!id || !password) return;

  const ok = VALID_CREDENTIALS.find((c) => c.id === id && c.password === password);
  if (ok) {
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("userId", id);
    loginForm.reset();
    showPerolehan();
  } else {
    loginError.textContent = "ID pengguna atau kata laluan tidak sah. Sila cuba lagi.";
    loginError.classList.remove("hidden");
  }
});

/* ---------- Logout ---------- */
document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("loggedIn");
  sessionStorage.removeItem("userId");
  showLogin();
});

/* ---------- Perolehan form ---------- */
const perolehanForm = document.getElementById("perolehan-form");
const jenisSelect = document.getElementById("jenis-perolehan");
const fieldJenisKerja = document.getElementById("field-jenis-kerja");
const submitBtn = document.getElementById("submit-btn");
const submitDefault = document.getElementById("submit-icon-default");
const submitLoading = document.getElementById("submit-icon-loading");
const entriesSection = document.getElementById("entries-section");
const entriesList = document.getElementById("entries-list");
const entriesCount = document.getElementById("entries-count");

let entries = [];
let nextId = 1;

jenisSelect.addEventListener("change", () => {
  if (jenisSelect.value === "kerja") {
    fieldJenisKerja.classList.remove("hidden");
  } else {
    fieldJenisKerja.classList.add("hidden");
    document.getElementById("jenis-kerja").value = "";
    document.getElementById("err-jenis-kerja").textContent = "";
  }
});

function formatCurrency(num) {
  return num.toLocaleString("ms-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function setLoading(on) {
  submitBtn.disabled = on;
  submitDefault.classList.toggle("hidden", on);
  submitLoading.classList.toggle("hidden", !on);
}

perolehanForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const jenis = jenisSelect.value;
  const jenisKerja = document.getElementById("jenis-kerja").value.trim();
  const hargaRaw = document.getElementById("harga-siling").value;
  const hargaNum = parseFloat(String(hargaRaw).replace(/,/g, ""));

  let valid = true;
  document.getElementById("err-jenis").textContent = jenis ? "" : (valid = false, "Jenis perolehan diperlukan");
  if (jenis === "kerja") {
    document.getElementById("err-jenis-kerja").textContent =
      jenisKerja ? "" : (valid = false, "Jenis kerja diperlukan");
  }
  document.getElementById("err-harga").textContent =
    !hargaRaw ? (valid = false, "Harga siling diperlukan") :
    isNaN(hargaNum) || hargaNum <= 0 ? (valid = false, "Harga siling mesti nombor positif yang sah") : "";
  if (!valid) return;

  if (!OPENAI_API_KEY || OPENAI_API_KEY.startsWith("PASTE_")) {
    alert("Sila masukkan OPENAI_API_KEY anda di bahagian atas fail app.js terlebih dahulu.");
    return;
  }

  const entryId = nextId++;
  const entry = {
    id: entryId,
    jenisPerolehan: jenis,
    jenisKerja: jenis === "kerja" ? jenisKerja : undefined,
    hargaSiling: formatCurrency(hargaNum),
    hargaSilingNum: hargaNum,
    tarikhDihantar: new Date().toLocaleString("ms-MY", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }),
    aiAnalysis: "",
    showAI: true,
    streaming: true,
    errored: false,
  };
  entries.unshift(entry);
  renderEntries();
  perolehanForm.reset();
  fieldJenisKerja.classList.add("hidden");
  setLoading(true);

  const jenisLabel = JENIS_LABEL[jenis] || jenis;
  const jenisKerjaLine = entry.jenisKerja ? `\n**Jenis Kerja:** ${entry.jenisKerja}` : "";
  const userMessage =
`Sila analisis dan berikan panduan lengkap berdasarkan PK 2.9 untuk perolehan berikut:

**Jenis Perolehan:** ${jenisLabel}${jenisKerjaLine}
**Harga Siling:** RM ${formatCurrency(hargaNum)}

Berikan panduan yang tepat dan praktikal termasuk kaedah perolehan yang sesuai mengikut had nilai, pekeliling PK 2.9 yang dirujuk, sebab pemilihan kaedah, syarat tatacara pelaksanaan, dan senarai lengkap dokumen/lampiran yang perlu disediakan.${entry.jenisKerja ? " Pastikan panduan mengambil kira jenis kerja yang dinyatakan, termasuk syarat kontraktor CIDB dan keperluan teknikal yang berkaitan." : ""}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: userMessage },
        ],
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text().catch(() => "");
      throw new Error(`OpenAI API ${response.status}: ${errText.slice(0, 200)}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    outer: while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") break outer;
        try {
          const data = JSON.parse(payload);
          const delta = data.choices?.[0]?.delta?.content;
          if (delta) {
            entry.aiAnalysis += delta;
            updateEntryBody(entry);
          }
        } catch {}
      }
    }
  } catch (err) {
    entry.aiAnalysis = `Ralat: ${err.message || "Tidak dapat menghubungi OpenAI."} Sila semak API key dan model anda.`;
    entry.errored = true;
    updateEntryBody(entry);
  } finally {
    entry.streaming = false;
    setLoading(false);
    renderEntries();
  }
});

/* ---------- Entry rendering ---------- */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function renderInline(text) {
  return escapeHtml(text)
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
function stripMd(s) {
  return s
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1");
}

function renderMarkdown(text) {
  const lines = text.split("\n");
  let html = "";
  let listBuffer = [];
  let listOrdered = false;

  const flushList = () => {
    if (!listBuffer.length) return;
    const tag = listOrdered ? "ol" : "ul";
    html += `<${tag}>` + listBuffer.map((it) => `<li>${it}</li>`).join("") + `</${tag}>`;
    listBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{1,2}\s/.test(line)) {
      flushList();
      html += `<h3>${escapeHtml(line.replace(/^#{1,2}\s+/, ""))}</h3>`;
    } else if (/^#{3,6}\s/.test(line)) {
      flushList();
      html += `<p class="subheading">${escapeHtml(line.replace(/^#{3,6}\s+/, ""))}</p>`;
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (listBuffer.length && !listOrdered) flushList();
      listOrdered = true;
      listBuffer.push(renderInline(trimmed.replace(/^\d+\.\s+/, "")));
    } else if (/^[-*]\s/.test(trimmed)) {
      if (listBuffer.length && listOrdered) flushList();
      listOrdered = false;
      listBuffer.push(renderInline(trimmed.replace(/^[-*]\s+/, "")));
    } else if (trimmed === "") {
      flushList();
    } else if (trimmed) {
      flushList();
      const cleaned = trimmed.replace(/^\*\*(.+)\*\*$/, "$1");
      html += `<p>${renderInline(cleaned)}</p>`;
    }
  }
  flushList();
  return html;
}

function entryCardHtml(entry) {
  const jenisLabel = JENIS_LABEL[entry.jenisPerolehan] || entry.jenisPerolehan;
  const subname = entry.jenisKerja ? `<span class="entry-subname">— ${escapeHtml(entry.jenisKerja)}</span>` : "";
  const showPdf = entry.aiAnalysis && !entry.errored && !entry.streaming;
  return `
    <article class="card entry-card" data-id="${entry.id}">
      <div class="entry-head">
        <div class="entry-meta">
          <div class="entry-meta-row">
            <span class="badge">#${entry.id}</span>
            <span class="entry-name">${escapeHtml(jenisLabel)}</span>
            ${subname}
            <span class="badge badge-primary">RM ${escapeHtml(entry.hargaSiling)}</span>
          </div>
          <p class="entry-date">${escapeHtml(entry.tarikhDihantar)}</p>
        </div>
        <div class="entry-actions">
          <button class="btn btn-ghost" data-action="toggle" data-id="${entry.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"/></svg>
            Panduan AI
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${entry.showAI ? '<polyline points="18 15 12 9 6 15"/>' : '<polyline points="6 9 12 15 18 9"/>'}</svg>
          </button>
          ${showPdf ? `
            <button class="btn btn-ghost btn-ghost-pdf" data-action="pdf" data-id="${entry.id}" title="Eksport sebagai PDF">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              PDF
            </button>` : ""}
          <button class="btn btn-ghost btn-ghost-danger" data-action="delete" data-id="${entry.id}" title="Padam">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
      ${entry.showAI ? `<div class="entry-body" data-body="${entry.id}">${entryBodyHtml(entry)}</div>` : ""}
    </article>
  `;
}

function entryBodyHtml(entry) {
  if (!entry.aiAnalysis && entry.streaming) {
    return `<div class="md"><p class="muted small streaming-cursor">Menjana panduan AI</p></div>`;
  }
  if (entry.errored) {
    return `<div class="md"><p style="color:#b91c1c;">${escapeHtml(entry.aiAnalysis)}</p></div>`;
  }
  const md = renderMarkdown(entry.aiAnalysis || "");
  return `<div class="md">${md}${entry.streaming ? '<span class="streaming-cursor"></span>' : ""}</div>`;
}

function updateEntryBody(entry) {
  const el = entriesList.querySelector(`[data-body="${entry.id}"]`);
  if (el) el.innerHTML = entryBodyHtml(entry);
}

function renderEntries() {
  entriesCount.textContent = entries.length;
  if (entries.length === 0) {
    entriesSection.classList.add("hidden");
    entriesList.innerHTML = "";
    return;
  }
  entriesSection.classList.remove("hidden");
  entriesList.innerHTML = entries.map(entryCardHtml).join("");
}

entriesList.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = parseInt(btn.dataset.id, 10);
  const entry = entries.find((x) => x.id === id);
  if (!entry) return;

  if (btn.dataset.action === "toggle") {
    entry.showAI = !entry.showAI;
    renderEntries();
  } else if (btn.dataset.action === "delete") {
    entries = entries.filter((x) => x.id !== id);
    renderEntries();
  } else if (btn.dataset.action === "pdf") {
    exportToPdf(entry);
  }
});

/* ---------- PDF export (uses jsPDF UMD from CDN) ---------- */
function exportToPdf(entry) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = margin;

  const drawFooter = () => {
    const total = doc.internal.pages.length - 1;
    const current = doc.getCurrentPageInfo().pageNumber;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont("helvetica", "normal");
    doc.text("Sistem Perolehan — Panduan AI berdasarkan PK 2.9", margin, pageH - 10);
    doc.text(`Halaman ${current} / ${total}`, pageW - margin, pageH - 10, { align: "right" });
    doc.setTextColor(0);
  };
  const addPageIfNeeded = (needed) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
      drawFooter();
    }
  };

  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("PANDUAN PEROLEHAN AI", margin, 12);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Sistem Perolehan  |  Berdasarkan Pekeliling Perbendaharaan PK 2.9", margin, 20);
  doc.setTextColor(0);
  y = 36;

  const metaH = entry.jenisKerja ? 30 : 24;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentW, metaH, 2, 2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("JENIS PEROLEHAN", margin + 4, y + 7);
  doc.text("HARGA SILING", margin + contentW / 2, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(JENIS_LABEL[entry.jenisPerolehan] || entry.jenisPerolehan, margin + 4, y + 14);
  doc.text(`RM ${entry.hargaSiling}`, margin + contentW / 2, y + 14);
  if (entry.jenisKerja) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("JENIS KERJA", margin + 4, y + 21);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(entry.jenisKerja, margin + 4, y + 27);
  }
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Tarikh: ${entry.tarikhDihantar}`, margin + 4, y + (entry.jenisKerja ? 35 : 21));
  y += entry.jenisKerja ? 40 : 30;

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  const lines = entry.aiAnalysis.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{1,2}\s/.test(line)) {
      addPageIfNeeded(14);
      if (y > margin + 42) y += 3;
      const heading = line.replace(/^#{1,2}\s+/, "");
      doc.setFillColor(239, 246, 255);
      doc.rect(margin, y - 4, contentW, 9, "F");
      doc.setDrawColor(147, 197, 253);
      doc.rect(margin, y - 4, 2.5, 9, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text(stripMd(heading), margin + 5, y + 2);
      doc.setTextColor(0);
      y += 11;
    } else if (/^#{3,6}\s/.test(line)) {
      addPageIfNeeded(10);
      y += 2;
      const heading = line.replace(/^#{3,6}\s+/, "");
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(stripMd(heading), margin, y);
      doc.setTextColor(0);
      y += 6;
    } else if (/^\d+\.\s/.test(trimmed)) {
      const num = (trimmed.match(/^(\d+)\./) || [])[1] || "•";
      const content = stripMd(trimmed.replace(/^\d+\.\s+/, ""));
      const wrapped = doc.splitTextToSize(content, contentW - 12);
      addPageIfNeeded(wrapped.length * 5 + 2);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text(`${num}.`, margin + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(wrapped, margin + 9, y);
      y += wrapped.length * 5 + 1;
    } else if (/^[-*]\s/.test(trimmed)) {
      const content = stripMd(trimmed.replace(/^[-*]\s+/, ""));
      const wrapped = doc.splitTextToSize(content, contentW - 10);
      addPageIfNeeded(wrapped.length * 5 + 2);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text("•", margin + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(wrapped, margin + 8, y);
      y += wrapped.length * 5 + 1;
    } else if (trimmed === "") {
      y += 2;
    } else if (trimmed) {
      const content = stripMd(trimmed.replace(/^\*\*(.+)\*\*$/, "$1"));
      const wrapped = doc.splitTextToSize(content, contentW);
      addPageIfNeeded(wrapped.length * 5 + 2);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5 + 1;
    }
  }

  drawFooter();
  const label = (JENIS_LABEL[entry.jenisPerolehan] || entry.jenisPerolehan).replace(/\s/g, "_");
  doc.save(`Panduan_Perolehan_${label}_${entry.id}.pdf`);
}
