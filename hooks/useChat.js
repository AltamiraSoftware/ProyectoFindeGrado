"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useChat(idCliente, idProfesional, userId) {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const parametrosValidos = !!idCliente && !!idProfesional && !!userId;

  /* ============================================================
        CARGA INICIAL — Sin setState síncrono
  ============================================================ */
  useEffect(() => {
    // Si no tenemos parámetros aún, simplemente no hacemos nada.
    if (!parametrosValidos) return;

    let cancelado = false;

    async function load() {
      const { data, error } = await supabase
        .from("mensajes_chat")
        .select("*")
        .eq("id_cliente", idCliente)
        .eq("id_profesional", idProfesional)
        .order("creado_en", { ascending: true });

      if (error) console.error("CHAT SELECT ERROR:", error);

      if (!cancelado) {
        setMensajes(data || []);
        setCargando(false);
      }
    }

    load();

    return () => {
      cancelado = true;
    };
  }, [parametrosValidos, idCliente, idProfesional]);

  /* ============================================================
        REALTIME — FILTRO CORREGIDO
        (solo filtramos por id_cliente)
  ============================================================ */
  useEffect(() => {
    if (!parametrosValidos) return;

    const canal = supabase
      .channel(`chat-${idCliente}-${idProfesional}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensajes_chat",
          filter: `id_cliente=eq.${idCliente}`,
        },
        (payload) => {
          setMensajes((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [parametrosValidos, idCliente, idProfesional]);

  /* ============================================================
        ENVIAR MENSAJE — limpio y sin console.logs
  ============================================================ */
  const enviarMensaje = useCallback(
    async (texto) => {
      if (!parametrosValidos) return;
      if (!texto.trim()) return;

      const mensaje = {
        id_cliente: idCliente,
        id_profesional: idProfesional,
        id_remitente: userId,
        contenido: texto.trim(),
      };

      const { error } = await supabase
        .from("mensajes_chat")
        .insert(mensaje);

      if (error) console.error("INSERT CHAT ERROR:", error);
    },
    [parametrosValidos, idCliente, idProfesional, userId]
  );

  /* ============================================================
        RETORNO ESTABLE
  ============================================================ */
  return {
    mensajes,
    cargando: parametrosValidos ? cargando : true,
    enviarMensaje,
  };
}
