import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, FileText } from "lucide-react";
import DashboardWrapper from "@/components/DashboardWrapper";

const Page = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Resumen de tu actividad clínica</p>
      </div>

      {/* Dashboard Content */}
      <DashboardWrapper />
    </div>
  )
}

export default Page