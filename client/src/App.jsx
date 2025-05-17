import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./pages/auth/AuthLayout";
import RootLayout from "./pages/root/RootLayout";
import Home from "./pages/root/Home";
import "./App.css";
import { Toaster } from "react-hot-toast";

const CreatePost = React.lazy(() => import("./pages/root/CreatePost"));
const Profile = React.lazy(() => import("./pages/root/Profile"));
const PostDetails = React.lazy(() => import("./components/PostDetails"));
const SigninForm = React.lazy(() => import("./pages/auth/form/SigninForm"));
const SignupForm = React.lazy(() => import("./pages/auth/form/SignupForm"));
const NotFound = React.lazy(() => import("./components/NotFound"));


function App() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          {/* <Spinner size="xl" /> */}
          Loading...
        </div>
      }
    >
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
        <Route index element={<Home />} />
        <Route element={<RootLayout />}>
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Route>
        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </React.Suspense>
  );
}

export default App;
