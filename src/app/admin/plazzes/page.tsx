import PlazzeModal from "@/components/features/admin/plazze-modal";
import { PlazzesTable } from "@/components/features/admin/plazzes-table";

export default function PlazzesPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mis Plazzes</h1>
          <p className="text-gray-600">Gestiona tus espacios</p>
        </div>
        <PlazzeModal />
      </div>
      <PlazzesTable />
    </div>
  );
}
