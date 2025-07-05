import TheHeader from "@/components/TheHeader";

export function NavigationMenuDemo() {
  return <div></div>;
}

export default function Page() {
  return (
    <div>
      <TheHeader />
      <header className="flex">
        <NavigationMenuDemo />
      </header>
    </div>
  );
}
