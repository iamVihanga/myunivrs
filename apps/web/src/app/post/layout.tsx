import Navbar from "../webApp/navigation/navigation"; // Adjust the path if needed

export default function PostLayout({
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
