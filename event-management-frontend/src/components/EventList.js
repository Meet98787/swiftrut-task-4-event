import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Grid, Card, CardContent, Typography, Button, Container, CardMedia } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const { user } = useContext(AuthContext); // Get the logged-in user from AuthContext

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error.response ? error.response.data : error.message);
        }
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
    }, []);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Upcoming Events
            </Typography>
            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                        <Card>
                            {/* Show the event image */}
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
