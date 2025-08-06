import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Logout from "./pages/logout/Logout";
import MapPage from "./pages/map/MapPage";
import RestaurantPage from "./pages/restaurant/restaurantPage";
import SearchPage from "./pages/search/SearchPage"
import AddRestaurant from "./pages/add/AddRestaurant";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionDenied from "./pages/PermissionDenied";
import EditRestaurant from "./pages/edit/EditRestaurant";
import EditOpening from "./pages/editopening/EditOpening";
import ReviewForm from "./pages/review/ReviewForm";
import AnalyticsDashboard from "./pages/dashboard/AnalyticsDashboard";
import RestaurantReviews from "./pages/review/RestaurantReviews";
import CreateOpening from "./pages/addopening/CreateOpening";
import ApproveRestaurant from "./pages/approve/ApproveRestaurant";
import DeleteRestaurant from "./pages/delete/DeleteRestaurant";
import CancelBookingPage from "./pages/cancel/CancelBookingPage";
import UploadPicture from "./pages/upload/UploadPicture";
import ViewBookings from "./pages/viewbooking/ViewBookings";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view-bookings" element={<ViewBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cancel-booking/:openingId" element={<CancelBookingPage />} /> {/* Updated route */}
        <Route path="/denied" element={<PermissionDenied />} />
        <Route
          path="/add"
          element={
            <ProtectedRoute allowedRole={["admin", "manager"]}>
              <AddRestaurant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute allowedRole={["admin", "manager"]}>
              <EditRestaurant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editopening"
          element={
            <ProtectedRoute allowedRole={["admin", "manager"]}>
              <EditOpening />
            </ProtectedRoute>
          }
        />
        <Route path="/restaurantPage" element={<RestaurantPage/>} />
        <Route path="/writereview" element={<ReviewForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole={["admin"]}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/reviews" element={<RestaurantReviews />} />
        <Route
          path="/createopening"
          element={
            <ProtectedRoute allowedRole={["admin", "manager"]}>
              <CreateOpening />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approve"
          element={
            <ProtectedRoute allowedRole={["admin"]}>
              <ApproveRestaurant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delete"
          element={
            <ProtectedRoute allowedRole={["admin"]}>
              <DeleteRestaurant />
            </ProtectedRoute>
          }
        />
        <Route path="/upload" element={<UploadPicture />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

