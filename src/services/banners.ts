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

  const hasFetched = useRef(false);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
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
        await bannerLib.deleteBanner(id);
        removeBanner(id);
        if (wasPending) {
          usePromotionsStore.getState().decrementBannerRequests();
        }
        showMessage.success("Banner eliminado exitosamente");
      } catch (err: any) {
        showMessage.error(err.message || "Error al eliminar el banner");
        throw err;
      }
    },
    [removeBanner],
  );

  const rejectBanner = useCallback(
    async (id: number) => {
      try {
        const banner = await bannerLib.rejectBanner(id);
        updateBanner(id, banner);
        usePromotionsStore.getState().decrementBannerRequests();
        showMessage.success("Solicitud de banner rechazada");
      } catch (err: any) {
        showMessage.error(err.message || "Error al rechazar el banner");
        throw err;
      }
    },
    [updateBanner],
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBanners();
    }
  }, [fetchBanners]);

  return {
    banners,
    loading,
    error,
    fetchBanners,
    refreshBanners,
    approveBanner,
    rejectBanner,
    createBanner,
    editBanner,
    deleteBanner,
  };
};
