import React from "react";
import FineCard from "../../member_dashboard/FineCard";
import useDashboardStore from "../../../store/useDashboardStore";

export default function Fines() {
  const fines = useDashboardStore((state) => state.fines);

  // حساب مجموع الغرامات غير المدفوعة
  const totalUnpaid = fines
    .filter((fine) => !fine.paid)
    .reduce((sum, fine) => sum + fine.amount, 0);

  return (
    <div className="container py-8">
      {/* المجموع فوق البطاقات */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Fines</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
          Total Unpaid: ${totalUnpaid}
        </p>
      </div>

      {/* البطاقات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fines.map((fine) => (
          <FineCard key={fine.id} fine={fine} />
        ))}
      </div>
    </div>
  );
}