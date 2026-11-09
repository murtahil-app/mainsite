import type { Metadata } from "next";

// murtahil.net/delete, the address the store listings give for deleting an account: like "/", it sends
// visitors to the page in their language (/en/delete/, /ar/delete/, /tr/delete/). The Worker does the
// same before any HTML loads; this page covers other hosts, and the three links cover no JavaScript.
const pick = `(function(){var ls=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''],p='en';for(var i=0;i<ls.length;i++){var m=/^(ar|en|tr)\\b/i.exec(ls[i]||'');if(m){p=m[1].toLowerCase();break}}location.replace('/'+p+'/delete/'+location.search);})();`;

export const metadata: Metadata = {
  title: "Delete your Murtahil account",
  alternates: { languages: { en: "/en/delete/", ar: "/ar/delete/", tr: "/tr/delete/", "x-default": "/en/delete/" } },
};

export default function DeleteRedirect() {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", gap: 12, color: "#0f1a12" }}>
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      <p style={{ display: "flex", gap: 24, fontSize: 18 }}>
        <a href="/en/delete/" hrefLang="en" style={{ color: "#0a6fb0" }}>
          Delete your account
        </a>
        <a href="/ar/delete/" hrefLang="ar" lang="ar" style={{ color: "#0a6fb0" }}>
          حذف حسابك
        </a>
        <a href="/tr/delete/" hrefLang="tr" lang="tr" style={{ color: "#0a6fb0" }}>
          Hesabını sil
        </a>
      </p>
    </main>
  );
}
