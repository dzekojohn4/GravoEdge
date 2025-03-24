import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
    component: Dashboard,
});

function Dashboard() {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-baseWhite">Dashboard Works!</h1>
            <p className="text-baseWhite">This is a test dashboard.</p>
        </div>
    );
}
