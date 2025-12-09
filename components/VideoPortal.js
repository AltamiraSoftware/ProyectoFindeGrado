"use client";

import { createPortal } from "react-dom";


export default function VideoPortal({ children }) {
    const isClient = typeof window !== "undefined";
    if (!isClient) return null;
    

  return createPortal(
    children,
    document.getElementById("video-root")
  );
}
