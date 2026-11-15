import SocketProvider from "./context/SocketContext";
import UserProvider from "./context/UserContext";
import RoutesPage from "./routes/Routes";
import "./utils/strings.util";
import "./App.css";
import ThemeProvider from "./context/ThemeContext";

function App() {

    return (
        <SocketProvider>
            <UserProvider>
                <ThemeProvider>
                    <RoutesPage />
                </ThemeProvider>
            </UserProvider>
        </SocketProvider>
    )
}


export default App