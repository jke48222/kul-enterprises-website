import ConceptNav from "@/components/concept/ConceptNav";
import ConceptFooter from "@/components/concept/ConceptFooter";
import PageReveal from "@/components/concept/PageReveal";
import V1IntroOverlay from "@/components/brand/V1IntroOverlay";

/**
 * V1 site chrome, preserved verbatim for the /v1 demo tree: pill
 * navigation, arrival curtain, structured footer, and the Doctor Bird
 * first-visit intro. `.v1-scope` re-applies the v1 styling for utility
 * classes that v2 redefined (buttons, display type scale) — see
 * app/v1-legacy.css. Metadata inherits from the root layout.
 */
export default function V1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="v1-scope bg-ink2 font-mont text-[15px] leading-[1.5] text-white antialiased">
      {/* v1's pre-paint gates, scoped to this subtree: decide whether the
          intro cover (already in the server HTML) is visible this visit,
          and arm the arrival curtain only when JS is running. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('kul-intro-seen')!=='1')document.documentElement.setAttribute('data-intro','1')}catch(e){}try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-page-reveal','1')}catch(e){}",
        }}
      />
      <noscript>
        <style>{`.kul-intro-root{display:none!important}[data-reveal-failsafe]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <V1IntroOverlay />
      {/* First visits only: attach the intro film's src so it buffers
          immediately; repeat visits leave the hidden overlay src-less. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(document.documentElement.getAttribute('data-intro')==='1'){var v=document.querySelector('.kul-intro-root video');if(v){v.muted=true;v.src=v.getAttribute('data-src');}}}catch(e){}",
        }}
      />
      <PageReveal />
      {/* display:contents wrapper: zero layout impact, single inert target
          while the arrival curtain covers the page. */}
      <div style={{ display: "contents" }} data-kul-frame>
        <ConceptNav />
        <main id="main">{children}</main>
        <ConceptFooter />
      </div>
    </div>
  );
}
