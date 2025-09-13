import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClientProviderWrapper from "@/components/QueryClientProvider/QueryClientProvider";


export const metadata: Metadata = {
  title: {
    default: "Inmobiliaria XYZ",
    template: "%s | Inmobiliaria XYZ",
  },
  description:
    "Explora y encuentra propiedades únicas con Inmobiliaria XYZ. Casas, apartamentos y más, con filtros avanzados y navegación sencilla.",
  keywords: [
    "propiedades",
    "inmobiliaria",
    "casas en venta",
    "apartamentos en arriendo",
    "bienes raíces Colombia",
  ],
  authors: [{ name: "Inmobiliaria XYZ" }],
  openGraph: {
    title: "Inmobiliaria XYZ",
    description:
      "Encuentra tu próximo hogar con nuestro buscador de propiedades.",
    url: "https://tu-dominio.com",
    siteName: "Inmobiliaria XYZ",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inmobiliaria XYZ",
    description: "Explora propiedades en venta y arriendo.",
    creator: "@tuusuario",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">

      <body
        className={`antialiased`}
      >
        <QueryClientProviderWrapper>
          <main>
            {children}
          </main>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
