import { HeaderBooked } from "@/components/headerBooked";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata = {
  title: "Mi Perfil",
  description: "configuración de Booked",
};

export default function MainMenuLayout({ children }) {
  return (
    <div className="flex flex-row ">
      {/*<HeaderBooked />*/}
      <SidebarProvider className="min-h-min max-w-[250px] min-w-[200px]">
        <AppSidebar />
      </SidebarProvider>
      {children}
    </div>
  );
}
