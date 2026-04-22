import showMessage from "@/libs/message";
import { promotionsLib } from "@/libs/api/promotions";
import { usePromotionsStore } from "@/stores/promotions";

export const useFeatureRequestsService = () => {
  const store = usePromotionsStore();

  const loadFeatureRequests = async (status?: string) => {
    store.setLoading(true);
    store.setError(null);
    try {
      const requests = await promotionsLib.getFeatureRequests(status);
      store.setFeatureRequests(requests);
    } catch {
      store.setError("Error al cargar las solicitudes");
    } finally {
      store.setLoading(false);
    }
  };

  const approveFeatureRequest = async (id: number, adminNotes?: string) => {
    try {
      const updated = await promotionsLib.updateFeatureRequestStatus(
        id,
        "approved",
        adminNotes,
      );
      store.updateFeatureRequest(updated);
      store.decrementFeatureRequests();
      showMessage.success("Solicitud aprobada con éxito");
      return updated;
    } catch {
      showMessage.error("Error al aprobar la solicitud");
    }
  };

  const rejectFeatureRequest = async (id: number, adminNotes?: string) => {
    try {
      const updated = await promotionsLib.updateFeatureRequestStatus(
        id,
        "rejected",
        adminNotes,
      );
      store.updateFeatureRequest(updated);
      store.decrementFeatureRequests();
      showMessage.success("Solicitud rechazada con éxito");
      return updated;
    } catch {
      showMessage.error("Error al rechazar la solicitud");
    }
  };

  const archiveFeatureRequest = async (id: number) => {
    try {
      await promotionsLib.archiveFeatureRequest(id);
      store.setFeatureRequests(
        store.featureRequests.filter((r) => r.id !== id),
      );
      store.decrementFeatureRequests();
      showMessage.success("Solicitud archivada");
    } catch {
      showMessage.error("Error al archivar la solicitud");
    }
  };

  const reassignFeatureRequest = async (
    featureRequestId: number,
    newPlazzeId: number,
  ) => {
    try {
      const updated = await promotionsLib.reassignFeatureRequest(
        featureRequestId,
        newPlazzeId,
      );
      store.updateFeatureRequest(updated);
      showMessage.success("Destaque reasignado correctamente");
      return updated;
    } catch {
      showMessage.error("Error al reasignar el destaque");
    }
  };

  return {
    featureRequests: store.featureRequests,
    loading: store.loading,
    error: store.error,
    loadFeatureRequests,
    approveFeatureRequest,
    rejectFeatureRequest,
    archiveFeatureRequest,
    reassignFeatureRequest,
  };
};

export const useMyFeatureRequestsService = () => {
  const store = usePromotionsStore();

  const loadMyFeatureRequests = async () => {
    store.setLoading(true);
    store.setError(null);
    try {
      const requests = await promotionsLib.getMyFeatureRequests();
      store.setMyFeatureRequests(requests);
    } catch {
      store.setError("Error al cargar tus solicitudes");
    } finally {
      store.setLoading(false);
    }
  };

  const createFeatureRequest = async (
    plazzeId: number,
    packageDuration: "7" | "15" | "30",
  ) => {
    try {
      const created = await promotionsLib.createFeatureRequest(
        plazzeId,
        packageDuration,
      );
      store.setMyFeatureRequests([...store.myFeatureRequests, created]);
      showMessage.success("Solicitud enviada");
      return created;
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      showMessage.error(
        typeof msg === "string" ? msg : "Error al enviar la solicitud",
      );
      throw err;
    }
  };

  return {
    myFeatureRequests: store.myFeatureRequests,
    loading: store.loading,
    error: store.error,
    loadMyFeatureRequests,
    createFeatureRequest,
  };
};
