/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { PlazzeFormData, PlazzeWP } from "@/types/plazze";

interface PlazzeModalState {
  // Estado del modal
  isOpen: boolean;
  mode: "create" | "edit";

  // Datos para edición
  editingPlazze: PlazzeWP | null;
  initialFormData: Partial<PlazzeFormData> | null;

  // Acciones
  openCreateModal: () => void;
  openEditModal: (
    editPlazze: PlazzeWP,
    editFormData?: Partial<PlazzeFormData>
  ) => void;
  closeModal: () => void;
  reset: () => void;
}

export const usePlazzeModalStore = create<PlazzeModalState>((set) => ({
  // Estado inicial
  isOpen: false,
  mode: "create",
  editingPlazze: null,
  initialFormData: null,

  // Abrir modal para crear
  openCreateModal: () =>
    set({
      isOpen: true,
      mode: "create",
      editingPlazze: null,
      initialFormData: null,
    }),

  // Abrir modal para editar
  openEditModal: (
    editPlazze: PlazzeWP,
    editFormData?: Partial<PlazzeFormData>
  ) =>
    set({
      isOpen: true,
      mode: "edit",
      editingPlazze: editPlazze,
      initialFormData: editFormData || null,
    }),

  // Cerrar modal
  closeModal: () =>
    set({
      isOpen: false,
    }),

  // Resetear todo el estado
  reset: () =>
    set({
      isOpen: false,
      mode: "create",
      editingPlazze: null,
      initialFormData: null,
    }),
}));
