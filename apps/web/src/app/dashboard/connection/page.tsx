// // src/app/dashboard/connection/page.tsx

// "use client"; // Still crucial for using useEffect and useState

// import { useEffect, useState } from "react";

// // Define the interfaces for your user data
// interface ConnectionData {
//   following: number;
//   followers: number;
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: boolean;
//   image: string | null;
//   createdAt: string;
//   updatedAt: string;
//   role: string | null;
//   banned: boolean | null;
//   banReason: string | null;
//   banExpires: string | null;
//   connections: ConnectionData;
//   posts: number;
//   lastActive: string;
// }

// interface ApiResponse {
//   data: User[];
//   meta: {
//     currentPage: number;
//     totalPages: number;
//     totalCount: number;
//     limit: number;
//   };
// }

// interface PageProps {
//   searchParams: {
//     page?: string;
//     search?: string;
//   };
// }

// export default function UsersPage({ searchParams }: PageProps) {
//   const { page = "1", search = "" } = searchParams;

//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const url = "http://localhost:8000/api/user";
//         const response = await fetch(url);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result: ApiResponse = await response.json();
//         setUsers(result.data);
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("An unknown error occurred");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [page, search]);

//   // Handle "Connect" button click
//   const handleConnectClick = (userId: string, userName: string) => {
//     // In a real application, you would send an API request here
//     // e.g., fetch(`/api/user/${userId}/connect`, { method: 'POST' })
//     alert(`Connecting to user: ${userName} (ID: ${userId})`);
//     // You might want to update the UI after a successful connection (e.g., change button text)
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="container mx-auto max-w-7xl bg-white rounded-lg shadow-xl p-6 sm:p-8">
//         {/* Header Section */}
//         <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
//               Platform Users
//             </h1>
//             <p className="text-lg text-gray-600 mt-2">
//               Discover and connect with users on the platform.
//             </p>
//           </div>
//           {/* You can add a button for "Add New User" here if applicable */}
//           {/* <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out">
//             Add New User
//           </button> */}
//         </div>

//         {/* Loading, Error, No Users States */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20 text-gray-500">
//             <svg
//               className="animate-spin h-8 w-8 text-blue-500 mb-4"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//             <p className="text-lg">Fetching user data...</p>
//           </div>
//         ) : error ? (
//           <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-sm">
//             <p className="font-bold text-xl mb-2">Error Loading Users</p>
//             <p className="text-lg">{error}</p>
//             <p className="mt-3 text-gray-600">
//               Please ensure your backend server is running at
//               `http://localhost:8000` and the API endpoint is correct.
//             </p>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="text-center text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
//             <p className="text-xl font-semibold mb-2">No Users Found</p>
//             <p className="text-md">
//               It seems there are no users to display at the moment.
//             </p>
//           </div>
//         ) : (
//           // Users Table
//           <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                   >
//                     Name
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                   >
//                     Email
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                   >
//                     Followers
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                   >
//                     Following
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                   >
//                     Posts
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                   >
//                     Last Active
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                   >
//                     Actions
//                   </th>{" "}
//                   {/* New Column */}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {users.map((user) => (
//                   <tr
//                     key={user.id}
//                     className="hover:bg-gray-50 transition duration-150 ease-in-out"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {user.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                       {user.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {user.connections?.followers ?? 0}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {user.connections?.following ?? 0}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {user.posts}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {new Date(user.lastActive).toLocaleString("en-LK", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: false,
//                       })}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         onClick={() => handleConnectClick(user.id, user.name)}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                       >
//                         Connect
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/app/dashboard/connection/page.tsx

"use client";

import Image from "next/image"; // Assuming you'll use Next.js Image component for user avatars
import { useCallback, useEffect, useMemo, useState } from "react";

// Define the interfaces for your user data
interface ConnectionData {
  following: number;
  followers: number;
}

// Extend User interface to include a simulated connection status for demonstration
interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  connections: ConnectionData;
  posts: number;
  lastActive: string;
  // Simulated connection status: 'not-connected', 'connected', 'pending-sent', 'pending-received'
  connectionStatus?:
    | "not-connected"
    | "connected"
    | "pending-sent"
    | "pending-received";
}

interface ApiResponse {
  data: User[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    tab?: string; // New: to handle different tabs like "all", "connections", "requests"
  };
}

// UserCard Component
interface UserCardProps {
  user: User;
  onConnect: (userId: string, userName: string) => void;
  onAcceptRequest: (userId: string, userName: string) => void;
  onDeclineRequest: (userId: string, userName: string) => void;
  onCancelRequest: (userId: string, userName: string) => void;
  onDisconnect: (userId: string, userName: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onConnect,
  onAcceptRequest,
  onDeclineRequest,
  onCancelRequest,
  onDisconnect,
}) => {
  const isConnected = user.connectionStatus === "connected";
  const isPendingSent = user.connectionStatus === "pending-sent";
  const isPendingReceived = user.connectionStatus === "pending-received";
  const isNotConnected = user.connectionStatus === "not-connected";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform duration-200 hover:scale-[1.02]">
      <div className="mb-4">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={96}
            height={96}
            className="rounded-full object-cover border-4 border-blue-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{user.email}</p>
      <div className="flex justify-around w-full text-gray-700 text-sm mb-4">
        <div>
          <span className="font-bold">{user.connections?.followers ?? 0}</span>{" "}
          Followers
        </div>
        <div>
          <span className="font-bold">{user.connections?.following ?? 0}</span>{" "}
          Following
        </div>
        <div>
          <span className="font-bold">{user.posts}</span> Posts
        </div>
      </div>

      <div className="mt-auto w-full">
        {isNotConnected && (
          <button
            onClick={() => onConnect(user.id, user.name)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Connect
          </button>
        )}
        {isPendingSent && (
          <button
            onClick={() => onCancelRequest(user.id, user.name)}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors duration-200"
          >
            Request Sent
          </button>
        )}
        {isPendingReceived && (
          <div className="flex gap-2 w-full">
            <button
              onClick={() => onAcceptRequest(user.id, user.name)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Accept
            </button>
            <button
              onClick={() => onDeclineRequest(user.id, user.name)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Decline
            </button>
          </div>
        )}
        {isConnected && (
          <button
            onClick={() => onDisconnect(user.id, user.name)}
            className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Connected
          </button>
        )}
      </div>
    </div>
  );
};

export default function UsersPage({ searchParams }: PageProps) {
  const { page = "1", search = "", tab = "all" } = searchParams;
  const [activeTab, setActiveTab] = useState(tab);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate current user ID for connection status logic
  const currentUserId = "user123"; // In a real app, get this from auth context

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = "http://localhost:8000/api/user";
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ApiResponse = await response.json();

        // Simulate connection statuses based on a dummy current user
        const simulatedUsers = result.data.map((user) => {
          if (user.id === currentUserId) {
            return { ...user, connectionStatus: "connected" }; // Current user is always "connected" to themselves (or simply not shown)
          }
          // For demonstration, let's assign random statuses
          const statuses = [
            "not-connected",
            "connected",
            "pending-sent",
            "pending-received",
          ] as const;
          const randomStatus =
            statuses[Math.floor(Math.random() * statuses.length)];
          return { ...user, connectionStatus: randomStatus };
        });

        setUsers(simulatedUsers);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, search]); // Removed `tab` from dependencies as fetching all users once is fine for simulation

  // Filter users based on the active tab
  const filteredUsers = useMemo(() => {
    // Exclude the current user from the list
    const otherUsers = users.filter((user) => user.id !== currentUserId);

    switch (activeTab) {
      case "all":
        return otherUsers;
      case "connections":
        return otherUsers.filter(
          (user) => user.connectionStatus === "connected"
        );
      case "requests":
        return otherUsers.filter(
          (user) => user.connectionStatus === "pending-received"
        );
      case "pending-sent": // New tab for sent requests
        return otherUsers.filter(
          (user) => user.connectionStatus === "pending-sent"
        );
      default:
        return otherUsers;
    }
  }, [users, activeTab]);

  // Handler functions for connection actions (simulated)
  const handleConnectClick = useCallback((userId: string, userName: string) => {
    alert(`Simulating connection request to: ${userName} (ID: ${userId})`);
    // In a real app: Send API request, then update state or refetch
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, connectionStatus: "pending-sent" }
          : user
      )
    );
  }, []);

  const handleAcceptRequest = useCallback(
    (userId: string, userName: string) => {
      alert(`Simulating accepting request from: ${userName} (ID: ${userId})`);
      // In a real app: Send API request, then update state or refetch
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, connectionStatus: "connected" } : user
        )
      );
    },
    []
  );

  const handleDeclineRequest = useCallback(
    (userId: string, userName: string) => {
      alert(`Simulating declining request from: ${userName} (ID: ${userId})`);
      // In a real app: Send API request, then update state or refetch
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, connectionStatus: "not-connected" }
            : user
        )
      );
    },
    []
  );

  const handleCancelRequest = useCallback(
    (userId: string, userName: string) => {
      alert(`Simulating canceling request to: ${userName} (ID: ${userId})`);
      // In a real app: Send API request, then update state or refetch
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, connectionStatus: "not-connected" }
            : user
        )
      );
    },
    []
  );

  const handleDisconnect = useCallback((userId: string, userName: string) => {
    alert(`Simulating disconnecting from: ${userName} (ID: ${userId})`);
    // In a real app: Send API request, then update state or refetch
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, connectionStatus: "not-connected" }
          : user
      )
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl bg-white rounded-lg shadow-xl p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Connections
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Discover and manage your connections.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("all")}
              className={`${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab("connections")}
              className={`${
                activeTab === "connections"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              My Connections
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`${
                activeTab === "requests"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Connection Requests
            </button>
            <button
              onClick={() => setActiveTab("pending-sent")}
              className={`${
                activeTab === "pending-sent"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Sent Requests
            </button>
          </nav>
        </div>

        {/* Loading, Error, No Users States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-lg">Fetching user data...</p>
          </div>
        ) : error ? (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-sm">
            <p className="font-bold text-xl mb-2">Error Loading Users</p>
            <p className="text-lg">{error}</p>
            <p className="mt-3 text-gray-600">
              Please ensure your backend server is running at{" "}
              <code className="font-mono text-sm">http://localhost:8000</code>{" "}
              and the API endpoint is correct.
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
            <p className="text-xl font-semibold mb-2">No Users Found</p>
            <p className="text-md">
              {activeTab === "all" &&
                "It seems there are no users to display at the moment."}
              {activeTab === "connections" &&
                "You haven't made any connections yet."}
              {activeTab === "requests" && "No pending connection requests."}
              {activeTab === "pending-sent" && "No pending sent requests."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onConnect={handleConnectClick}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
                onCancelRequest={handleCancelRequest}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
