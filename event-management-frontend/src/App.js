import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';
import EditEvent from './pages/EditEvent'; // Import EditEvent
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<EventList />} />
                    <Route path="/create-event" element={
                        <ProtectedRoute>
                            <CreateEvent />
                        </ProtectedRoute>
                    } />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/my-events" element={
                        <ProtectedRoute>
                            <MyEvents />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-event/:id" element={
                        <ProtectedRoute>
                            <EditEvent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
