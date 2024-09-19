import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Grid, Card, CardContent, Typography, Button, Container, CardMedia } from '@mui/material';

const MyEvents = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchMyEvents = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await api.get('/events/my-events', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMyEvents(data);
        } catch (error) {
            console.error('Error fetching my events:', error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = async (eventId) => {
        const token = localStorage.getItem('authToken');
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                setLoading(true);
                await api.delete(`/events/${eventId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLoading(false);
                fetchMyEvents(); // Refresh the events after deletion
            } catch (error) {
                setLoading(false);
                console.error('Error deleting event:', error.response ? error.response.data : error.message);
            }
        }
    };

    const handleEdit = (eventId) => {
        navigate(`/edit-event/${eventId}`); // Redirect to the edit page with event ID
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Created Events
            </Typography>
            <Grid container spacing={3}>
                {myEvents.map((event) => (
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
                                    Created by: {event.creator.username} ({event.creator.email})
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Attendees:
                                </Typography>
                                <ul>
                                    {event.attendees.map((attendee) => (
                                        <li key={attendee._id}>
                                            {attendee.username} ({attendee.email})
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2, mr: 1 }}
                                    onClick={() => handleEdit(event._id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleDelete(event._id)}
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Delete'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
        
    );
};

export default MyEvents;
