import { Outlet } from "react-router-dom";
import { StatusBar } from "./StatusBar";
import { UserBar } from "./UserBar";

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-panel-bg bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_55%)]">
      <StatusBar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
      <UserBar />
    </div>
  );
}
