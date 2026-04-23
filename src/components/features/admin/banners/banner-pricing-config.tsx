import React, { useState } from "react";
import { Card, InputNumber, Button, Spin, Alert } from "antd";
import { usePackagePricing } from "@/services/package-pricing";
import { BannerPosition, PackageDuration } from "@/consts/packagePricing";
import { useBannersStore } from "@/stores/banners";
import showMessage from "@/libs/message";

const POSITIONS: BannerPosition[] = ["features", "trending"];
const DURATIONS: PackageDuration[] = ["7", "15", "30"];

export const BannerPricingConfig: React.FC = () => {
  const { pricing, loading, error, savePricing } = usePackagePricing();
  const { closePricingModal } = useBannersStore();
  const [localPricing, setLocalPricing] = useState(() => {
    // Estructura inicial completa para evitar errores de tipo
    return {
      features: { "7": 0, "15": 0, "30": 0 },
      trending: { "7": 0, "15": 0, "30": 0 },
    };
  });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (pricing && pricing.banner) {
      setLocalPricing({
        features: { ...pricing.banner.features },
        trending: { ...pricing.banner.trending },
      });
    }
  }, [pricing]);

  const handleChange = (
    position: BannerPosition,
    duration: PackageDuration,
    value: number,
  ) => {
    setLocalPricing((prev) => ({
      ...prev,
      [position]: { ...prev[position], [duration]: value },
    }));
  };

  const handleSave = async () => {
    if (!pricing) return;
    setSaving(true);
    // Asegurar estructura completa
    const newPricing = {
      ...pricing,
      banner: {
        features: { ...localPricing.features },
        trending: { ...localPricing.trending },
      },
    };
    const ok = await savePricing(newPricing);
    setSaving(false);
    if (ok) {
      showMessage.success("Precios guardados");
      closePricingModal();
    }
  };

  if (loading)
    return (
      <div className="w-full h-[200px] flex justify-center items-center">
        <Spin />
      </div>
    );
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card>
      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 pr-4 font-semibold text-gray-700">
              Posición
            </th>
            {DURATIONS.map((d) => (
              <th
                key={d}
                className="text-center py-2 px-3 font-semibold text-gray-700"
              >
                {d} días
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {POSITIONS.map((pos) => (
            <tr key={pos} className="border-b border-gray-100 last:border-0">
              <td className="font-semibold capitalize py-3 pr-4 text-gray-800">
                {pos}
              </td>
              {DURATIONS.map((d) => (
                <td key={d} className="py-3 px-3 text-center">
                  <InputNumber
                    min={0}
                    value={localPricing[pos][d]}
                    onChange={(val) => handleChange(pos, d, val || 0)}
                    formatter={(v) => `$ ${v}`}
                    style={{ width: 110 }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <Button type="primary" onClick={handleSave} loading={saving}>
          Guardar precios
        </Button>
      </div>
    </Card>
  );
};
