import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlus, FaUpload } from 'react-icons/fa';

function WonArtistsAdmin() {
  const [rounds, setRounds] = useState([]);
  const [newRound, setNewRound] = useState('');
  const [newArtists, setNewArtists] = useState([
    { name: '', category: '', work: '', description: '', image: null, tempId: `artist-${Date.now()}` }
  ]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/wonArtists');
      if (Array.isArray(response.data)) {
        setRounds(response.data);
      } else {
        console.error('API response is not an array:', response.data);
        setError('Failed to fetch data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching rounds:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddArtist = () => {
    setNewArtists([
      ...newArtists,
      { name: '', category: '', work: '', description: '', image: null, tempId: `artist-${Date.now()}` }
    ]);
  };

  const handleArtistChange = (index, e) => {
    const updatedArtists = [...newArtists];
    updatedArtists[index][e.target.name] = e.target.value;
    setNewArtists(updatedArtists);
  };

  const handleImageChange = (index, e) => {
    const updatedArtists = [...newArtists];
    updatedArtists[index].image = e.target.files[0];
    setNewArtists(updatedArtists);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('loading');

    const formData = new FormData();
    formData.append('round', newRound);

    // Step 1: Prepare artist data without files
    const artistsData = newArtists.map((artist) => ({
      name: artist.name,
      category: artist.category,
      work: artist.work,
      description: artist.description,
      tempId: artist.tempId,
    }));

    // Step 2: Append JSON stringified data
    formData.append('artists', JSON.stringify(artistsData));

    // Step 3: Append files separately using dynamic keys
    newArtists.forEach((artist) => {
      formData.append(`file-${artist.tempId}`, artist.image);
    });

    try {
      await axios.post('http://localhost:5000/api/wonArtists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchRounds();
      setNewRound('');
      setNewArtists([{ name: '', category: '', work: '', description: '', image: null, tempId: `artist-${Date.now()}` }]);
      setSubmissionStatus('success');
      setTimeout(() => setSubmissionStatus(null), 3000);
    } catch (error) {
      console.error('Error saving round:', error);
      setError(error.message || 'Failed to add round.');
      setSubmissionStatus('error');
      setTimeout(() => setSubmissionStatus(null), 3000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-semibold mb-8 text-gray-800">Manage Won Artists</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-10">
        <input
          type="text"
          placeholder="Round (e.g., The 10th)"
          value={newRound}
          onChange={(e) => setNewRound(e.target.value)}
          className="border p-4 rounded-xl w-full mb-6 text-gray-700 focus:ring-2 focus:ring-red-300"
        />

        {newArtists.map((artist, index) => (
          <motion.div
            key={artist.tempId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border p-6 mb-6 rounded-xl shadow-md"
          >
            <input
              type="text"
              name="name"
              placeholder="Artist Name"
              value={artist.name}
              onChange={(e) => handleArtistChange(index, e)}
              className="border p-4 rounded-xl w-full mb-4 text-gray-700 focus:ring-2 focus:ring-red-300"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={artist.category}
              onChange={(e) => handleArtistChange(index, e)}
              className="border p-4 rounded-xl w-full mb-4 text-gray-700 focus:ring-2 focus:ring-red-300"
            />
            <input
              type="text"
              name="work"
              placeholder="Work"
              value={artist.work}
              onChange={(e) => handleArtistChange(index, e)}
              className="border p-4 rounded-xl w-full mb-4 text-gray-700 focus:ring-2 focus:ring-red-300"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={artist.description}
              onChange={(e) => handleArtistChange(index, e)}
              className="border p-4 rounded-xl w-full mb-4 text-gray-700 focus:ring-2 focus:ring-red-300"
            />
            <div className="relative border p-4 rounded-xl cursor-pointer">
              <input
                type="file"
                onChange={(e) => handleImageChange(index, e)}
                className="absolute inset-0 opacity-0 w-full h-full"
              />
              {artist.image ? (
                <p className="text-gray-600 truncate">{artist.image.name}</p>
              ) : (
                <div className="flex items-center justify-center">
                  <FaUpload className="mr-2 text-gray-500" />
                  <p className="text-gray-500">Click to upload image</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={handleAddArtist}
            className="bg-green-500 text-white p-4 rounded-xl flex items-center"
          >
            <FaPlus className="mr-2" /> Add Artist
          </button>
          <button type="submit" className="bg-red-600 text-white p-4 rounded-xl">
            Save Round
          </button>
        </div>

        {submissionStatus === 'loading' && <p className="mt-4 text-gray-600">Saving...</p>}
        {submissionStatus === 'success' && <p className="mt-4 text-green-600">Round added successfully!</p>}
        {submissionStatus === 'error' && <p className="mt-4 text-red-600">Failed to add round.</p>}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rounds.map((round) => (
          <motion.div
            key={round._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{round.round}</h2>
            {round.artists.map((artist) => (
              <div key={artist._id} className="mb-6">
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <p className="font-semibold text-lg text-gray-700">{artist.name}</p>
                <p className="text-gray-600">Category: {artist.category}</p>
                <p className="text-gray-600">Work: {artist.work}</p>
                <p className="text-gray-600">{artist.description}</p>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default WonArtistsAdmin;
