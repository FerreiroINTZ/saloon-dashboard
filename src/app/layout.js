import "../styles/globals.css";
import "../styles/pages.css";
import "./notFound_InvalidAcess.css"
import Aside from "./aside/aside"

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <Aside />
        {children}
      </body>
    </html>
  );
}
