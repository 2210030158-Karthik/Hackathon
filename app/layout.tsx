import "./globals.css";
import Navbar from "@/components/Navbar";
import { LearningProfileProvider } from "@/components/LearningProfileContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LearningProfileProvider>
          <Navbar />
          {children}
        </LearningProfileProvider>
      </body>
    </html>
  );
}
