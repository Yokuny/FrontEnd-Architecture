import { createFileRoute } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_private/fleet/")({
  component: FleetPage,
});

function FleetPage() {
  return (
    <div className="relative h-full w-full">
      {/* Botão para abrir a sidebar (aparece apenas quando ela está fechada) */}
      <div className="absolute left-4 top-4 z-10">
        <SidebarTrigger />
      </div>

      {/* Conteúdo fullscreen da página Fleet */}
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Fleet Management</h1>
          <p className="text-slate-300 mb-8">Esta é uma página fullscreen. A sidebar está oculta por padrão.</p>
          <p className="text-sm text-slate-400">Clique no botão no canto superior esquerdo para abrir a sidebar.</p>
        </div>
      </div>
    </div>
  );
}
