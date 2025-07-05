import TheHeader from "@/components/TheHeader";

export function NavigationMenuDemo() {
  return <div></div>;
}

export default function HomePage() {
  return (
    <div>
      <TheHeader />
      <header className="flex">
        <NavigationMenuDemo />
      </header>
    </div>
  );
}
