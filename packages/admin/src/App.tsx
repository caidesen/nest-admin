import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useFilteredRoutes } from "@/route";
import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const routes = useFilteredRoutes([]);
  const router = useMemo(() => createBrowserRouter(routes), [routes]);
  const client = new QueryClient()
  return <QueryClientProvider client={client}>
    <RouterProvider router={router} />
  </QueryClientProvider>;
}
