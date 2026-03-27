const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    expertise: [{ type: String }]
});

module.exports = mongoose.model('Reviewer', reviewerSchema);
import React, { useState } from 'react';
import axios from 'axios';

const ReviewerProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [expertise, setExpertise] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('/api/reviewer', { name, email, expertise: expertise.split(',') });
        alert(response.data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="text" placeholder="Expertise (comma separated)" value={expertise} onChange={e => setExpertise(e.target.value)} required />
            <button type="submit">Create Reviewer Profile</button>
        </form>
    );
};

export default ReviewerProfile;
