import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarLayout,
    SidebarTrigger,
} from "@/components/ui/sidebar";

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
                <div className="h-full rounded-md border-2 border-dashed p-2  box-border">
                    {/*<SidebarTrigger className={``}/>*/}
                    {children}
                </div>
            </main>
        </SidebarLayout>
    );
}
