import { NewNotifications } from "@/features/notifications/components/new-notifications";
import { NotificationssList } from "@/features/notifications/components/notifications-list";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default function NotificationsPage({ searchParams }: PageProps) {
  const { page = "1", search = "" } = searchParams;

  return (
    <div className="container mx-auto py-8 px-3 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Notifications Listings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your property listings
          </p>
        </div>
        <NewNotifications />
      </div>

      <NotificationssList page={page} search={search} />
    </div>
  );
}
