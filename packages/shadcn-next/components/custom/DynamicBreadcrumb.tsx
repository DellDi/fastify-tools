'use client'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import React from 'react'
import { useBasePath } from '@/hooks/use-path'

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const { basePath } = useBasePath()

  if (!pathname) return null
  const pathSegments = pathname.split('/').filter((segment: string) => segment)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.length > 0 && (
          // <BreadcrumbItem>
          //     <BreadcrumbLink href={`/${pathSegments[0]}`}>{pathSegments[0]}</BreadcrumbLink>
          // </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`${basePath}/dashboard`}>dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {pathSegments.slice(1).map((segment: string, index: number) => {
          const href = basePath + '/' + pathSegments.slice(0, index + 2).join('/')
          const isLast = index === pathSegments.length - 2

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator/>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
