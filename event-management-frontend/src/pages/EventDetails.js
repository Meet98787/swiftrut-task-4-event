import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';

const EventDetails = () => {
    const { id } = useParams(); // Get the event ID from the route params
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (error) {
                console.error('Error fetching event details:', error.response ? error.response.data : error.message);
            }
        };
        fetchEvent();
    }, [id]);

    if (!event) return <p>Loading event details...</p>;

    return (
        <Container sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {event.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {event.description}
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="body2">
                            Date: {new Date(event.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                            Location: {event.location}
                        </Typography>
                        <Typography variant="body2">
                            Max Attendees: {event.maxAttendees}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default EventDetails;
