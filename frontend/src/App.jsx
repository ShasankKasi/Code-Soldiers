import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/Home";
import Admin from "../components/Admin";
import Forgot from "../components/Forgot";
import Verify from "../components/Verify";
import Question from "../components/Question";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import About from "../components/About";
import Contact from "../components/Contact";
import PageNotFound from "../components/PageNotFound";
import Login from "../components/Login";
import PrivateRoute from "../src/utils/PrivateRoute";
import Signup from "../components/signup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

// Utility to check if user is logged in
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // or however you store the token
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Router>
        <Routes>
          {/* Dynamic root route */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/verify" element={<Verify />} />

          {/* Private routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/question/:id"
            element={
              <PrivateRoute>
                <Question />
              </PrivateRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      {/* Global toaster for notifications */}
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "white",
            color: "black",
          },
        }}
      />
    </QueryClientProvider>
  );
}
