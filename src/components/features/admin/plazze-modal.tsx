"use client";

import { Button, Modal } from "antd";
import { LuPlus } from "react-icons/lu";
import PlazzeForm from "./plazze-form";
import { useState } from "react";
import { type Plazze } from "@/types/plazze";

interface PlazzeModalProps {
  trigger?: React.ReactNode;
  plazze?: Partial<Plazze>;
  mode?: "create" | "edit";
  onSubmit?: (values: Partial<Plazze>) => Promise<void>;
}

export default function PlazzeModal({
  trigger,
  plazze,
  mode = "create",
}: PlazzeModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        width={640}
        centered
      >
        <PlazzeForm initialValues={plazze} />
      </Modal>
    </>
  );
}
