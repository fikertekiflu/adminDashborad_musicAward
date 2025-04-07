import React, { useState, useEffect } from 'react';

function Nominees() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newNominee, setNewNominee] = useState(null);
  const [nominees, setNominees] = useState([]);
  const [editingNomineeId, setEditingNomineeId] = useState(null);

  useEffect(() => {
    fetchNominees();
  }, []);

  const fetchNominees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/nominee');
      const data = await response.json();
      setNominees(data);
    } catch (error) {
      console.error('Error fetching nominees:', error);
    }
  };

  const handleAddClick = () => {
    setNewNominee({ round: '', stage: '', categories: [{ category: '', artists: [{ name: '', smsNumber: '' }] }] });
    setShowAddForm(true);
    setEditingNomineeId(null);
  };

  const handleCancelClick = () => {
    setShowAddForm(false);
    setShowPreview(false);
    setEditingNomineeId(null);
  };

  const handlePreview = (nomineeData) => {
    setNewNominee(nomineeData);
    setShowAddForm(false);
    setShowPreview(true);
  };

  const handlePost = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/nominee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNominee),
      });
      if (response.ok) {
        fetchNominees();
        setShowPreview(false);
        setNewNominee(null);
      } else {
        console.error('Failed to post nominee');
      }
    } catch (error) {
      console.error('Error posting nominee:', error);
    }
  };

  const handleEditClick = (id) => {
    setEditingNomineeId(id);
    const nomineeToEdit = nominees.find((nominee) => nominee._id === id);
    setNewNominee(nomineeToEdit);
    setShowAddForm(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/nominee/${editingNomineeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNominee),
      });
      if (response.ok) {
        fetchNominees();
        setShowAddForm(false);
        setEditingNomineeId(null);
      } else {
        console.error('Failed to update nominee');
      }
    } catch (error) {
      console.error('Error updating nominee:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/nominee/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchNominees();
      } else {
        console.error('Failed to delete nominee');
      }
    } catch (error) {
      console.error('Error deleting nominee:', error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Nominees Management</h1>
          <p className="text-sm text-gray-500">Manage and view nominees for the Addis Music Awards.</p>
        </div>
        <button
          className="bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-300"
          onClick={handleAddClick}
        >
          {editingNomineeId ? 'Update Nominee' : '+ Add New Nominee'}
        </button>
      </div>

      {showAddForm && (
        <div className="mt-8">
          <NomineeForm
            onPreview={handlePreview}
            onCancel={handleCancelClick}
            nominee={newNominee}
            setNominee={setNewNominee}
            onUpdate={handleUpdate}
            editingNomineeId={editingNomineeId}
          />
        </div>
      )}

      {showPreview && (
        <div className="mt-8">
          <NomineePreview nominee={newNominee} onPost={handlePost} onCancel={handleCancelClick} />
        </div>
      )}

      {!showAddForm && !showPreview && (
        nominees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nominees.map((nominee) => (
              <div
                key={nominee._id}
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
                    {nominee.categories.map((cat, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-700">{cat.category}</span>
                        <span className="text-sm font-semibold text-gray-800">{cat.artists.length}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      className="text-sm text-red-600 font-semibold hover:underline"
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
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">No Data Available</p>
        )
      )}
    </div>
  );
}

function NomineeForm({ onPreview, onCancel, nominee, setNominee, onUpdate, editingNomineeId }) {
  const [round, setRound] = useState(nominee?.round || '');
  const [stage, setStage] = useState(nominee?.stage || '');
  const [categories, setCategories] = useState(nominee?.categories || [{ category: '', artists: [{ name: '', smsNumber: '' }] }]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const handleAddCategory = () => {
    setCurrentCategoryIndex(categories.length);
    setCategories([...categories, { category: '', artists: [{ name: '', smsNumber: '' }] }]);
  };

  const handleCategoryChange = (field, value) => {
    const updatedCategories = [...categories];
    updatedCategories[currentCategoryIndex][field] = value;
    setCategories(updatedCategories);
  };

  const handleAddArtist = () => {
    const updatedCategories = [...categories];
    updatedCategories[currentCategoryIndex].artists.push({ name: '', smsNumber: '' });
    setCategories(updatedCategories);
  };

  const handleArtistChange = (artistIndex, field, value) => {
    const updatedCategories = [...categories];
    updatedCategories[currentCategoryIndex].artists[artistIndex][field] = value;
    setCategories(updatedCategories);
  };

  const handlePreviewClick = (event) => {
    event.preventDefault();
    onPreview({ round, stage, categories });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingNomineeId) {
      onUpdate({ ...nominee, round, stage, categories });
    } else {
      onPreview({ round, stage, categories });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      {categories.map((cat, index) => {
        if (index === currentCategoryIndex) {
          return (
            <div key={index} className="mb-6 border p-4 rounded-md shadow-sm">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={cat.category}
                  onChange={(e) => handleCategoryChange('category', e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-red-500 focus:border-red-500"
                />
              </div>
              {cat.artists.map((artist, artistIndex) => (
                <div key={artistIndex} className="flex space-x-4 mb-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Artist Name</label>
                    <input
                      type="text"
                      placeholder="Artist Name"
                      value={artist.name}
                      onChange={(e) => handleArtistChange(artistIndex, 'name', e.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">SMS Number</label>
                    <input
                      type="text"
                      placeholder="SMS Number"
                      value={artist.smsNumber}
                      onChange={(e) => handleArtistChange(artistIndex, 'smsNumber', e.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddArtist}
                className="text-sm text-red-600 hover:underline mt-2"
              >
                + Add Artist
              </button>
            </div>
          );
        }
        return null;
      })}
      {currentCategoryIndex < categories.length && (
        <button
          type="button"
          onClick={handleAddCategory}
          className="text-sm text-red-600 hover:underline mt-4"
        >
          + Add Category
        </button>
      )}
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
    </form>
  );
}

function NomineePreview({ nominee, onPost, onCancel }) {
  return (
    <div className="space-y-6">
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
    </div>
  );
}

export default Nominees;