import React from "react";
import ReservationCard from "../../member_dashboard/ReservationCard";
import useDashboardStore from "../../../store/useDashboardStore";

export default function Reservations() {
  const reservations = useDashboardStore((state) => state.reservations);
  const cancelReservation = useDashboardStore((state) => state.cancelReservation);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Reservations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reservations.map((res) => (
          <ReservationCard
            key={res.id}
            reservation={res}
            onCancel={() => cancelReservation(res.id)}
          />
        ))}
      </div>
    </div>
  );
}
