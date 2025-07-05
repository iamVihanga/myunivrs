
// "use client";
// import { Card, CardContent } from "@repo/ui/components/card";
// import { getAllProduct } from "../actions/getAll.action";
// import { Product } from "../schemas";
// import { ProductsCard } from "./products-card";
// import { ProductsPagination } from "./products-pagination";
// import { SearchBar } from "./search-bar";

// interface ProductsListProps {
//   page?: string;
//   limit?: string;
//   search?: string;
// }

// export async function ProductsList({
//   page = "1",
//   limit = "8",
//   search = "",
// }: ProductsListProps) {
//   // Get products data with pagination
//   const response = await getAllProduct({ page, limit, search });

//   // Check if response, response.data, and response.meta are valid
//   if (
//     !response ||
//     !Array.isArray(response.data) ||
//     !response.meta ||
//     typeof response.meta.currentPage !== "number" ||
//     typeof response.meta.totalPages !== "number" ||
//     typeof response.meta.totalCount !== "number"
//   ) {
//     console.error("Invalid response from getAllProduct:", response);
//     return (
//       <Card className="bg-cyan-50 border-none">
//         <CardContent className="flex flex-col items-center justify-center py-12 text-center">
//           <div className="rounded-full bg-cyan-100 p-3 mb-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="text-cyan-600"
//             >
//               <path d="M12 9v3m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-1">
//             Error loading listings
//           </h3>
//           <p className="text-muted-foreground max-w-sm">
//             Unable to load product listings. Please try again later.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Convert string dates to Date objects
//   const products = response.data.map((product: Product) => ({
//     ...product,
//     createdAt: new Date(product.createdAt),
//     updatedAt: product.updatedAt ? new Date(product.updatedAt) : null,
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

//       {/* Products List */}
//       {products.length === 0 ? (
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
//           {products.map((product: Product) => (
//             <ProductsCard key={product.id} products={product} />
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <ProductsPagination currentPage={currentPage} totalPages={totalPages} />
//     </div>
//   );
// }

import { Card, CardContent } from "@repo/ui/components/card";
import { getAllProducts } from "../actions/getAll.action";
import { ProductsCard } from "./products-card";
import { ProductsPagination } from "./products-pagination";
import { SearchBar } from "./search-bar";

interface ProductssListProps {

  page?: string;
  limit?: string;
  search?: string;
}


export async function ProductssList({
  page = "1",
  limit = "8",
  search = "",
}: ProductssListProps) {
  // Get products data with pagination
  const response = await getAllProducts({ page, limit, search });

  // Convert string dates to Date objects
  const productss = response.data.map((products: any) => ({
    ...products,
    createdAt: new Date(products.createdAt),
    updatedAt: products.updatedAt ? new Date(products.updatedAt) : null,

  }));

  // Get pagination metadata
  const { currentPage, totalPages, totalCount } = response.meta;

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar />
        <div className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "listing" : "listings"} found
        </div>
      </div>


      {/* Products List */}
      {productss.length === 0 ? (

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
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No listings found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {search
                ? `No results found for "${search}". Try a different search term.`
                : "Create a new listing to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">

          {productss.map((products: any) => (
            <ProductsCard key={products.id} products={products} />

          ))}
        </div>
      )}

      {/* Pagination */}
      <ProductsPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
