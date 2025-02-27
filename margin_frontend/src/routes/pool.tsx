import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pool")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center ">
      <h1 className="text-4xl text-white">Pool page</h1>
    </div>
  );
}
