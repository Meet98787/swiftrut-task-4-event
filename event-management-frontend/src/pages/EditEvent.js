import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const EditEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [maxAttendees, setMaxAttendees] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Add error message state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const { data } = await api.get(`/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvent(data);
                setTitle(data.title);
                setDescription(data.description);
                setDate(data.date.split('T')[0]);
                setLocation(data.location);
                setMaxAttendees(data.maxAttendees);
            } catch (error) {
                console.error('Error fetching event:', error.response ? error.response.data : error.message);
            }
        };
        fetchEvent();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const updatedEvent = { title, description, date, location, maxAttendees };
            await api.put(`/events/${id}`, updatedEvent, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/my-events');
        } catch (error) {
            const message = error.response ? error.response.data.error : error.message;
            setErrorMessage(message); // Set error message if any
            console.error('Error updating event:', message);
        }
    };

    if (!event) return <p>Loading event data...</p>;

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Edit Event
                </Typography>
                {errorMessage && (
                    <Typography color="error" variant="body2">
                        {errorMessage}
                    </Typography>
                )}
                <form onSubmit={handleUpdate}>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <TextField
                        label="Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Location"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <TextField
                        label="Max Attendees"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={maxAttendees}
                        onChange={(e) => setMaxAttendees(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Update Event
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default EditEvent;
