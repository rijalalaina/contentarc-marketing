import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE } from "@/i18n/routing";

const detect = `(function(){try{var L=${JSON.stringify(LOCALES)};var m=document.cookie.match(/(?:^|; )${LOCALE_COOKIE}=([a-z]{2})/);var c=m&&m[1];if(L.indexOf(c)<0){c=null;var n=navigator.languages||[navigator.language];for(var i=0;i<n.length&&!c;i++){var b=String(n[i]).slice(0,2).toLowerCase();if(L.indexOf(b)>=0)c=b;}}location.replace("/"+(c||"${DEFAULT_LOCALE}")+location.hash);}catch(e){location.replace("/${DEFAULT_LOCALE}");}})();`;

export default function RootRedirect() {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="/en" />
        <script dangerouslySetInnerHTML={{ __html: detect }} />
        <noscript>
          <meta httpEquiv="refresh" content={`0; url=/${DEFAULT_LOCALE}`} />
        </noscript>
      </head>
      <body>
        <a href={`/${DEFAULT_LOCALE}`}>ContentArc</a>
      </body>
    </html>
  );
}
