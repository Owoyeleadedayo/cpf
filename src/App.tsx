import { RouterProvider, createBrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { SupabaseAuthProvider } from "./context/SupabaseAuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminPostForm from "./pages/admin/AdminPostForm";
import AdminPostsList from "./pages/admin/AdminPostsList";
import { RequireAuth } from "./pages/admin/RequireAuth";
import AdminMeditationsList from "./pages/admin/AdminMeditationsList";
import AdminMeditationForm from "./pages/admin/AdminMeditationForm";
import DevotionalDetailPage from "./pages/devotionals/DevotionalDetailPage";
import DevotionalsListPage from "./pages/devotionals/DevotionalsListPage";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/devotionals",
    element: <DevotionalsListPage />,
  },
  {
    path: "/devotionals/:slug",
    element: <DevotionalDetailPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "posts", element: <AdminPostsList /> },
          { path: "posts/new", element: <AdminPostForm /> },
          { path: "posts/:id", element: <AdminPostForm /> },
          { path: "meditations", element: <AdminMeditationsList /> },
          { path: "meditations/new", element: <AdminMeditationForm /> },
          { path: "meditations/:id", element: <AdminMeditationForm /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return (
    <SupabaseAuthProvider>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </SupabaseAuthProvider>
  );
}
