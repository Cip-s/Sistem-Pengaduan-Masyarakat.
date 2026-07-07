import "./globals.css";
import AppChrome from "../components/AppChrome";

export const metadata = {
  title: "Sistem Pengaduan Masyarakat",
  description: "Platform pengaduan masyarakat berbasis web.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
