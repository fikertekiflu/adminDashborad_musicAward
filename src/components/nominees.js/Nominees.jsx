import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, delayChildren: 0.3, staggerChildren: 0.2 } },
};

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const formVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const previewVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

function Nominees() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [newNominee, setNewNominee] = useState(null);
    const [nominees, setNominees] = useState([]);
    const [editingNomineeId, setEditingNomineeId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNominees();
    }, []); 
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const fetchNominees = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiBaseUrl}/nominee`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
                throw new Error(`Failed to fetch nominees: ${response.status} - ${errorText || 'Unknown error'}`);
            }
            const data = await response.json();
            setNominees(data); // Assuming your API returns an array directly now
            setErrorMessage('');
        } catch (error) {
            console.error('Error fetching nominees:', error);
            setErrorMessage('Failed to fetch nominees.');
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setNewNominee({ round: '', stage: '', categories: [{ category: '', artists: [{ name: '', smsNumber: '' }] }] });
        setShowAddForm(true);
        setEditingNomineeId(null);
        setShowPreview(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleCancelClick = () => {
        setShowAddForm(false);
        setShowPreview(false);
        setEditingNomineeId(null);
        setNewNominee(null);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handlePreview = (nomineeData) => {
        setNewNominee(nomineeData);
        setShowAddForm(false);
        setShowPreview(true);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handlePost = async () => {
        try {
            console.log("Data being posted:", newNominee);
            const response = await fetch(`${apiBaseUrl}/nominee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNominee),
            });
            if (response.ok) {
                fetchNominees();
                setShowPreview(false);
                setNewNominee(null);
                setSuccessMessage('Nominee added successfully!');
                setErrorMessage('');
            } else {
                const errorData = await response.json();
                console.error('Failed to post nominee:', errorData);
                setErrorMessage(`Failed to post nominee: ${errorData.message || 'Unknown error'}`);
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error posting nominee:', error);
            setErrorMessage('Error posting nominee. Please check the console.');
            setSuccessMessage('');
        }
    };

    const handleEditClick = (id) => {
        setEditingNomineeId(id);
        const nomineeToEdit = nominees.find((nominee) => nominee._id === id);
        setNewNominee(nomineeToEdit ? JSON.parse(JSON.stringify(nomineeToEdit)) : { round: '', stage: '', categories: [{ category: '', artists: [{ name: '', smsNumber: '' }] }] });
        setShowAddForm(true);
        setShowPreview(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleUpdate = async (updatedNominee) => {
        try {
            const response = await fetch(`${apiBaseUrl}/nominee/${editingNomineeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedNominee),
            });
            if (response.ok) {
                fetchNominees();
                setShowAddForm(false);
                setEditingNomineeId(null);
                setNewNominee(null);
                setSuccessMessage('Nominee updated successfully!');
                setErrorMessage('');
            } else {
                const errorData = await response.json();
                console.error('Failed to update nominee:', errorData);
                setErrorMessage(`Failed to update nominee: ${errorData.message || 'Unknown error'}`);
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error updating nominee:', error);
            setErrorMessage('Error updating nominee. Please check the console.');
            setSuccessMessage('');
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this nominee?')) {
            try {
                const response = await fetch(`${apiBaseUrl}/nominee${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchNominees();
                    setSuccessMessage('Nominee deleted successfully!');
                    setErrorMessage('');
                } else {
                    const errorData = await response.json();
                    console.error('Failed to delete nominee:', errorData);
                    setErrorMessage(`Failed to delete nominee: ${errorData.message || 'Unknown error'}`);
                    setSuccessMessage('');
                }
            } catch (error) {
                console.error('Error deleting nominee:', error);
                setErrorMessage('Error deleting nominee. Please check the console.');
                setSuccessMessage('');
            }
        }
    };
    if (loading) {
        return <p className="text-center text-gray-500 mt-8">Loading nominees...</p>;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="p-8 space-y-8"
        >
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-800">Nominees Management</h1>
                    <p className="text-sm text-gray-500">Manage and view nominees for the Addis Music Awards.</p>
                </div>
                <button
                    className="bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-300"
                    onClick={handleAddClick}
                >
                    {editingNomineeId ? 'Edit Nominee' : '+ Add New Nominee'}
                </button>
            </motion.div>

            {successMessage && (
                <motion.div variants={itemVariants} className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg onClick={() => setSuccessMessage('')} className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path fillRule="evenodd" d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.586l-2.651 3.263a1.2 1.2 0 0 1-1.697-1.697L8.303 10l-3.263-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.414l2.651-3.263a1.2 1.2 0 0 1 1.697 1.697L11.697 10l3.263 2.651a1.2 1.2 0 0 1 0 1.697z"/></svg>
                    </span>
                </motion.div>
            )}

            {errorMessage && (
                <motion.div variants={itemVariants} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {errorMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg onClick={() => setErrorMessage('')} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path fillRule="evenodd" d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.586l-2.651 3.263a1.2 1.2 0 0 1-1.697-1.697L8.303 10l-3.263-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.414l2.651-3.263a1.2 1.2 0 0 1 1.697 1.697L11.697 10l3.263 2.651a1.2 1.2 0 0 1 0 1.697z"/></svg>
                    </span>
                </motion.div>
            )}

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        key="nomineeForm"
                        variants={formVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="mt-8"
                    >
                        <NomineeForm
                            onPreview={handlePreview}
                            onCancel={handleCancelClick}
                            nominee={newNominee}
                            setNominee={setNewNominee}
                            onUpdate={handleUpdate}
                            editingNomineeId={editingNomineeId}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        key="nomineePreview"
                        variants={previewVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="mt-8"
                    >
                        <NomineePreview nominee={newNominee} onPost={handlePost} onCancel={handleCancelClick} />
                    </motion.div>
                )}
            </AnimatePresence>

            {!showAddForm && !showPreview && (
                Array.isArray(nominees) && nominees.length > 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {nominees.map((nominee) => (
                            <motion.div
                                key={nominee._id}
                                variants={itemVariants}
                                className="rounded-lg p-6 shadow-md transition-transform transform hover:scale-105"
                            >
                                <div className="border rounded-md p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{nominee.round}</h2>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Created at: {new Date(nominee.created).toLocaleDateString()} -
                                        <span className={`font-semibold ${nominee.stage === 'Final' ? 'text-green-600' : 'text-gray-600'}`}>
                                            {nominee.stage}
                                        </span>
                                    </p>
                                    <div className="space-y-3">
                                        {Array.isArray(nominee.categories) && nominee.categories.map((cat, index) => (
                                            <div key={index} className="flex justify-between items-center border-b pb-2">
                                                <span className="text-sm text-gray-700">{cat.category}</span>
                                                {Array.isArray(cat.artists) && (
                                                    <span className="text-sm font-semibold text-gray-800">{cat.artists.length}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <button
                                            className="text-sm text-blue-600 font-semibold hover:underline"
                                            onClick={() => handleEditClick(nominee._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-sm text-red-600 font-semibold hover:underline"
                                            onClick={() => handleDeleteClick(nominee._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.p variants={itemVariants} className="text-center text-gray-500 mt-8">No Data Available</motion.p>
                )
            )}
        </motion.div>
    );
}

function NomineeForm({ onPreview, onCancel, nominee, setNominee, onUpdate, editingNomineeId }) {
    const [round, setRound] = useState(nominee?.round || '');
    const [stage, setStage] = useState(nominee?.stage || '');
    const [categories, setCategories] = useState(nominee?.categories ? JSON.parse(JSON.stringify(nominee.categories)) : [{ category: '', artists: [{ name: '', smsNumber: '' }] }]);
    const [showCategoryForms, setShowCategoryForms] = useState(categories.map(() => true)); // Initially show all category forms

    useEffect(() => {
        if (nominee) {
            setRound(nominee.round || '');
            setStage(nominee.stage || '');
            setCategories(nominee.categories ? JSON.parse(JSON.stringify(nominee.categories)) : [{ category: '', artists: [{ name: '', smsNumber: '' }] }]);
            setShowCategoryForms(nominee.categories ? nominee.categories.map(() => true) : [true]);
        } else {
            setRound('');
            setStage('');
            setCategories([{ category: '', artists: [{ name: '', smsNumber: '' }] }]);
            setShowCategoryForms([true]);
        }
    }, [nominee]);

    const handleAddCategory = () => {
        setCategories([...categories, { category: '', artists: [{ name: '', smsNumber: '' }] }]);
        setShowCategoryForms([...showCategoryForms, true]); // Show the new category form
    };

    const handleCategoryChange = (index, field, value) => {
        const updatedCategories = [...categories];
        updatedCategories[index][field] = value;
        setCategories(updatedCategories);
    };

    const handleAddArtist = (categoryIndex) => {
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex].artists.push({ name: '', smsNumber: '' });
        setCategories(updatedCategories);
    };

    const handleArtistChange = (categoryIndex, artistIndex, field, value) => {
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex].artists[artistIndex][field] = value;
        setCategories(updatedCategories);
    };

    const handleRemoveCategory = (index) => {
        if (categories.length > 1 || window.confirm('Are you sure you want to delete this category?')) {
            const updatedCategories = categories.filter((_, i) => i !== index);
            setCategories(updatedCategories);
            setShowCategoryForms(showCategoryForms.filter((_, i) => i !== index));
        }
    };

    const handleRemoveArtist = (categoryIndex, artistIndex) => {
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex].artists = updatedCategories[categoryIndex].artists.filter((_, i) => i !== artistIndex);
        setCategories(updatedCategories);
    };

    const handlePreviewClick = (event) => {
        event.preventDefault();
        onPreview({ round, stage, categories });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (editingNomineeId) {
            onUpdate({ _id: editingNomineeId, round, stage, categories });
        } else {
            onPreview({ round, stage, categories });
        }
    };

    const toggleCategoryFormVisibility = (index) => {
        const updatedShowCategoryForms = [...showCategoryForms];
        updatedShowCategoryForms[index] = !updatedShowCategoryForms[index];
        setShowCategoryForms(updatedShowCategoryForms);
    };

    return (
        <motion.form
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Award Round</label>
                <input
                    type="text"
                    value={round}
                    onChange={(e) => setRound(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-red-500 focus:border-red-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Stage</label>
                <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-red-500 focus:border-red-500 appearance-none bg-white rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                    <option value="">Select Stage</option>
                    <option value="Final">Final</option>
                    <option value="Semi-Final">Semi-Final</option>
                    <option value="Preliminary">Preliminary</option>
                </select>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
                {categories.map((cat, catIndex) => (
                    <div key={catIndex} className="border p-4 rounded-md shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-700">Category Name</label>
                            <button
                                type="button"
                                onClick={() => toggleCategoryFormVisibility(catIndex)}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                                {showCategoryForms[catIndex] ? 'Hide' : 'Show'}
                            </button>
                            {categories.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCategory(catIndex)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Delete Category
                                </button>
                            )}
                        </div>
                        {showCategoryForms[catIndex] && (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    value={cat.category}
                                    onChange={(e) => handleCategoryChange(catIndex, 'category', e.target.value)}
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-red-500 focus:border-red-500"
                                />
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-md font-semibold text-gray-700">Artists</h4>
                                    {cat.artists.map((artist, artistIndex) => (
                                        <div key={artistIndex} className="flex space-x-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Artist Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Artist Name"
                                                    value={artist.name}
                                                    onChange={(e) => handleArtistChange(catIndex, artistIndex, 'name', e.target.value)}
                                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-red-500 focus:border-red-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">SMS Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="SMS Number"
                                                    value={artist.smsNumber}
                                                    onChange={(e) => handleArtistChange(catIndex, artistIndex, 'smsNumber', e.target.value)}
                                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-red-500 focus:border-red-500"
                                                />
                                            </div>
                                            {cat.artists.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveArtist(catIndex, artistIndex)}
                                                    className="text-red-600 hover:underline self-end text-sm"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleAddArtist(catIndex)}
                                        className="text-sm text-red-600 hover:underline mt-2"
                                    >
                                        + Add Artist
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddCategory}
                    className="text-sm text-red-600 hover:underline mt-4"
                >
                    + Add Category
                </button>
            </div>
            <div className="flex justify-end space-x-6 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-300"
                >
                    {editingNomineeId ? 'Update' : 'Preview'}
                </button>
            </div>
        </motion.form>
    );
}

function NomineePreview({ nominee, onPost, onCancel }) {
    return (
        <motion.div
            variants={previewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold text-gray-800">Preview Nominee</h2>
            <div>
                <p><strong>Round:</strong> {nominee.round}</p>
                <p><strong>Stage:</strong> {nominee.stage}</p>
                {nominee.categories.map((cat, index) => (
                    <div key={index} className="mb-4">
                        <p><strong>Category:</strong> {cat.category}</p>
                        {cat.artists.map((artist, artistIndex) => (
                            <div key={artistIndex} className="flex space-x-4">
                                <p><strong>Artist:</strong> {artist.name}</p>
                                <p><strong>SMS:</strong> {artist.smsNumber}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex justify-end space-x-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onPost}
                    className="bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-300"
                >
                    Post
                </button>
            </div>
        </motion.div>
    );
}

export default Nominees;