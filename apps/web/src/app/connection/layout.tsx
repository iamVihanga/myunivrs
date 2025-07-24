import Navbar from "../webApp/navigation/navigation"; // Adjust path if needed

export default function ConnectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
