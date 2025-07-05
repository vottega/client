export function Main({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>;
}
