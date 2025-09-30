import { ROUTES } from "@/consts/routes";
import { redirect } from "next/navigation";

const AdminPage = () => {
  return redirect(ROUTES.ADMIN.DASHBOARD);
};

export default AdminPage;
