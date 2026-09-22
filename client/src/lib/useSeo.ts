import { useEffect } from "react";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function setJsonLd(id: string, data: object | null) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSeo(opts: { title: string; description: string; path: string; jsonLd?: object }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = opts.title;
    setMeta("description", opts.description);
    setMeta("og:title", opts.title, "property");
    setMeta("og:description", opts.description, "property");
    setMeta("og:type", "website", "property");
    const url = `${window.location.origin}${opts.path}`;
    setMeta("og:url", url, "property");
    setCanonical(url);
    if (opts.jsonLd) setJsonLd("leasing-jsonld", opts.jsonLd);
    return () => {
      document.title = prevTitle;
      setJsonLd("leasing-jsonld", null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.title, opts.description, opts.path]);
}
