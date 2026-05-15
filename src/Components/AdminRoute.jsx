import { Navigate } from "react-router-dom";
import { getCurrentUser, isAuthed } from "../api";

export default function AdminRoute({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
