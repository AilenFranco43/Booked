import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
   
  // Menu items.
  const items = [
    {
      title: "Mi perfil",
      url: "/main-menu/profile"
    },
    {
      title: "Mis Reservas",
      url: "#"
    },
    {
      title: "Mensajes",
      url: "#"
    },
    {
      title: "Guardados",
      url: "#"
    },
    {
      title: "Mis propiedades",
      url: "/main-menu/property"
    },
    {
      title: "Configuracion",
      url: "#"
    },
  ]

  export function AppSidebar() {
    return (
      <Sidebar variant="floating" side="left" collapsible="none" className="mx-5 my-9 bg-[hsl(var(--background))] rounded">
        <SidebarContent>
          <SidebarGroup>
            {/*<SidebarGroupLabel>Application</SidebarGroupLabel>*/}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a className="h-[55px]" href={item.url}>
                        <span className="font-medium my-2 text-xl">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }