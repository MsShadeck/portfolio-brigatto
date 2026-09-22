type Provider = "youtube" | "vimeo" | null;

export function parseVideoUrl(url: string): { provider: Provider; embedUrl: string | null } {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) {
      let id: string | null = null;
      if (parsed.hostname.includes("youtu.be")) {
        id = parsed.pathname.slice(1);
      } else if (parsed.pathname.startsWith("/embed/")) {
        id = parsed.pathname.replace("/embed/", "");
      } else {
        id = parsed.searchParams.get("v");
      }
      if (!id) return { provider: "youtube", embedUrl: null };
      return { provider: "youtube", embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1` };
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (!id) return { provider: "vimeo", embedUrl: null };
      return { provider: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }

    return { provider: null, embedUrl: null };
  } catch {
    return { provider: null, embedUrl: null };
  }
}

export function isDirectVideoFile(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}
