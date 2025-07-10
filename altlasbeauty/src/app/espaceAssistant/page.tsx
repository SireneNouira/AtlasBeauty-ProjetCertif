import AssistantGuard from "@/components/AssistantGuard";
import EspaceAssistantPage from "./EspaceAssistantPage"; // bon chemin selon ton arbo

export default function Page() {
  return (
    <AssistantGuard>
      <EspaceAssistantPage />
    </AssistantGuard>
  );
}
