import { useState } from "react";
import { addStore, updateStore } from "../services/storesLocalService";

export type ExistingStore = {
  id: string;
  name: string;
  province: string;
  city: string;
  barangay: string;
  contact_name: string;
  contact_number: string;
};

export function useStoreForm(
  provinceId: string,
  onClose: () => void,
  onAdded: () => void,
  initialStore?: ExistingStore,
  onUpdated?: () => void,
) {
  const isEditing = !!initialStore;

  const [name, setName] = useState(initialStore?.name ?? "");
  const [province, setProvince] = useState(initialStore?.province ?? "");
  const [city, setCity] = useState(initialStore?.city ?? "");
  const [barangay, setBarangay] = useState(initialStore?.barangay ?? "");
  const [contactName, setContactName] = useState(
    initialStore?.contact_name ?? "",
  );
  const [contactPhone, setContactPhone] = useState(
    initialStore?.contact_number ?? "",
  );

  const canSubmit = name.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const fields = { name, province, city, barangay, contactName, contactPhone };
    if (isEditing && initialStore) {
      await updateStore(initialStore.id, fields);
      onUpdated?.();
    } else {
      await addStore(provinceId, fields);
      onAdded();
    }
    onClose();
  };

  return {
    isEditing,
    name,
    setName,
    province,
    setProvince,
    city,
    setCity,
    barangay,
    setBarangay,
    contactName,
    setContactName,
    contactPhone,
    setContactPhone,
    canSubmit,
    handleSubmit,
  };
}
