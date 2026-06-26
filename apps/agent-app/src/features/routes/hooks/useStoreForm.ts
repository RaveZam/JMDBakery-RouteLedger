import { useCallback, useState } from "react";

export type ExistingStore = {
  id: string;
  name: string;
  province: string;
  city: string;
  barangay: string;
  contact_name: string;
  contact_number: string;
};

export type StoreFields = {
  name: string;
  province: string;
  city: string;
  barangay: string;
  contactName: string;
  contactPhone: string;
};

const emptyFields = (): StoreFields => ({
  name: "",
  province: "",
  city: "",
  barangay: "",
  contactName: "",
  contactPhone: "",
});

export const toStoreFields = (store: ExistingStore): StoreFields => ({
  name: store.name,
  province: store.province,
  city: store.city,
  barangay: store.barangay,
  contactName: store.contact_name,
  contactPhone: store.contact_number,
});

export function useStoreForm() {
  const [fields, setFields] = useState<StoreFields>(emptyFields);
  const setField = (key: keyof StoreFields, value: string) =>
    setFields((current) => ({ ...current, [key]: value }));
  const reset = useCallback((next: StoreFields) => setFields(next), []);

  const canSubmit = fields.name.trim().length > 0;

  return { fields, setField, reset, canSubmit };
}
