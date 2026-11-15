import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserAuthentication from "../pages/UserAuthentication";
import ProtectedRoutes from "../components/ProtectedRoutes";
import AppLayout from "../layouts/AppLayout";
import Friends from "../pages/Friends";
import NewFriends from "../pages/NewFriends";
import IndexRoute from "../pages/IndexRoute";
import FriendRequests from "../pages/FriendRequests";
import UserProfile from "../pages/UserProfile";
import Settings from "../pages/Settings";
import Chats from "../pages/Chats";

export default function RoutesPage() {
    return (
        <Routes>
            <Route path="auth/" element={<UserAuthentication />}>
                <Route index element={<Navigate to="register" replace />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
            </Route>
            <Route path="/" element={<ProtectedRoutes />}>
                <Route element={<AppLayout />}>
                    <Route index element={<IndexRoute />} />
                    <Route path="new-friends" element={<NewFriends />} />
                    <Route path="friends/">
                        <Route index element={<Friends />} />
                        <Route path="friend-requests" element={<FriendRequests />} />
                    </Route>
                    <Route path="users/">
                        <Route index element={<UserProfile />} />
                        <Route path=":userId" element={<UserProfile />} />
                    </Route>
                    <Route path="chats" element={<Chats />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<>Random Ahh Shii... No document for this route yet...</>} />
                </Route>
            </Route>
        </Routes>
    )
}