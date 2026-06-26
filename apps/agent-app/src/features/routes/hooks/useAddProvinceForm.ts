import { useState } from "react";

export function useAddProvinceForm() {
  const [provinceName, setProvinceName] = useState("");
  const canSubmit = provinceName.trim().length > 0;
  const reset = () => setProvinceName("");

  return { provinceName, setProvinceName, canSubmit, reset };
}
