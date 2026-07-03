import React from "react";
import { MorningInventoryProvider } from "../context/MorningInventoryProvider";
import { MorningInventoryScreenContent } from "./MorningInventoryScreenContent";

export default function MorningInventoryScreen() {
  return (
    <MorningInventoryProvider>
      <MorningInventoryScreenContent />
    </MorningInventoryProvider>
  );
}
