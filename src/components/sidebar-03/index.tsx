import { AppSidebar } from "@/components/sidebar-03/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Sidebar03() {
  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col" />
      </div>
    </SidebarProvider>
  );
}
