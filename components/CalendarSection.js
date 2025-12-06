"use client";

import { CalendarIcon } from "@heroicons/react/24/outline";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarSection({
  selectedDate,
  onChangeSelectedDate,
  eventos,
}) {
  return (
    <section className="col-span-1 md:col-span-2 rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100">
      <div className="w-full rounded-t-xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-4 flex items-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 mr-3">
          <CalendarIcon className="h-6 w-6 text-white" />
        </span>

        <div>
          <h2 className="text-lg font-bold text-white">Calendario</h2>
          <p className="text-white text-xs">
            Selecciona una fecha para ver las citas programadas
          </p>
        </div>
      </div>

      <div className="bg-white p-6 flex flex-col items-center rounded-b-xl">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "",
            center: "prev today next",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={eventos}
          height={400}
          selectable={true}
          dateClick={(info) =>
            onChangeSelectedDate(new Date(info.date))
          }
          eventClick={(info) =>
            info.event.start
              ? onChangeSelectedDate(new Date(info.event.start))
              : null
          }
        />

        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>● Días con citas</span>
          <span>● Fecha seleccionada</span>
        </div>
      </div>
    </section>
  );
}
