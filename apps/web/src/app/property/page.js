import { Suspense } from "react";
import PropertyContent from "./PropertyContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando propiedades...</div>}>
      <PropertyContent />
    </Suspense>
  );
}
