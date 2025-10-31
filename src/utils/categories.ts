export const getCategoryName = (categoryId: string | null): string | null => {
  if (!categoryId) return null;

  const categories = [
    { id: "38", name: "Bares" },
    { id: "42", name: "Discotecas" },
    { id: "30", name: "Sala de Eventos" },
    { id: "119", name: "Outdoor" },
    { id: "35", name: "Cultura y Artes" },
    { id: "115", name: "Reuniones" },
  ];

  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : categoryId; // Fallback al ID si no se encuentra
};
