"use client";

import { useState, useEffect } from "react";
import { InputNumber, Button, Spin, Alert } from "antd";
import { useCommissionSettings } from "@/services/wallet";

interface CommissionConfigProps {
  onClose?: () => void;
}

const CommissionConfig = ({ onClose }: CommissionConfigProps) => {
  const { settings, loading, saving, updateSettings } = useCommissionSettings();
  const [localPercentage, setLocalPercentage] = useState<number>(10);

  useEffect(() => {
    if (settings) {
      setLocalPercentage(settings.commission_percentage);
    }
  }, [settings]);

  const handleSave = async () => {
    const ok = await updateSettings(localPercentage);
    if (ok) onClose?.();
  };

  if (loading) {
    return (
      <div className="w-full h-[120px] flex justify-center items-center">
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        Define el porcentaje de comisión que Plazze retiene sobre cada reserva
        pagada. Este valor se aplica solo a las <strong>nuevas reservas</strong>
        ; las reservas existentes mantienen la comisión con la que fueron
        creadas.
      </p>

      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 pr-6 font-semibold text-gray-700">
              Comisión por reserva pagada
            </th>
            <th className="text-center py-2 px-3 font-semibold text-gray-700">
              Porcentaje
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-semibold py-3 pr-6 text-gray-800">Plazze</td>
            <td className="py-3 px-3 text-center">
              <InputNumber
                min={0}
                max={100}
                precision={2}
                step={0.5}
                value={localPercentage}
                onChange={(v) => setLocalPercentage(v ?? 0)}
                addonAfter="%"
                style={{ width: 140 }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {settings && (
        <Alert
          type="info"
          showIcon
          className="mb-4"
          message={`Comisión vigente: ${settings.commission_percentage}% — Plazze retiene $${settings.commission_percentage} de cada $100 cobrado al cliente.`}
        />
      )}

      <div className="flex justify-end gap-2 mt-2">
        {onClose && (
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
        )}
        <Button
          type="primary"
          loading={saving}
          onClick={handleSave}
          disabled={localPercentage === settings?.commission_percentage}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default CommissionConfig;
