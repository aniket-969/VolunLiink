import { Routes, Route } from "react-router-dom";
import AuthLayout from "./pages/auth/AuthLayout";
import RootLayout from "./pages/root/RootLayout";
import Home from "./pages/root/Home";
import SigninForm from "./pages/auth/form/SigninForm";
import SignupForm from "./pages/auth/form/SignupForm";
import "./App.css";
import Profile from "./pages/root/Profile";
import PostDetails from "./components/PostDetails";
import CreatePost from "./pages/root/CreatePost";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
