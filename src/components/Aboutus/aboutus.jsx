import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { CircleLoader } from 'react-spinners';

function AboutUs() {
  const [aboutUsData, setAboutUsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeAction, setActiveAction] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(aboutUsData.length / itemsPerPage);
  const currentItems = aboutUsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Fetch data from backend on page load
  useEffect(() => {
    const fetchAboutUsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/aboutus');
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          setAboutUsData(response.data.data); // Access response.data.data here
        } else {
          setAboutUsData([]);
        }
      } catch (error) {
        console.error('Error fetching About Us data:', error);
        setAboutUsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutUsData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleActionClick = (id) => {
    setActiveAction(id === activeAction ? null : id);
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const resetForm = () => {
    setShowForm(false);
    setTitle('');
    setDescription('');
    setSelectedImage(null);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setSelectedImage(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleBrowseClick = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    if (fileInputRef.current && fileInputRef.current.files[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }

    try {
      let response;
      if (editingId) {
        response = await axios.put(`http://localhost:5000/api/aboutus/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setAboutUsData(prev =>
          prev.map(item => (item._id === editingId ? response.data.data : item))
        );
        setSuccessMessage('Information updated successfully!');
      } else {
        response = await axios.post('http://localhost:5000/api/aboutus', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setAboutUsData(prev => [response.data.data, ...prev]);
        setSuccessMessage('Information added successfully!');
      }

      resetForm();

    } catch (error) {
      console.error("Error submitting About Us info:", error);
      setSuccessMessage('Error processing request.');
    }
  };

  const handleEditInformation = (id) => {
    const item = aboutUsData.find(item => item._id === id);
    if (item) {
      setEditingId(id);
      setTitle(item.title);
      setDescription(item.description);
      setSelectedImage(item.image);
      setShowForm(true);
    }
  };

  const handleDeleteInformation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/aboutus/${id}`);
      setAboutUsData(prev => prev.filter(item => item._id !== id));
      setSuccessMessage('Information deleted successfully!');
    } catch (error) {
      console.error("Error deleting About Us info:", error);
      setSuccessMessage('Error deleting request.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircleLoader color="#e3342f" loading={loading} size={60} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-white rounded-xl shadow-lg mt-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">About Us Information</h1>
          <p className="text-sm text-gray-500 mt-1">Admin &gt; About Us Information</p>
        </div>
        <button
          className="bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-red-700"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Information
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md">
          <p>{successMessage}</p>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            className="bg-white rounded-lg shadow-md p-6 mt-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{editingId ? 'Edit Information' : 'Add New Information'}</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-red-500 focus:border-red-500 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="w-full h-32 border border-gray-300 rounded-lg p-3 mt-1 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <div
                className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {selectedImage ? (
                  <img
                    src={typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="max-h-40 max-w-full rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500">Drag & Drop or Click to Browse</p>
                )}
                <button
                  type="button"
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                  onClick={handleBrowseClick}
                >
                  Browse
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="border border-gray-300 rounded-lg px-6 py-2 text-sm font-semibold hover:bg-gray-100"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-red-700"
                onClick={handleSubmit}
              >
                {editingId ? 'Update' : 'Post'} Information
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <>
          <div className="overflow-x-auto rounded-lg shadow-sm bg-gray-50">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No data available</td>
                  </tr>
                ) : (
                  currentItems.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm break-words max-w-xs">{item.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <img src={item.image} alt={item.title} className="h-16 w-16 object-cover rounded-lg" />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-3">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditInformation(item._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteInformation(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {currentItems.length} of {aboutUsData.length} entries
            </div>
            <div>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-2 text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AboutUs;
