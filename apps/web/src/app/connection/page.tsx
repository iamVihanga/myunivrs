// "use client";

// import { useSession } from "@/lib/auth-client"; // Import your auth client
// import Image from "next/image";
// import { useCallback, useEffect, useMemo, useState } from "react";

// // Define the interfaces for your user data
// interface ConnectionData {
//   following: number;
//   followers: number;
// }

// // Interface for the Connection API response
// interface Connection {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   status: "pending" | "accepted" | "rejected" | null; // Null might mean initial state or not applicable
//   createdAt: string | null;
//   updatedAt: string | null;
//   sender?: {
//     id: string;
//     name: string;
//     image: string | null;
//   };
//   receiver?: {
//     id: string;
//     name: string;
//     image: string | null;
//   };
// }

// // Extend User interface to include connection status from our logic
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
//   // Dynamic connection status derived from actual connections
//   connectionStatus:
//     | "not-connected"
//     | "connected"
//     | "pending-sent"
//     | "pending-received";
//   // Store the connection ID if one exists for easy action
//   connectionId?: string;
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

// interface ConnectionApiResponse {
//   data: Connection[];
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
//     tab?: string;
//   };
// }

// // UserCard Component
// interface UserCardProps {
//   user: User;
//   onConnect: (userId: string) => Promise<void>;
//   onAcceptRequest: (connectionId: string, userId: string) => Promise<void>;
//   onDeclineRequest: (connectionId: string, userId: string) => Promise<void>;
//   onCancelRequest: (connectionId: string, userId: string) => Promise<void>;
//   onDisconnect: (connectionId: string, userId: string) => Promise<void>;
// }

// const UserCard: React.FC<UserCardProps> = ({
//   user,
//   onConnect,
//   onAcceptRequest,
//   onDeclineRequest,
//   onCancelRequest,
//   onDisconnect,
// }) => {
//   const isConnected = user.connectionStatus === "connected";
//   const isPendingSent = user.connectionStatus === "pending-sent";
//   const isPendingReceived = user.connectionStatus === "pending-received";
//   const isNotConnected = user.connectionStatus === "not-connected";

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform duration-200 hover:scale-[1.02]">
//       <div className="mb-4">
//         {user.image ? (
//           <Image
//             src={user.image}
//             alt={user.name}
//             width={96}
//             height={96}
//             className="rounded-full object-cover border-4 border-blue-200"
//           />
//         ) : (
//           <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
//             {user.name.charAt(0).toUpperCase()}
//           </div>
//         )}
//       </div>
//       <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
//       <p className="text-sm text-gray-600 mb-3">{user.email}</p>
//       <div className="flex justify-around w-full text-gray-700 text-sm mb-4">
//         <div>
//           <span className="font-bold">{user.connections?.followers ?? 0}</span>{" "}
//           Followers
//         </div>
//         <div>
//           <span className="font-bold">{user.connections?.following ?? 0}</span>{" "}
//           Following
//         </div>
//         <div>
//           <span className="font-bold">{user.posts}</span> Posts
//         </div>
//       </div>

//       <div className="mt-auto w-full">
//         {isNotConnected && (
//           <button
//             onClick={() => onConnect(user.id)}
//             className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//           >
//             Connect
//           </button>
//         )}
//         {isPendingSent && (
//           <button
//             onClick={() =>
//               user.connectionId && onCancelRequest(user.connectionId, user.id)
//             }
//             className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors duration-200"
//           >
//             Request Sent
//           </button>
//         )}
//         {isPendingReceived && (
//           <div className="flex gap-2 w-full">
//             <button
//               onClick={() =>
//                 user.connectionId && onAcceptRequest(user.connectionId, user.id)
//               }
//               className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
//             >
//               Accept
//             </button>
//             <button
//               onClick={() =>
//                 user.connectionId &&
//                 onDeclineRequest(user.connectionId, user.id)
//               }
//               className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
//             >
//               Decline
//             </button>
//           </div>
//         )}
//         {isConnected && (
//           <button
//             onClick={() =>
//               user.connectionId && onDisconnect(user.connectionId, user.id)
//             }
//             className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
//           >
//             Connected
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default function UsersPage({ searchParams }: PageProps) {
//   const { page = "1", search = "", tab = "all" } = searchParams;
//   const [activeTab, setActiveTab] = useState(tab);

//   const [users, setUsers] = useState<User[]>([]);
//   const [userConnections, setUserConnections] = useState<Connection[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Get session from Better Auth
//   const { data: session, isPending: sessionLoading } = useSession();
//   const currentUserId = session?.user?.id;

//   // Effect to update activeTab once searchParams are available
//   useEffect(() => {
//     setActiveTab(tab);
//   }, [tab]);

//   const fetchUsersAndConnections = useCallback(async () => {
//     if (sessionLoading) return; // Wait for session to load

//     if (!session) {
//       setError("You must be logged in to view connections");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // Create headers with session token
//       const headers: HeadersInit = {
//         "Content-Type": "application/json",
//       };

//       // Add authorization header - Better Auth typically uses cookies
//       // but you might need to add a token if your API expects it
//       if (session.token) {
//         headers.Authorization = `Bearer ${session.token}`;
//       }

//       // Fetch all users
//       const usersResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
//         {
//           headers,
//           credentials: "include", // Important: Include cookies for Better Auth
//         }
//       );

//       if (!usersResponse.ok) {
//         throw new Error(
//           `HTTP error! status: ${usersResponse.status} for users`
//         );
//       }
//       const usersResult: ApiResponse = await usersResponse.json();

//       // Fetch all connections
//       const connectionsResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connection`,
//         {
//           headers,
//           credentials: "include", // Important: Include cookies for Better Auth
//         }
//       );

//       if (!connectionsResponse.ok) {
//         throw new Error(
//           `HTTP error! status: ${connectionsResponse.status} for connections`
//         );
//       }
//       const connectionsResult: ConnectionApiResponse =
//         await connectionsResponse.json();

//       setUserConnections(connectionsResult.data);

//       // Map connection statuses to users
//       const usersWithStatus: User[] = usersResult.data.map((user) => {
//         if (user.id === currentUserId) {
//           return { ...user, connectionStatus: "connected" };
//         }

//         const foundConnection = connectionsResult.data.find(
//           (conn) =>
//             (conn.senderId === currentUserId && conn.receiverId === user.id) ||
//             (conn.senderId === user.id && conn.receiverId === currentUserId)
//         );

//         let status: User["connectionStatus"] = "not-connected";
//         let connectionId: string | undefined;

//         if (foundConnection) {
//           connectionId = foundConnection.id;
//           if (foundConnection.status === "accepted") {
//             status = "connected";
//           } else if (
//             foundConnection.status === "pending" &&
//             foundConnection.senderId === currentUserId
//           ) {
//             status = "pending-sent";
//           } else if (
//             foundConnection.status === "pending" &&
//             foundConnection.receiverId === currentUserId
//           ) {
//             status = "pending-received";
//           } else if (foundConnection.status === "rejected") {
//             status = "not-connected";
//           }
//         }
//         return { ...user, connectionStatus: status, connectionId };
//       });

//       setUsers(usersWithStatus);
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("An unknown error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUserId, session, sessionLoading]);

//   useEffect(() => {
//     fetchUsersAndConnections();
//   }, [fetchUsersAndConnections]);

//   // Helper function to make authenticated API calls
//   const makeAuthenticatedRequest = useCallback(
//     async (url: string, options: RequestInit = {}) => {
//       if (!session) {
//         throw new Error("You must be logged in");
//       }

//       const headers: HeadersInit = {
//         "Content-Type": "application/json",
//         ...options.headers,
//       };

//       if (session.token) {
//         headers.Authorization = `Bearer ${session.token}`;
//       }

//       return fetch(url, {
//         ...options,
//         headers,
//         credentials: "include",
//       });
//     },
//     [session]
//   );

//   const handleConnectClick = useCallback(
//     async (receiverId: string) => {
//       if (!session) {
//         alert("You must be logged in to connect with users");
//         return;
//       }

//       const originalUsers = [...users];
//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.id === receiverId
//             ? { ...user, connectionStatus: "pending-sent" }
//             : user
//         )
//       );

//       try {
//         const response = await makeAuthenticatedRequest(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connection`,
//           {
//             method: "POST",
//             body: JSON.stringify({ receiverId }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to send connection request. Status: ${response.status}`
//           );
//         }
//         await fetchUsersAndConnections();
//       } catch (err) {
//         alert(
//           `Error sending connection request: ${err instanceof Error ? err.message : "Unknown error"}`
//         );
//         setUsers(originalUsers);
//       }
//     },
//     [users, fetchUsersAndConnections, session, makeAuthenticatedRequest]
//   );

//   const updateConnectionStatus = useCallback(
//     async (
//       connectionId: string,
//       userId: string,
//       newStatus: "accepted" | "rejected" | "pending" | null
//     ) => {
//       if (!session) {
//         alert("You must be logged in to update connections");
//         return;
//       }

//       const originalUsers = [...users];
//       const originalConnections = [...userConnections];

//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.id === userId
//             ? {
//                 ...user,
//                 connectionStatus:
//                   newStatus === "accepted"
//                     ? "connected"
//                     : newStatus === "rejected"
//                       ? "not-connected"
//                       : "pending-sent",
//               }
//             : user
//         )
//       );

//       try {
//         const response = await makeAuthenticatedRequest(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connection/${connectionId}`,
//           {
//             method: "PUT",
//             body: JSON.stringify({ status: newStatus }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to update connection status. Status: ${response.status}`
//           );
//         }
//         await fetchUsersAndConnections();
//       } catch (err) {
//         alert(
//           `Error updating connection: ${err instanceof Error ? err.message : "Unknown error"}`
//         );
//         setUsers(originalUsers);
//         setUserConnections(originalConnections);
//       }
//     },
//     [
//       users,
//       userConnections,
//       fetchUsersAndConnections,
//       session,
//       makeAuthenticatedRequest,
//     ]
//   );

//   const deleteConnection = useCallback(
//     async (connectionId: string, userId: string) => {
//       if (!session) {
//         alert("You must be logged in to delete connections");
//         return;
//       }

//       const originalUsers = [...users];
//       const originalConnections = [...userConnections];

//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.id === userId
//             ? {
//                 ...user,
//                 connectionStatus: "not-connected",
//                 connectionId: undefined,
//               }
//             : user
//         )
//       );

//       try {
//         const response = await makeAuthenticatedRequest(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connection/${connectionId}`,
//           {
//             method: "DELETE",
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to delete connection. Status: ${response.status}`
//           );
//         }
//         await fetchUsersAndConnections();
//       } catch (err) {
//         alert(
//           `Error deleting connection: ${err instanceof Error ? err.message : "Unknown error"}`
//         );
//         setUsers(originalUsers);
//         setUserConnections(originalConnections);
//       }
//     },
//     [
//       users,
//       userConnections,
//       fetchUsersAndConnections,
//       session,
//       makeAuthenticatedRequest,
//     ]
//   );

//   const handleAcceptRequest = useCallback(
//     (connectionId: string, userId: string) =>
//       updateConnectionStatus(connectionId, userId, "accepted"),
//     [updateConnectionStatus]
//   );

//   const handleDeclineRequest = useCallback(
//     (connectionId: string, userId: string) =>
//       updateConnectionStatus(connectionId, userId, "rejected"),
//     [updateConnectionStatus]
//   );

//   const handleCancelRequest = useCallback(
//     (connectionId: string, userId: string) =>
//       deleteConnection(connectionId, userId),
//     [deleteConnection]
//   );

//   const handleDisconnect = useCallback(
//     (connectionId: string, userId: string) =>
//       deleteConnection(connectionId, userId),
//     [deleteConnection]
//   );

//   // Filter users based on the active tab
//   const filteredUsers = useMemo(() => {
//     const otherUsers = users.filter((user) => user.id !== currentUserId);

//     switch (activeTab) {
//       case "all":
//         return otherUsers;
//       case "connections":
//         return otherUsers.filter(
//           (user) => user.connectionStatus === "connected"
//         );
//       case "requests":
//         return otherUsers.filter(
//           (user) => user.connectionStatus === "pending-received"
//         );
//       case "pending-sent":
//         return otherUsers.filter(
//           (user) => user.connectionStatus === "pending-sent"
//         );
//       default:
//         return otherUsers;
//     }
//   }, [users, activeTab, currentUserId]);

//   // Show loading state while session is loading
//   if (sessionLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
//           <p className="mt-4 text-lg text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show login prompt if not authenticated
//   if (!session) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             Authentication Required
//           </h1>
//           <p className="text-gray-600 mb-6">
//             Please log in to view your connections.
//           </p>
//           <button
//             onClick={() => (window.location.href = "/auth/signin")}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Sign In
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="container mx-auto max-w-7xl bg-white rounded-lg shadow-xl p-6 sm:p-8">
//         {/* Header Section */}
//         <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
//               Connections
//             </h1>
//             <p className="text-lg text-gray-600 mt-2">
//               Discover and manage your connections.
//             </p>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="mb-8 border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8" aria-label="Tabs">
//             <button
//               onClick={() => setActiveTab("all")}
//               className={`${
//                 activeTab === "all"
//                   ? "border-blue-500 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
//             >
//               All Users
//             </button>
//             <button
//               onClick={() => setActiveTab("connections")}
//               className={`${
//                 activeTab === "connections"
//                   ? "border-blue-500 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
//             >
//               My Connections
//             </button>
//             <button
//               onClick={() => setActiveTab("requests")}
//               className={`${
//                 activeTab === "requests"
//                   ? "border-blue-500 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
//             >
//               Connection Requests
//             </button>
//             <button
//               onClick={() => setActiveTab("pending-sent")}
//               className={`${
//                 activeTab === "pending-sent"
//                   ? "border-blue-500 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
//             >
//               Sent Requests
//             </button>
//           </nav>
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
//               Please ensure your backend server is running at{" "}
//               <code className="font-mono text-sm">http://localhost:8000</code>{" "}
//               and the API endpoint is correct.
//             </p>
//           </div>
//         ) : filteredUsers.length === 0 ? (
//           <div className="text-center text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
//             <p className="text-xl font-semibold mb-2">No Users Found</p>
//             <p className="text-md">
//               {activeTab === "all" &&
//                 "It seems there are no users to display at the moment."}
//               {activeTab === "connections" &&
//                 "You haven't made any connections yet."}
//               {activeTab === "requests" && "No pending connection requests."}
//               {activeTab === "pending-sent" && "No pending sent requests."}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredUsers.map((user) => (
//               <UserCard
//                 key={user.id}
//                 user={user}
//                 onConnect={handleConnectClick}
//                 onAcceptRequest={handleAcceptRequest}
//                 onDeclineRequest={handleDeclineRequest}
//                 onCancelRequest={handleCancelRequest}
//                 onDisconnect={handleDisconnect}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

// Define the interfaces for your user data
interface ConnectionData {
  following: number;
  followers: number;
}

// Interface for the Connection API response
interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected" | null;
  createdAt: string | null;
  updatedAt: string | null;
  sender?: {
    id: string;
    name: string;
    image: string | null;
  };
  receiver?: {
    id: string;
    name: string;
    image: string | null;
  };
}

// Extend User interface to include connection status from our logic
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
  connectionStatus:
    | "not-connected"
    | "connected"
    | "pending-sent"
    | "pending-received";
  connectionId?: string;
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

interface ConnectionApiResponse {
  data: Connection[];
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
    tab?: string;
  };
}

// UserCard Component
interface UserCardProps {
  user: User;
  onConnect: (userId: string) => Promise<void>;
  onAcceptRequest: (connectionId: string, userId: string) => Promise<void>;
  onDeclineRequest: (connectionId: string, userId: string) => Promise<void>;
  onCancelRequest: (connectionId: string, userId: string) => Promise<void>;
  onDisconnect: (connectionId: string, userId: string) => Promise<void>;
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
    
    <div className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 transform group">
      {/* Hover ring effect */}
      <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-2 group-hover:ring-blue-400 group-hover:ring-opacity-60 transition-all duration-300"></div>

      <div className="mb-5 relative">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full object-cover border-4 border-blue-400 shadow-md transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 text-5xl font-bold border-4 border-blue-300 shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">
        {user.name}
      </h3>
      <p className="text-sm text-gray-500 mb-4 font-medium">{user.email}</p>

      <div className="flex justify-around w-full text-gray-700 text-sm mb-6 border-t border-b border-gray-100 py-3">
        <div className="flex flex-col items-center">
          <span className="font-extrabold text-lg text-blue-600">
            {user.connections?.followers ?? 0}
          </span>
          <span className="text-xs text-gray-500">Followers</span>
        </div>
        <div className="w-px bg-gray-200 mx-2"></div>
        <div className="flex flex-col items-center">
          <span className="font-extrabold text-lg text-blue-600">
            {user.connections?.following ?? 0}
          </span>
          <span className="text-xs text-gray-500">Following</span>
        </div>
        <div className="w-px bg-gray-200 mx-2"></div>
        <div className="flex flex-col items-center">
          <span className="font-extrabold text-lg text-blue-600">
            {user.posts}
          </span>
          <span className="text-xs text-gray-500">Posts</span>
        </div>
      </div>

      <div className="mt-auto w-full px-2">
        {isNotConnected && (
          <button
            onClick={() => onConnect(user.id)}
            className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 ease-in-out font-semibold text-base"
          >
            Connect
          </button>
        )}
        {isPendingSent && (
          <button
            onClick={() =>
              user.connectionId && onCancelRequest(user.connectionId, user.id)
            }
            className="w-full px-5 py-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-offset-2 transition-all duration-200 ease-in-out font-semibold text-base"
          >
            Request Sent
          </button>
        )}
        {isPendingReceived && (
          <div className="flex gap-3 w-full">
            <button
              onClick={() =>
                user.connectionId && onAcceptRequest(user.connectionId, user.id)
              }
              className="flex-1 px-5 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 transition-all duration-200 ease-in-out font-semibold text-base"
            >
              Accept
            </button>
            <button
              onClick={() =>
                user.connectionId &&
                onDeclineRequest(user.connectionId, user.id)
              }
              className="flex-1 px-5 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-2 transition-all duration-200 ease-in-out font-semibold text-base"
            >
              Decline
            </button>
          </div>
        )}
        {isConnected && (
          <button
            onClick={() =>
              user.connectionId && onDisconnect(user.connectionId, user.id)
            }
            className="w-full px-5 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 ease-in-out font-semibold text-base"
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
  const [userConnections, setUserConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get session from Better Auth
  const { data: session, isPending: sessionLoading } = useSession();
  const currentUserId = session?.user?.id;

  // Effect to update activeTab once searchParams are available
  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const fetchUsersAndConnections = useCallback(async () => {
    if (sessionLoading) return;

    if (!session) {
      setError("You must be logged in to view connections");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (session.token) {
        headers.Authorization = `Bearer ${session.token}`;
      }

      // Fetch all users
      const usersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
        {
          headers,
          credentials: "include",
        }
      );

      if (!usersResponse.ok) {
        throw new Error(
          `HTTP error! status: ${usersResponse.status} for users`
        );
      }
      const usersResult: ApiResponse = await usersResponse.json();

      // Fetch all connections
      const connectionsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connection`,
        {
          headers,
          credentials: "include",
        }
      );

      if (!connectionsResponse.ok) {
        throw new Error(
          `HTTP error! status: ${connectionsResponse.status} for connections`
        );
      }
      const connectionsResult: ConnectionApiResponse =
        await connectionsResponse.json();

      setUserConnections(connectionsResult.data);

      // Map connection statuses to users
      const usersWithStatus: User[] = usersResult.data.map((user) => {
        if (user.id === currentUserId) {
          return { ...user, connectionStatus: "connected" as const };
        }

        const foundConnection = connectionsResult.data.find(
          (conn) =>
            (conn.senderId === currentUserId && conn.receiverId === user.id) ||
            (conn.senderId === user.id && conn.receiverId === currentUserId)
        );

        let status: User["connectionStatus"] = "not-connected";
        let connectionId: string | undefined;

        if (foundConnection) {
          connectionId = foundConnection.id;
          if (foundConnection.status === "accepted") {
            status = "connected";
          } else if (
            foundConnection.status === "pending" &&
            foundConnection.senderId === currentUserId
          ) {
            status = "pending-sent";
          } else if (
            foundConnection.status === "pending" &&
            foundConnection.receiverId === currentUserId
          ) {
            status = "pending-received";
          } else if (foundConnection.status === "rejected") {
            status = "not-connected";
          }
        }
        return { ...user, connectionStatus: status, connectionId };
      });

      setUsers(usersWithStatus);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [currentUserId, session, sessionLoading]);

  useEffect(() => {
    fetchUsersAndConnections();
  }, [fetchUsersAndConnections]);

  // Enhanced helper function to make authenticated API calls
  const makeAuthenticatedRequest = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!session) {
        throw new Error("You must be logged in");
      }

      console.log("Making request with session:", {
        userId: session.user?.id,
        hasToken: !!session.token,
        url,
        method: options.method || "GET",
      });

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (session.token) {
        headers.Authorization = `Bearer ${session.token}`;
      }

      const requestOptions = {
        ...options,
        headers,
        credentials: "include" as RequestCredentials,
      };

      console.log("Request options:", {
        url,
        method: requestOptions.method,
        headers: requestOptions.headers,
        body: requestOptions.body,
      });

      return fetch(url, requestOptions);
    },
    [session]
  );

  const handleConnectClick = useCallback(
    async (receiverId: string) => {
      if (!session) {
        alert("You must be logged in to connect with users");
        return;
      }

      console.log("Attempting to connect to user:", receiverId);
      console.log("Current user ID:", session.user?.id);

      // Optimistic update
      const originalUsers = [...users];
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === receiverId
            ? { ...user, connectionStatus: "pending-sent" }
            : user
        )
      );

      try {
        const requestBody = { receiverId };
        console.log("Sending connection request with body:", requestBody);

        const response = await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connection`,
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        console.log("Connection response status:", response.status);
        console.log("Connection response headers:", response.headers);

        if (!response.ok) {
          // Get the actual error response
          let errorData;
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error("Failed to parse error response as JSON:", jsonError);
            errorData = { message: "Unknown error occurred" };
          }

          console.error("Connection request failed:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });

          throw new Error(
            `Failed to send connection request. Status: ${response.status}${
              errorData?.message ? ` - ${errorData.message}` : ""
            }`
          );
        }

        const responseData = await response.json();
        console.log("Connection created successfully:", responseData);

        // Refresh the connections
        await fetchUsersAndConnections();
      } catch (err) {
        console.error("Full connection error:", err);

        // Revert optimistic update
        setUsers(originalUsers);

        // Show user-friendly error message
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        alert(`Error sending connection request: ${errorMessage}`);
      }
    },
    [users, fetchUsersAndConnections, session, makeAuthenticatedRequest]
  );

  const updateConnectionStatus = useCallback(
    async (
      connectionId: string,
      userId: string,
      newStatus: "accepted" | "rejected" | "pending" | null
    ) => {
      if (!session) {
        alert("You must be logged in to update connections");
        return;
      }

      console.log("Updating connection:", { connectionId, userId, newStatus });

      const originalUsers = [...users];
      const originalConnections = [...userConnections];

      // Optimistic update
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                connectionStatus:
                  newStatus === "accepted"
                    ? "connected"
                    : newStatus === "rejected"
                      ? "not-connected"
                      : "pending-sent",
              }
            : user
        )
      );

      try {
        const response = await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connection/${connectionId}`,
          {
            method: "PUT",
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("Update connection failed:", {
            status: response.status,
            error: errorData,
          });

          throw new Error(
            `Failed to update connection status. Status: ${response.status}${
              errorData?.message ? ` - ${errorData.message}` : ""
            }`
          );
        }

        await fetchUsersAndConnections();
      } catch (err) {
        console.error("Update connection error:", err);

        // Revert optimistic updates
        setUsers(originalUsers);
        setUserConnections(originalConnections);

        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        alert(`Error updating connection: ${errorMessage}`);
      }
    },
    [
      users,
      userConnections,
      fetchUsersAndConnections,
      session,
      makeAuthenticatedRequest,
    ]
  );

  const deleteConnection = useCallback(
    async (connectionId: string, userId: string) => {
      if (!session) {
        alert("You must be logged in to delete connections");
        return;
      }

      console.log("Deleting connection:", { connectionId, userId });

      const originalUsers = [...users];
      const originalConnections = [...userConnections];

      // Optimistic update
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                connectionStatus: "not-connected",
                connectionId: undefined,
              }
            : user
        )
      );

      try {
        const response = await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/connection/${connectionId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("Delete connection failed:", {
            status: response.status,
            error: errorData,
          });

          throw new Error(
            `Failed to delete connection. Status: ${response.status}${
              errorData?.message ? ` - ${errorData.message}` : ""
            }`
          );
        }

        await fetchUsersAndConnections();
      } catch (err) {
        console.error("Delete connection error:", err);

        // Revert optimistic updates
        setUsers(originalUsers);
        setUserConnections(originalConnections);

        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        alert(`Error deleting connection: ${errorMessage}`);
      }
    },
    [
      users,
      userConnections,
      fetchUsersAndConnections,
      session,
      makeAuthenticatedRequest,
    ]
  );

  const handleAcceptRequest = useCallback(
    (connectionId: string, userId: string) =>
      updateConnectionStatus(connectionId, userId, "accepted"),
    [updateConnectionStatus]
  );

  const handleDeclineRequest = useCallback(
    (connectionId: string, userId: string) =>
      updateConnectionStatus(connectionId, userId, "rejected"),
    [updateConnectionStatus]
  );

  const handleCancelRequest = useCallback(
    (connectionId: string, userId: string) =>
      deleteConnection(connectionId, userId),
    [deleteConnection]
  );

  const handleDisconnect = useCallback(
    (connectionId: string, userId: string) =>
      deleteConnection(connectionId, userId),
    [deleteConnection]
  );

  // Filter users based on the active tab
  const filteredUsers = useMemo(() => {
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
      case "pending-sent":
        return otherUsers.filter(
          (user) => user.connectionStatus === "pending-sent"
        );
      default:
        return otherUsers;
    }
  }, [users, activeTab, currentUserId]);

  // Show loading state while session is loading
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-xl p-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-xl p-8 max-w-md mx-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to view and manage your connections.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/signin")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl bg-white rounded-xl shadow-xl p-6 sm:p-8">
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

          {/* Connection Stats */}
          <div className="flex gap-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-bold text-blue-600 text-lg">
                {
                  filteredUsers.filter(
                    (u) => u.connectionStatus === "connected"
                  ).length
                }
              </div>
              <div>Connected</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-yellow-600 text-lg">
                {
                  filteredUsers.filter(
                    (u) => u.connectionStatus === "pending-sent"
                  ).length
                }
              </div>
              <div>Pending</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600 text-lg">
                {
                  filteredUsers.filter(
                    (u) => u.connectionStatus === "pending-received"
                  ).length
                }
              </div>
              <div>Requests</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              {
                key: "all",
                label: "All Users",
                count: filteredUsers.length,
              },
              {
                key: "connections",
                label: "My Connections",
                count: users.filter(
                  (u) =>
                    u.connectionStatus === "connected" && u.id !== currentUserId
                ).length,
              },
              {
                key: "requests",
                label: "Connection Requests",
                count: users.filter(
                  (u) => u.connectionStatus === "pending-received"
                ).length,
              },
              {
                key: "pending-sent",
                label: "Sent Requests",
                count: users.filter(
                  (u) => u.connectionStatus === "pending-sent"
                ).length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2`}
              >
                {tab.label}
                <span
                  className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.key === "all" ? filteredUsers.length : tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Loading, Error, No Users States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg
              className="animate-spin h-12 w-12 text-blue-500 mb-4"
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
            <p className="text-lg font-medium">Fetching user data...</p>
          </div>
        ) : error ? (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-8 text-center shadow-sm">
            <div className="mb-4">
              <svg
                className="w-12 h-12 text-red-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-bold text-xl mb-2">Error Loading Users</p>
              <p className="text-lg mb-4">{error}</p>
            </div>
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Troubleshooting steps:</p>
              <ul className="text-left list-disc list-inside space-y-1">
                <li>
                  Ensure your backend server is running at{" "}
                  <code className="font-mono bg-red-200 px-1 rounded">
                    http://localhost:8000
                  </code>
                </li>
                <li>Check if the API endpoints are accessible</li>
                <li>Verify your authentication token is valid</li>
                <li>Check browser console for detailed error messages</li>
              </ul>
            </div>
            <button
              onClick={fetchUsersAndConnections}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-8 shadow-sm">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-blue-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-2xl font-semibold mb-2">No Users Found</p>
              <p className="text-lg">
                {activeTab === "all" &&
                  "It seems there are no users to display at the moment."}
                {activeTab === "connections" &&
                  "You haven't made any connections yet. Start by exploring all users!"}
                {activeTab === "requests" &&
                  "No pending connection requests at the moment."}
                {activeTab === "pending-sent" &&
                  "You haven't sent any connection requests yet."}
              </p>
            </div>
            {activeTab !== "all" && (
              <button
                onClick={() => setActiveTab("all")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Explore All Users
              </button>
            )}
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
