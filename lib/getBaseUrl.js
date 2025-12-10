export function getBaseUrl() {
    const url = process.env.NEXT_PUBLIC_WEB_URL;
  
    // Validación estricta y segura
    if (typeof url === "string" && url.trim().startsWith("https://")) {
      return url.trim();
    }
  
    // Fallback SOLO en local
    return "http://localhost:3000";
  }
  