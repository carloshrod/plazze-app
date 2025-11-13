"use client";

import { Button, Modal } from "antd";
import { LuPlus } from "react-icons/lu";
import PlazzeForm from "./plazze-form";
import { useMyPlazzesService } from "@/services/my-plazzes";
import { usePlazzeModalStore } from "@/stores/plazze-modal";

const PlazzeModal = () => {
  const { refreshPlazzes } = useMyPlazzesService();
  const { isOpen, mode, initialFormData, openCreateModal, closeModal } =
    usePlazzeModalStore();

  const handleOpenModal = () => {
    openCreateModal();
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const handleSuccess = () => {
    handleCloseModal();
    refreshPlazzes();
  };

  return (
    <>
      {/* Trigger por defecto para crear plazzes */}
      <Button
        type="primary"
        icon={<LuPlus size={20} />}
        size="large"
        onClick={handleOpenModal}
      >
        Nuevo Plazze
      </Button>

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
        />
      </Modal>
    </>
  );
};

export default PlazzeModal;
