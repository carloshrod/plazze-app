import { useCallback, useEffect, useRef } from "react";
import { useBannersStore } from "@/stores/banners";
import { usePromotionsStore } from "@/stores/promotions";
import { bannerLib } from "@/libs/api/banner";
import { BannerFormData } from "@/types/plazze";
import showMessage from "@/libs/message";

export const useBannersService = () => {
  const {
    banners,
    loading,
    error,
    setBanners,
    setLoading,
    setError,
    addBanner,
    updateBanner,
    removeBanner,
  } = useBannersStore();

  // Solo ejecutar fetchBanners una vez al montar
  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBanners();
    }
  }, []);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bannerLib.getAllBanners();
      setBanners(data);
    } catch (err: any) {
      setError("Error al cargar los banners");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setBanners]);

  const refreshBanners = useCallback(() => {
    fetchBanners();
  }, [fetchBanners]);

  const createBanner = useCallback(
    async (formData: BannerFormData) => {
      try {
        const banner = await bannerLib.createBanner(formData);
        addBanner(banner);
        showMessage.success("Banner creado exitosamente");
        return banner;
      } catch (err: any) {
        showMessage.error(err.message || "Error al crear el banner");
        throw err;
      }
    },
    [addBanner],
  );

  const editBanner = useCallback(
    async (id: number, formData: Partial<BannerFormData>) => {
      try {
        const banner = await bannerLib.updateBanner(id, formData);
        updateBanner(id, banner);
        showMessage.success("Banner actualizado exitosamente");
        return banner;
      } catch (err: any) {
        showMessage.error(err.message || "Error al actualizar el banner");
        throw err;
      }
    },
    [updateBanner],
  );

  const approveBanner = useCallback(
    async (id: number) => {
      try {
        const banner = await bannerLib.approveBanner(id);
        updateBanner(id, banner);
        usePromotionsStore.getState().decrementBannerRequests();
        showMessage.success("Banner aprobado y publicado");
        return banner;
      } catch (err: any) {
        showMessage.error(err.message || "Error al aprobar el banner");
        throw err;
      }
    },
    [updateBanner],
  );

  const deleteBanner = useCallback(
    async (id: number) => {
      try {
        const wasPending = useBannersStore
          .getState()
          .banners.some(
            (b) =>
              b.id === id && !b.is_active && !!b.seller_id && !b.is_rejected,
          );
        // El endpoint ahora hace soft delete y retorna el banner actualizado
        const deleted = await bannerLib.deleteBanner(id);
        updateBanner(id, deleted);
        if (wasPending) {
          usePromotionsStore.getState().decrementBannerRequests();
        }
        showMessage.success("Banner eliminado exitosamente");
      } catch (err: any) {
        showMessage.error(err.message || "Error al eliminar el banner");
        throw err;
      }
    },
    [updateBanner],
  );

  const rejectBanner = useCallback(
    async (id: number) => {
      try {
        const banner = await bannerLib.rejectBanner(id);
        updateBanner(id, banner);
        usePromotionsStore.getState().decrementBannerRequests();
        showMessage.success("Banner rechazado");
        return banner;
      } catch (err: any) {
        showMessage.error(err.message || "Error al rechazar el banner");
        throw err;
      }
    },
    [updateBanner],
  );

  const restoreBanner = useCallback(
    async (id: number) => {
      try {
        const restored = await bannerLib.restoreBanner(id);
        updateBanner(id, restored);
        showMessage.success("Banner restaurado exitosamente");
        return restored;
      } catch (err: any) {
        showMessage.error(err.message || "Error al restaurar el banner");
        throw err;
      }
    },
    [updateBanner],
  );

  return {
    banners,
    loading,
    error,
    setBanners,
    setLoading,
    setError,
    addBanner,
    updateBanner,
    removeBanner,
    fetchBanners,
    refreshBanners,
    createBanner,
    editBanner,
    approveBanner,
    deleteBanner,
    rejectBanner,
    restoreBanner,
  };
};
