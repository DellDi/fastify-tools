import { AppSidebar } from "@/components/app-sidebar";
import { SidebarLayout, SidebarTrigger, } from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/custom/DynamicBreadcrumb";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleTheme } from "@/components/custom/ToggleTheme";


export default async ({ children }: {
    children: React.ReactNode
}) => {
    const { cookies } = await import("next/headers");
    return (
        <SidebarLayout
            defaultOpen={cookies().get("sidebar:state")?.value === "true"}
        >
            <AppSidebar/>
            <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out box-border">
                <div className="h-full rounded-md border-1 p-2  box-border">
                    <header className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center justify-center">
                            <SidebarTrigger className={`mr-2`}/>
                            <DynamicBreadcrumb/>
                        </div>
                        <div className="flex-1 w-full flex justify-end">
                            <form className="md:w-1/3 lg:w-1/4">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="w-full appearance-none bg-background pl-8 shadow-none"
                                    />
                                </div>
                            </form>
                            <ToggleTheme className="ml-2"/>
                        </div>
                    </header>

                    {children}
                </div>
            </main>
        </SidebarLayout>
    );
}
