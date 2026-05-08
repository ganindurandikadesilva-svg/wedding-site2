import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Sameera & Chathurika",
  description: "Wedding Invitation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}
