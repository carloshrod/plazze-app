import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import es_ES from "antd/locale/es_ES";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "Plazze - Reserva espacios únicos para tus eventos",
  description:
    "Encuentra y reserva espacios únicos para eventos, reuniones, talleres y experiencias inolvidables",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-mont" suppressHydrationWarning>
        <AntdRegistry>
          <ConfigProvider theme={theme} locale={es_ES}>
            <AuthProvider>{children}</AuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
