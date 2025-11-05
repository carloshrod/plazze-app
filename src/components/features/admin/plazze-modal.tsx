"use client";

import { Button, Modal } from "antd";
import { LuPlus } from "react-icons/lu";
import PlazzeForm from "./plazze-form";
import { useState } from "react";
import { PlazzeFormData } from "@/types/plazze";
import { useMyPlazzes } from "@/hooks/useMyPlazzes";

interface PlazzeModalProps {
  trigger?: React.ReactNode;
  plazze?: Partial<PlazzeFormData>;
  mode?: "create" | "edit";
}

export default function PlazzeModal({
  trigger,
  plazze,
  mode = "create",
}: PlazzeModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { refreshPlazzes } = useMyPlazzes();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    handleCloseModal();
    refreshPlazzes();
  };

  const defaultTrigger = (
    <Button
      type="primary"
      icon={<LuPlus size={20} />}
      size="large"
      onClick={handleOpenModal}
    >
      Nuevo Plazze
    </Button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={handleOpenModal}>{trigger}</div>
      ) : (
        defaultTrigger
      )}

      <Modal
        title={mode === "create" ? "Nuevo Plazze" : "Editar Plazze"}
        open={isModalOpen}
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
        <PlazzeForm initialValues={plazze} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
}
