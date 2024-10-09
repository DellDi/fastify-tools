import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarLayout,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import dynamic from 'next/dynamic';
import { SlashIcon } from "@radix-ui/react-icons"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


const DashboardContent = dynamic(() => import('@/app/dashboard/chart/page'), {
    ssr: false,
});

export default async function Page() {
    const { cookies } = await import("next/headers");
    return (
        <SidebarLayout
            defaultOpen={cookies().get("sidebar:state")?.value === "true"}
        >
            <AppSidebar/>
            <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
                <div className="h-full rounded-md border-2 border-dashed p-2">
                    <SidebarTrigger/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon/>
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/components">Components</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon/>
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <DashboardContent/>
                </div>
            </main>
        </SidebarLayout>
    );
}
