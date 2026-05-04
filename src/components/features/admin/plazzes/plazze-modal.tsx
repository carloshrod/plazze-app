"use client";

import { Button, Modal, Tooltip } from "antd";
import { LuPlus } from "react-icons/lu";
import PlazzeForm from "./plazze-form";
import { useMyPlazzesService } from "@/services/my-plazzes";
import { usePlazzeModalStore } from "@/stores/plazze-modal";

interface PlazzeModalProps {
  disabled?: boolean;
  disabledReason?: string;
  /** Si se provee, el botón llama este callback en vez de abrir el modal directamente */
  onTriggerClick?: () => void;
  /** Callback ejecutado después de crear/actualizar un plazze exitosamente */
  onAfterSuccess?: () => void;
  /** Límite de fotos según el plan del seller */
  photoLimit?: number;
}

const PlazzeModal = ({
  disabled,
  disabledReason,
  onTriggerClick,
  onAfterSuccess,
  photoLimit,
}: PlazzeModalProps) => {
  const { refreshPlazzes } = useMyPlazzesService();
  const { isOpen, mode, initialFormData, openCreateModal, closeModal } =
    usePlazzeModalStore();

  const handleOpenModal = () => {
    if (onTriggerClick) {
      onTriggerClick();
    } else {
      openCreateModal();
    }
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const handleSuccess = () => {
    handleCloseModal();
    refreshPlazzes();
    onAfterSuccess?.();
  };

  return (
    <>
      {/* Trigger por defecto para crear plazzes */}
      <Tooltip title={disabled ? disabledReason : undefined}>
        <Button
          type="primary"
          icon={<LuPlus size={20} />}
          size="large"
          onClick={handleOpenModal}
          disabled={disabled}
        >
          Nuevo Plazze
        </Button>
      </Tooltip>

      <Modal
        title={mode === "create" ? "Nuevo Plazze" : "Editar Plazze"}
        open={isOpen}
        onCancel={handleCloseModal}
        footer={null}
        width="95vw"
        style={{
          maxWidth: "1400px",
          top: 20,
        }}
        styles={{
          body: {
            maxHeight: "85vh",
            overflow: "auto",
            padding: "24px",
          },
        }}
        destroyOnHidden={true}
      >
        <PlazzeForm
          initialValues={initialFormData || undefined}
          onSuccess={handleSuccess}
          isModalVisible={isOpen}
          photoLimit={photoLimit}
        />
      </Modal>
    </>
  );
};

export default PlazzeModal;
