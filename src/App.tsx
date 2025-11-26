import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/utils/roleContext";
import RoleSelector from "./pages/RoleSelector";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import StudentPromotion from "./pages/StudentPromotion";
import ResultEntry from "./pages/ResultEntry";
import Analytics from "./pages/Analytics";
import Library from "./pages/Library";
import Timetable from "./pages/Timetable";
import Exams from "./pages/Exams";
import TeacherExams from "./pages/TeacherExams";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RoleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleSelector />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Super Admin / Admin Routes */}
            <Route path="/students" element={<Students />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/promotion" element={<StudentPromotion />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/settings" element={<Dashboard />} />
            
            {/* Teacher Routes */}
            <Route path="/my-classes" element={<Students />} />
            <Route path="/my-exams" element={<TeacherExams />} />
            <Route path="/result-entry" element={<ResultEntry />} />
            <Route path="/my-timetable" element={<Timetable />} />
            
            {/* Parent Routes */}
            <Route path="/my-children" element={<Students />} />
            
            {/* Student Routes */}
            <Route path="/my-profile" element={<StudentProfile />} />
            <Route path="/my-assessments" element={<StudentProfile />} />
            
            {/* Shared Routes */}
            <Route path="/library" element={<Library />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
