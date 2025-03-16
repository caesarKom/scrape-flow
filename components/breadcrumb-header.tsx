"use client"

import React from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { MobileSidebar } from "./side-bar"

export const BreadcrumbHeader = () => {
  const pathname = usePathname()
  const paths = pathname === "/" ? ["/"] : pathname?.split("/")
  return (
    <div className="flex items-center flex-start">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, i) => (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                <BreadcrumbLink className="capitalize" href={path}>
                  {path === "/" ? "home" : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
