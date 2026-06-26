import { useState } from "react";
import { routeSaveService } from "../services/route-save-service";

export function useAddProvinceForm(
  routeId: string,
  onClose: () => void,
  onAdded: () => void,
) {
  const [provinceName, setProvinceName] = useState("");
  const canSubmit = provinceName.trim().length > 0;

  const handleCancel = () => {
    setProvinceName("");
    onClose();
  };

  const handleAdd = () => {
    if (!canSubmit) return;
    routeSaveService.addProvince(routeId, provinceName);
    setProvinceName("");
    onAdded();
  };

  return { provinceName, setProvinceName, canSubmit, handleCancel, handleAdd };
}
