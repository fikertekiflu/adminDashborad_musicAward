import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Edit, Trash2, Save, X, PlusCircle, AlertTriangle, Calendar as CalendarIcon, UploadCloud } from 'react-feather'; // Import icons
import { format } from 'date-fns';

const Location = () => {
    const [locationData, setLocationData] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        place: '',
        image: null,
        description: '',
        sentence1: '',
        sentence2: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false); // Set to false initially, will be true on initial load if needed
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch location data on component mount
    useEffect(() => {
        fetchLocationData();
    }, []);

    // Fetch location data from the API
    const fetchLocationData = useCallback(() => {
        setLoading(true);
        setError(null);
        // Simulate API call (remove this when you have your backend)
        setTimeout(() => {
            // Mock data for demonstration purposes
            const mockData = {
                _id: '1',
                date: new Date(),
                place: 'Sample Location',
                image: 'https://placehold.co/600x400/EEE/31343C', // Placeholder image URL
                description: 'This is a sample location description.',
                sentence1: 'Sample sentence one.',
                sentence2: 'Sample sentence two.',
            };
            setLocationData(mockData);
            setLoading(false);
        }, 1000); // Simulate 1 second delay
    }, []);

    // Handle input changes in the form
    const handleChange = (e) => {
        if (e.target.name === 'image') {
            const file = e.target.files?.[0];
            setFormData({ ...formData, image: file || null });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Handle form submission (create or update)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.date || !formData.place || !formData.description) {
            setError('Please fill in all required fields.');
            return;
        }

        // Simulate API call (remove this when you have your backend)
        setLoading(true);
        setError(null);
        setTimeout(() => {
            if (isEditing) {
                // Simulate update
                setLocationData({
                    ...locationData,
                    date: formData.date,
                    place: formData.place,
                    description: formData.description,
                    sentence1: formData.sentence1,
                    sentence2: formData.sentence2,
                    image: formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image, // Keep existing URL if not a new file
                });
                alert('Location data updated successfully!');
            } else {
                //Simulate Add
                setLocationData({
                    ...formData,
                    _id: 'new-id', //mock
                    image: formData.image ? URL.createObjectURL(formData.image) : 'https://placehold.co/600x400/EEE/31343C', // Placeholder if no image
                });
                alert('Location data created successfully!');
            }

            resetForm();
            fetchLocationData(); // Re-fetch to update the view
            setShowForm(false);
            setLoading(false);
        }, 1000);
    };

    // Handle deletion of a location
    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this location?')) return;
        setLoading(true);
        setError(null);
        // Simulate API call
        setTimeout(() => {
            setLocationData(null); //remove
            alert('Location data deleted successfully!');
            fetchLocationData();
            setLoading(false);
        }, 1000);
    };

    // Handle editing of a location
    const handleEdit = (item) => {
        setIsEditing(true);
        setEditId(item._id);
        setFormData({
            date: item.date.substring(0, 10),
            place: item.place,
            image: item.image,
            description: item.description,
            sentence1: item.sentence1,
            sentence2: item.sentence2,
        });
        setShowForm(true);
    };

    // Reset the form state
    const resetForm = () => {
        setFormData({
            date: '',
            place: '',
            image: null,
            description: '',
            sentence1: '',
            sentence2: '',
        });
        setIsEditing(false);
        setEditId(null);
    };

    // Handle drag and drop events for image upload
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // Handle dropping an image file
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFormData({ ...formData, image: e.dataTransfer.files[0] });
        }
    };

    // Render the location data table
    const renderLocationTable = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <svg className="animate-spin h-6 w-6 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-700">Loading Location Data...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <AlertTriangle className="h-5 w-5" />
                    {error}
                </div>
            );
        }

        if (!locationData) {
            return <div className="p-6 text-gray-500 bg-white rounded-lg shadow-md border border-gray-200">No location data available.</div>;
        }

        return (
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-red-500" /> Location Data
                    </h2>

                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Place</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sentence 1</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sentence 2</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locationData && (
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm font-medium text-gray-900">{locationData._id}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{locationData.place}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{format(new Date(locationData.date), 'PPP')}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <img src={locationData.image} alt="Location" className="w-20 rounded-md shadow-sm border border-gray-200" />
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{locationData.description}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{locationData.sentence1}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">{locationData.sentence2}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(locationData)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1 shadow-md"
                                            >
                                                <Edit className="h-4 w-4" /> <span className="hidden sm:inline">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(locationData._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1 shadow-md"
                                            >
                                                <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                    {/* Placeholder for pagination controls - Not interactive in this example */}
                    <div className="text-sm text-gray-500">Showing 1 to 1 of 1 entries</div>
                    <div className="flex items-center">
                        <button variant="outline" size="icon" className="mx-1 text-gray-700 hover:text-red-500 transition-colors">
                            {'<'}
                        </button>
                        <span className="text-gray-700 mx-1">1</span>
                        <button variant="outline" size="icon" className="mx-1 text-gray-700 hover:text-red-500 transition-colors">
                            {'>'}
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    // Render the location form
    const renderLocationForm = () => {
        return (
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                    {isEditing ? <><Edit className="h-6 w-6 text-blue-500" /> Edit Location</> : <><PlusCircle className="h-6 w-6 text-green-500" /> Add Location</>}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Date <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date || ''}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm pr-10"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Place <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="place"
                                value={formData.place || ''}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                placeholder="Enter place"
                            />
                        </div>
                        <div
                            className="relative"
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                            <input
                                type="file"
                                name="image"
                                ref={fileInputRef}
                                onChange={handleChange}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                accept="image/*"
                            />
                            <div
                                className={`mt-1 p-3 border rounded-md w-full flex items-center justify-center transition-colors duration-200 border-dashed border-gray-300 bg-white text-gray-500 ${dragActive ? 'border-blue-500 bg-blue-50' : ''}`}
                            >
                                {formData.image ? (
                                    <span className="text-gray-700 truncate">{formData.image.name}</span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <UploadCloud className="h-4 w-4" />
                                        <span>Drag and drop image, or click to select</span>
                                    </span>
                                )}
                            </div>
                            {formData.image && (
                                <div className="mt-2">
                                    <img
                                        src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image}
                                        alt="Uploaded"
                                        className="h-20 rounded-md shadow-sm border border-gray-200"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="col-span-full md:col-span-1">
                            <label className="text-sm font-medium text-gray-700 block mb-1">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>
                        <div className="col-span-full md:col-span-1">
                            <label className="text-sm font-medium text-gray-700 block mb-1">Sentence 1</label>
                            <input
                                type="text"
                                name="sentence1"
                                value={formData.sentence1 || ''}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                placeholder="Enter sentence 1"
                            />
                        </div>
                        <div className="col-span-full md:col-span-1">
                            <label className="text-sm font-medium text-gray-700 block mb-1">Sentence 2</label>
                            <input
                                type="text"
                                name="sentence2"
                                value={formData.sentence2 || ''}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                placeholder="Enter sentence 2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            variant="outline"
                            onClick={() => { setShowForm(false); resetForm(); }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-md transition-colors duration-200 shadow-md"
                        >
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 shadow-md"
                        >
                            {isEditing ? <><Save className="mr-2 h-4 w-4" /> Update</> : <><PlusCircle className="mr-2 h-4 w-4" /> Post</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-7 w-7 text-red-500" /> Location Information
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">Admin</span>
                    <span>Location Information</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {showForm ? renderLocationForm() : renderLocationTable()}
            </AnimatePresence>
        </div>
    );
};

export default Location;

