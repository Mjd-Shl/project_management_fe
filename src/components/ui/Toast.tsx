import { Toaster } from "sonner";

export function Toast() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: "var(--font-sans)",
          borderRadius: "var(--radius-card)",
        },
      }}
    />
  );
}