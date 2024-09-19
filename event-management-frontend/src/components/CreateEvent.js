import { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import api from '../api';

const CreateEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [maxAttendees, setMaxAttendees] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('location', location);
        formData.append('maxAttendees', maxAttendees);
        if (image) formData.append('image', image);
    
        try {
            const token = localStorage.getItem('authToken'); // Get the token from localStorage
            const { data } = await api.post('/events/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Attach the token to the request
                },
            });
            console.log('Event created:', data);
        } catch (error) {
            const message = error.response ? error.response.data.error : error.message;
            console.error('Error creating event:', message);
            setErrorMessage(message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Create Event
                </Typography>
                {errorMessage && (
                    <Typography color="error" variant="body2">
                        {errorMessage}
                    </Typography>
                )}
                <form onSubmit={handleCreateEvent}>
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
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Upload Image
                        <input
                            type="file"
                            hidden
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Create Event
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default CreateEvent;
