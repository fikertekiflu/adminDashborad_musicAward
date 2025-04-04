import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function AboutUs() {
  const [aboutUsData, setAboutUsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [activeAction, setActiveAction] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState('');

  const totalPages = Math.ceil(aboutUsData.length / itemsPerPage);
  const currentItems = aboutUsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Fetch About Us data from backend
  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/aboutus'); // Adjust URL as needed
        setAboutUsData(response.data);
      } catch (error) {
        console.error("Error fetching About Us data:", error);
      }
    };
    fetchAboutUsData();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle action click (show more options)
  const handleActionClick = (id) => {
    setActiveAction(id === activeAction ? null : id);
  };

  // Handle checkbox change for selection
  const handleCheckboxChange = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((itemId) => itemId !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  // Show Add Information Form
  const handleAddClick = () => {
    setShowAddForm(true);
  };

  // Handle form cancel
  const handleCancelClick = () => {
    setShowAddForm(false);
    setSelectedImage(null);
    setTitle('');
    setDescription('');
  };

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // Handle drag & drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Trigger file input browse
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Handle form submission (Add Information)
  const handleAddInformation = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (fileInputRef.current?.files[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }
    formData.append('status', 'pending'); // Marking the entry as pending for review

    try {
      const response = await axios.post('http://localhost:5000/api/aboutus', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAboutUsData([response.data.data, ...aboutUsData]);
      setSuccessMessage('Information added and pending approval!');
      handleCancelClick();
    } catch (error) {
      console.error("Error adding About Us information:", error);
      setSuccessMessage('Error adding information.');
    }
  };

  // Handle Edit Information
  const handleEditInformation = async (id) => {
    // Find the item and update its content (this can be expanded with an edit form)
    const updatedItem = aboutUsData.find(item => item._id === id);
    setTitle(updatedItem.title);
    setDescription(updatedItem.description);
    setSelectedImage(updatedItem.image);
    setShowAddForm(true);
  };

  // Handle Delete Information
  const handleDeleteInformation = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/aboutus/${id}`);
      setAboutUsData(aboutUsData.filter((item) => item._id !== id));
      setSuccessMessage('Information deleted successfully!');
    } catch (error) {
      console.error("Error deleting About Us information:", error);
      setSuccessMessage('Error deleting information.');
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl shadow-lg p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">About Us Information</h1>
          <p className="text-sm text-gray-500 mt-1">Admin &gt; About Us Information</p>
        </div>
        <button
          className="bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
          onClick={handleAddClick}
        >
          + Add Information
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mt-4">
          <p>{successMessage}</p>
        </div>
      )}

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            key="add-form"
            className="bg-white rounded-lg shadow-md p-6 mt-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Information</h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full text-sm focus:ring-red-500 focus:border-red-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">About Us Description</label>
              <textarea
                className="border border-gray-300 rounded-lg p-3 w-full h-32 resize-none focus:ring-red-500 focus:border-red-500"
                placeholder="Add description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">About Us Image</label>
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
                  <img src={selectedImage} alt="Selected" className="max-h-40 max-w-full rounded-lg" />
                ) : (
                  <p className="text-gray-500">Drag & Drop or Click to Browse</p>
                )}
                <button
                  type="button"
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
                  onClick={handleBrowseClick}
                >
                  Browse
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="border border-gray-300 rounded-lg px-6 py-2 text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
                onClick={handleAddInformation}
              >
                Post Information
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Table and Pagination */}
      {!showAddForm && (
        <>
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Attachment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className={`form-checkbox h-4 w-4 transition-colors duration-200 ${checkedItems.includes(item._id) ? 'text-red-600' : 'text-gray-600'}`}
                        checked={checkedItems.includes(item._id)}
                        onChange={() => handleCheckboxChange(item._id)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.createdAt}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      <img src={item.image} alt="Attachment" className="h-10 w-10 rounded-lg shadow-md" />
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 relative">
                      <div className="cursor-pointer" onClick={() => handleActionClick(item._id)}>
                        <div className="flex flex-col space-y-1">
                          <div className={`w-1 h-1 rounded-full ${activeAction === item._id ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                          <div className={`w-1 h-1 rounded-full ${activeAction === item._id ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                          <div className={`w-1 h-1 rounded-full ${activeAction === item._id ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                        </div>
                      </div>
                      {activeAction === item._id && (
                        <div className="absolute top-0 right-0 bg-white shadow-lg rounded-lg p-2 mt-6 space-y-2">
                          <button onClick={() => handleEditInformation(item._id)} className="text-blue-600">Edit</button>
                          <button onClick={() => handleDeleteInformation(item._id)} className="text-red-600">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600 font-medium">Rows per page:</p>
              <select className="border border-gray-300 rounded-md p-1 text-sm focus:ring-red-500 focus:border-red-500">
                <option>5</option>
                <option>10</option>
                <option>15</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="bg-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-300 transition-colors duration-200"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                {"<"}
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-2 text-sm ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'text-gray-600'}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="bg-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-300 transition-colors duration-200"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {">"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AboutUs;
