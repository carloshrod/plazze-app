import { Button } from "antd";
import { LuPlus } from "react-icons/lu";
import { PlazzesTable } from "@/components/features/admin/plazzes-table";

export default function PlazzesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mis Plazzes</h1>
          <p className="text-gray-600">Gestiona tus espacios registrados</p>
        </div>
        <Button type="primary" icon={<LuPlus size={20} />} size="large">
          Nuevo Plazze
        </Button>
      </div>
      <PlazzesTable />;
    </div>
  );
}
