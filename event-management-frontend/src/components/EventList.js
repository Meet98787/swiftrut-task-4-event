import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Grid, Card, CardContent, Typography, Button, Container, CardMedia, TextField } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';  // Import socket.io

const socket = io('http://localhost:5000');  // Connect to the server

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({ startDate: '', endDate: '', location: '' });
    const { user } = useContext(AuthContext);

    const fetchEvents = async (filterParams = {}) => {
        try {
            const { data } = await api.get('/events', { params: filterParams });
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error.response ? error.response.data : error.message);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = () => {
        fetchEvents(filters);
    };

    const handleRSVP = async (eventId) => {
        try {
            const token = localStorage.getItem('authToken');
            await api.post(`/events/${eventId}/rsvp`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents(); // Refresh events after RSVP
        } catch (error) {
            console.error('Error RSVPing for event:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchEvents();

        // Listen for updates from the server
        socket.on('eventUpdated', (data) => {
            alert(`Event Update: ${data.message}`);  // Show notification when an event is updated
            fetchEvents();  // Refresh the events list when an event is updated
        });

        return () => {
            socket.off('eventUpdated');  // Cleanup when component unmounts
        };
    }, []);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Upcoming Events
            </Typography>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Start Date"
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="End Date"
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Location"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleFilterSubmit}>
                        Apply Filters
                    </Button>
                </Grid>
            </Grid>

            {/* Event List */}
            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                        <Card>
                            {event.imageUrl && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={`http://localhost:5000${event.imageUrl}`}
                                    alt={event.title}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {event.description}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Date: {new Date(event.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Location: {event.location}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Attendees: {event.attendees.length}/{event.maxAttendees}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    component={Link}
                                    to={`/events/${event._id}`}
                                >
                                    View Details
                                </Button>

                                {user && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 2,
                                            ml: 0, 
                                            backgroundColor: '#28a745', 
                                            color: '#fff', 
                                            '&:hover': {
                                                backgroundColor: '#218838',
                                            },
                                            padding: '8px 16px',
                                            fontSize: '0.875rem',
                                        }}
                                        onClick={() => handleRSVP(event._id)}
                                        disabled={event.attendees.length >= event.maxAttendees}
                                    >
                                        {event.attendees.length >= event.maxAttendees
                                            ? 'Max Attendees Reached'
                                            : 'I will attend this event'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default EventList;
