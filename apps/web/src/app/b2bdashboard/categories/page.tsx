"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Briefcase, Calendar, Home, Package, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Types for each category
interface Housing {
  id?: string;
  title: string;
  description?: string;
  images?: string[];
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  contactNumber?: string;
  housingType?: string;
  squareFootage?: number;
  yearBuilt?: number;
  isFurnished: boolean;
  link?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Job {
  id?: string;
  title: string;
  description?: string;
  images?: string[];
  isFeatured?: boolean;
  company: string;
  status: string;
  requiredSkills: string[];
  salaryRange: {
    min?: number;
    max?: number;
    currency?: string;
  };
  actionUrl: string;
  jobType: "full_time" | "part_time" | "contract" | "freelance";
  cvRequired: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Product {
  id?: string;
  title: string;
  description?: string;
  images?: string[];
  price: string;
  discountPercentage?: number;
  location: string;
  condition: "new" | "used" | "refurbished";
  stockQuantity: string;
  isNegotiable: boolean;
  categoryId?: string;
  brand?: string;
  link?: string;
  shipping?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Event {
  id?: string;
  title: string;
  description?: string;
  images?: string[];
  location: string;
  isFeatured?: boolean;
  eventDate: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  data: T[];
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
    category?: string;
  };
}

export default function CategoriesPage({ searchParams }: PageProps) {
  const { page = "1", search = "", category = "all" } = searchParams;

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search);
  const [activeCategory, setActiveCategory] = useState(category);

  // State for each category data
  const [housing, setHousing] = useState<Housing[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch data for all categories
  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const [housingRes, jobsRes, productsRes, eventsRes] = await Promise.all([
        fetch(
          `http://localhost:8000/api/housing?page=${page}&search=${searchTerm}`
        ),
        fetch(
          `http://localhost:8000/api/jobs?page=${page}&search=${searchTerm}`
        ),
        fetch(
          `http://localhost:8000/api/products?page=${page}&search=${searchTerm}`
        ),
        fetch(
          `http://localhost:8000/api/events?page=${page}&search=${searchTerm}`
        ),
      ]);

      const housingData: ApiResponse<Housing> = await housingRes.json();
      const jobsData: ApiResponse<Job> = await jobsRes.json();
      const productsData: ApiResponse<Product> = await productsRes.json();
      const eventsData: ApiResponse<Event> = await eventsRes.json();

      setHousing(housingData.data);
      setJobs(jobsData.data);
      setProducts(productsData.data);
      setEvents(eventsData.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [page, searchTerm]);

  // Get total count for each category
  const getCategoryCounts = () => ({
    all: housing.length + jobs.length + products.length + events.length,
    housing: housing.length,
    jobs: jobs.length,
    products: products.length,
    events: events.length,
  });

  const counts = getCategoryCounts();

  // Filter data based on active category
  const getFilteredData = () => {
    switch (activeCategory) {
      case "housing":
        return housing.map((item) => ({
          ...item,
          category: "housing",
          icon: Home,
        }));
      case "jobs":
        return jobs.map((item) => ({
          ...item,
          category: "jobs",
          icon: Briefcase,
        }));
      case "products":
        return products.map((item) => ({
          ...item,
          category: "products",
          icon: Package,
        }));
      case "events":
        return events.map((item) => ({
          ...item,
          category: "events",
          icon: Calendar,
        }));
      default:
        return [
          ...housing.map((item) => ({
            ...item,
            category: "housing",
            icon: Home,
          })),
          ...jobs.map((item) => ({
            ...item,
            category: "jobs",
            icon: Briefcase,
          })),
          ...products.map((item) => ({
            ...item,
            category: "products",
            icon: Package,
          })),
          ...events.map((item) => ({
            ...item,
            category: "events",
            icon: Calendar,
          })),
        ];
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="container mx-auto py-8 px-3 max-w-7xl">
      <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">All Categories</h1>
          <p className="text-muted-foreground mt-1">
            Browse through all available listings and products
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search all categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={fetchCategoryData}
            variant="outline"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="housing" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Housing ({counts.housing})
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Jobs ({counts.jobs})
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products ({counts.products})
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events ({counts.events})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item: any) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <Badge variant="secondary" className="capitalize">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.isFeatured && (
                            <Badge variant="destructive">Featured</Badge>
                          )}
                          <Badge
                            variant={
                              item.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {item.title || item.name}
                      </CardTitle>
                      {item.description && (
                        <CardDescription className="line-clamp-3">
                          {item.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {/* Price Information */}
                        {item.price && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Price:
                            </span>
                            <span className="font-semibold text-green-600">
                              ${item.price}
                            </span>
                          </div>
                        )}

                        {/* Location Information */}
                        {(item.address || item.city || item.location) && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Location:
                            </span>
                            <span className="font-medium">
                              {item.address || item.city || item.location}
                            </span>
                          </div>
                        )}

                        {/* Category-specific information */}
                        {item.category === "housing" && (
                          <>
                            {item.bedrooms && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Bedrooms:
                                </span>
                                <span>{item.bedrooms}</span>
                              </div>
                            )}
                            {item.bathrooms && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Bathrooms:
                                </span>
                                <span>{item.bathrooms}</span>
                              </div>
                            )}
                          </>
                        )}

                        {item.category === "jobs" && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Company:
                              </span>
                              <span className="font-medium">
                                {item.company}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Type:
                              </span>
                              <Badge variant="outline">
                                {item.jobType?.replace("_", " ")}
                              </Badge>
                            </div>
                          </>
                        )}

                        {item.category === "products" && (
                          <>
                            {item.brand && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Brand:
                                </span>
                                <span className="font-medium">
                                  {item.brand}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Condition:
                              </span>
                              <span className="capitalize">
                                {item.condition}
                              </span>
                            </div>
                          </>
                        )}

                        {item.category === "events" && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Event Location:
                              </span>
                              <span className="font-medium">
                                {item.location}
                              </span>
                            </div>
                            {item.eventDate && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Date:
                                </span>
                                <Badge variant="outline">
                                  {new Date(item.eventDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </Badge>
                              </div>
                            )}
                          </>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-muted-foreground">
                            Created:
                          </span>
                          <span className="text-xs">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
