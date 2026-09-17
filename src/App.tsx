import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import SiteLayout from "./components/site/SiteLayout";
import HomePage from "./pages/public/HomePage";
import EditorialPage, { ArticleDetailPage, WorkDetailPage } from "./pages/public/EditorialPage";
import ContactPage from "./pages/public/ContactPage";
import RequireAdmin from "./components/admin/RequireAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
       <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
            <Routes>
              <Route path="/" element={<Navigate to="/en" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
              <Route path="/:lang" element={<SiteLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<EditorialPage type="about" />} />
                <Route path="expertise" element={<EditorialPage type="expertise" />} />
                <Route path="work" element={<EditorialPage type="work" />} />
                <Route path="work/:slug" element={<WorkDetailPage />} />
                <Route path="ideas" element={<EditorialPage type="ideas" />} />
                <Route path="ideas/:slug" element={<ArticleDetailPage />} />
                <Route path="experience" element={<EditorialPage type="experience" />} />
                <Route path="credentials" element={<EditorialPage type="credentials" />} />
                <Route path="speaking" element={<EditorialPage type="speaking" />} />
                <Route path="community" element={<EditorialPage type="community" />} />
                <Route path="media" element={<EditorialPage type="media" />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
        </TooltipProvider>
      </LanguageProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
