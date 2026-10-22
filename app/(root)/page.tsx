// Sends visitors to their language: the first of the browser's languages the site speaks (Arabic,
// English or Turkish), English otherwise. Without JavaScript the three links do the same job.
const pick = `(function(){var ls=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''],p='en';for(var i=0;i<ls.length;i++){var m=/^(ar|en|tr)\\b/i.exec(ls[i]||'');if(m){p=m[1].toLowerCase();break}}location.replace('/'+p+'/');})();`;

export default function RootRedirect() {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", gap: 12, color: "#0f1a12" }}>
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      <p style={{ display: "flex", gap: 24, fontSize: 18 }}>
        <a href="/en/" hrefLang="en" style={{ color: "#0a6fb0" }}>
          English
        </a>
        <a href="/ar/" hrefLang="ar" lang="ar" style={{ color: "#0a6fb0" }}>
          العربية
        </a>
        <a href="/tr/" hrefLang="tr" lang="tr" style={{ color: "#0a6fb0" }}>
          Türkçe
        </a>
      </p>
    </main>
  );
}
