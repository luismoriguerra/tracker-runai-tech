import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Expensen - Expense Management",
  description: "A modern expense management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <BreadcrumbProvider>
              <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                      <SidebarTrigger className="-ml-1" />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <DynamicBreadcrumb />
                    </div>
                    <div className="px-4">
                      <ModeToggle />
                    </div>
                  </header>
                  {children}
                  <Toaster />
                </SidebarInset>
              </SidebarProvider>
            </BreadcrumbProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
