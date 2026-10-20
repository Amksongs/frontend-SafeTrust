import { Suspense } from "react";
import GuestDashboard from "@/components/dashboard/guest/GuestDashboard";
import { HotelHeader } from "@/components/listings";

export default function GuestDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <HotelHeader />
      <Suspense fallback={<main className="min-h-screen bg-white px-6 py-12 dark:bg-slate-900" />}>
        <GuestDashboard />
      </Suspense>
    </div>
  );
}
