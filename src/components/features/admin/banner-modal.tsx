"use client";

import { useState } from "react";
import { Button, Modal } from "antd";
import { useRouter } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import BannerForm from "./banner-form";
import { useBannersStore } from "@/stores/banners";
import { bannerLib } from "@/libs/api/banner";
import showMessage from "@/libs/message";
import type { Banner, BannerFormData } from "@/types/plazze";

interface BannerModalProps {
  /** Si se pasa, el modal actúa en modo edición */
  banner?: Banner;
  /** Trigger personalizado — si no se pasa, muestra el botón "Nuevo banner" */
  trigger?: React.ReactNode;
  /** Si es true, adapta el formulario para flujo de vendedor (draft) */
  isSeller?: boolean;
}

const BannerModal = ({
  banner,
  trigger,
  isSeller = false,
}: BannerModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Usar el store directamente para evitar disparar el auto-fetch del service
  const { addBanner, updateBanner } = useBannersStore();
  const router = useRouter();
  const isEdit = !!banner;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSuccess = async (formData: BannerFormData) => {
    try {
      if (isEdit && banner) {
        const updated = await bannerLib.updateBanner(banner.id, formData);
        updateBanner(banner.id, updated);
        if (isSeller) {
          showMessage.success(
            "Banner actualizado. Está nuevamente en revisión por el administrador.",
          );
        } else {
          showMessage.success("Banner actualizado exitosamente");
        }
        handleClose();
      } else {
        const created = await bannerLib.createBanner(formData);
        addBanner(created);
        if (isSeller) {
          // Redirigir a la página de pago simulado (intermedia)
          router.replace(
            `/pago-ejemplo?tipo=banner&id=${created.id}&paquete=${formData.package}`,
          );
        } else {
          showMessage.success("Banner creado exitosamente");
          handleClose();
        }
      }
    } catch (err: any) {
      showMessage.error(err.message || "Error al guardar el banner");
    }
  };

  return (
    <>
      {trigger ? (
        <span onClick={handleOpen} className="cursor-pointer">
          {trigger}
        </span>
      ) : (
        <Button
          type="primary"
          icon={<LuPlus size={20} />}
          size="large"
          onClick={handleOpen}
        >
          Nuevo banner
        </Button>
      )}

      <Modal
        title={
          isEdit
            ? "Editar banner"
            : isSeller
              ? "Solicitar banner"
              : "Nuevo banner"
        }
        open={isOpen}
        onCancel={handleClose}
        footer={null}
        width="95vw"
        style={{ maxWidth: 720, top: 20 }}
        styles={{
          body: {
            maxHeight: "85vh",
            overflow: "auto",
            padding: "24px",
          },
        }}
        destroyOnHidden={true}
      >
        <BannerForm
          initialValues={banner}
          onSuccess={handleSuccess}
          onCancel={handleClose}
          isSeller={isSeller}
        />
      </Modal>
    </>
  );
};

export default BannerModal;
