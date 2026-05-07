import { AdminSignOutButton } from "./admin-sign-out-button";

type AdminHeaderProps = {
  userEmail?: string | null;
  userName?: string | null;
};

export function AdminHeader({ userEmail, userName }: AdminHeaderProps) {
  const displayName = userName || userEmail || "Administrador";

  return (
    <header className="border-b border-agromassa-border bg-white">
      <div className="flex min-h-20 flex-col justify-center gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-black uppercase text-agromassa-green">
            Painel administrativo
          </p>
          <h1 className="mt-1 text-2xl font-black text-agromassa-ink">
            {displayName}
          </h1>
        </div>

        <AdminSignOutButton />
      </div>
    </header>
  );
}
