
export function getBaseUrl() {
    const url = process.env.NEXT_PUBLIC_WEB_URL;
  
    // Si existe y es válida → usarla (entorno Vercel)
    if (url && url.startsWith("http")) {
      return url;
    }
  
    // Si no existe → entorno local
    return "http://localhost:3000";
  }
  