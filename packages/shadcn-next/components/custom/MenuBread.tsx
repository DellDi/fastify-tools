'use client';

import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import React from 'react';

export function DynamicBreadcrumb() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter((segment: string) => segment);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathSegments.length > 0 && (
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${pathSegments[0]}`}>{pathSegments[0]}</BreadcrumbLink>
                    </BreadcrumbItem>
                )}
                {pathSegments.slice(1).map((segment: string, index: number) => {
                    const href = '/' + pathSegments.slice(0, index + 2).join('/');
                    const isLast = index === pathSegments.length - 2;

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{segment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
