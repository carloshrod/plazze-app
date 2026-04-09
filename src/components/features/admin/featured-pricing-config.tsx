import React, { useState } from "react";
import { Card, InputNumber, Button, message, Spin, Alert } from "antd";
import { usePackagePricing } from "@/services/package-pricing";
import { PackageDuration } from "@/consts/packagePricing";

const DURATIONS: PackageDuration[] = ["7", "15", "30"];

export const FeaturedPricingConfig: React.FC = () => {
  const { pricing, loading, error, savePricing } = usePackagePricing();
  const [localPricing, setLocalPricing] = useState(() => ({
    default: { "7": 0, "15": 0, "30": 0 },
  }));
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (pricing && pricing.featured) {
      setLocalPricing({
        default: { ...pricing.featured.default },
      });
    }
  }, [pricing]);

  const handleChange = (duration: PackageDuration, value: number) => {
    setLocalPricing((prev) => ({
      ...prev,
      default: { ...prev.default, [duration]: value },
    }));
  };

  const handleSave = async () => {
    if (!pricing) return;
    setSaving(true);
    const newPricing = {
      ...pricing,
      featured: {
        default: { ...localPricing.default },
      },
    };
    const ok = await savePricing(newPricing);
    setSaving(false);
    if (ok) message.success("Precios guardados");
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
            <th className="text-left py-2 pr-6 font-semibold text-gray-700">
              Duración
            </th>
            <th className="text-center py-2 px-3 font-semibold text-gray-700">
              Precio
            </th>
          </tr>
        </thead>
        <tbody>
          {DURATIONS.map((d) => (
            <tr key={d} className="border-b border-gray-100 last:border-0">
              <td className="font-semibold py-3 pr-6 text-gray-800">
                {d} días
              </td>
              <td className="py-3 px-3 text-center">
                <InputNumber
                  min={0}
                  value={localPricing.default[d]}
                  onChange={(val) => handleChange(d, val || 0)}
                  formatter={(v) => `$ ${v}`}
                  style={{ width: 110 }}
                />
              </td>
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

export default FeaturedPricingConfig;
