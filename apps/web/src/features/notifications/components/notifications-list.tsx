// import { Card, CardContent } from "@repo/ui/components/card";
// import { getAllNotifications } from "../actions/getAll.action";
// import { NotificationsCard } from "./notifications-card";
// import { NotificationsPagination } from "./notifications-pagination";
// import { SearchBar } from "./search-bar";

// interface NotificationssListProps {
//   page?: string;
//   limit?: string;
//   search?: string;
// }

// export async function NotificationssList({
//   page = "1",
//   limit = "8",
//   search = "",
// }: NotificationssListProps) {
//   // Get notifications data with pagination
//   const response = await getAllNotifications({ page, limit, search });

//   // Convert string dates to Date objects
//   const notificationss = response.data.map((notifications: any) => ({
//     ...notifications,
//     createdAt: new Date(notifications.createdAt),
//     updatedAt: notifications.updatedAt
//       ? new Date(notifications.updatedAt)
//       : null,
//   }));

//   // Get pagination metadata
//   const { currentPage, totalPages, totalCount } = response.meta;

//   return (
//     <div className="space-y-6">
//       {/* Search and Filter Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <SearchBar />
//         <div className="text-sm text-muted-foreground">
//           {totalCount} {totalCount === 1 ? "listing" : "listings"} found
//         </div>
//       </div>

//       {/* Notifications List */}
//       {notificationss.length === 0 ? (
//         <Card className="bg-cyan-50 border-none">
//           <CardContent className="flex flex-col items-center justify-center py-12 text-center">
//             <div className="rounded-full bg-cyan-100 p-3 mb-4">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="text-cyan-600"
//               >
//                 <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//                 <polyline points="9 22 9 12 15 12 15 22" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-1">
//               No listings found
//             </h3>
//             <p className="text-muted-foreground max-w-sm">
//               {search
//                 ? `No results found for "${search}". Try a different search term.`
//                 : "Create a new listing to get started."}
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-4">
//           {notificationss.map((notifications: any) => (
//             <NotificationsCard
//               key={notifications.id}
//               notifications={notifications}
//             />
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <NotificationsPagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//       />
//     </div>
//   );
// }

import { Card, CardContent } from "@repo/ui/components/card";
import { getAllNotifications } from "../actions/getAll.action";
import { NotificationsCard } from "./notifications-card";
import { NotificationsPagination } from "./notifications-pagination";
import { SearchBar } from "./search-bar";

interface NotificationsListProps {
  page?: string;
  limit?: string;
  search?: string;
}

export async function NotificationssList({
  page = "1",
  limit = "8",
  search = "",
}: NotificationsListProps) {
  const response = await getAllNotifications({ page, limit, search });

  const notifications = response.data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
  }));

  const { currentPage, totalPages, totalCount } = response.meta;

  return (
    <div className="space-y-6">
      {/* Search Bar & Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar />
        <div className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "notification" : "notifications"}{" "}
          found
        </div>
      </div>

      {/* Notifications List or Empty State */}
      {notifications.length === 0 ? (
        <Card className="bg-cyan-50 border-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-cyan-100 p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyan-600"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No notifications found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {search
                ? `No results for "${search}". Try a different keyword.`
                : "There are no notifications yet. Create one to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification: any) => (
            <NotificationsCard
              key={notification.id}
              notification={notification} // <-- renamed prop
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <NotificationsPagination
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
