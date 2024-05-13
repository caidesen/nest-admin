import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useFilteredRoutes } from "@/route";
import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function RouterWraper() {
  const routes = useFilteredRoutes();
  const router = useMemo(() => createBrowserRouter(routes), [routes]);
  return <RouterProvider router={router} />;
}
export default function App() {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <RouterWraper></RouterWraper>
    </QueryClientProvider>
  );
}
