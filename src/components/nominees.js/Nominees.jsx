import React, { useState } from 'react';

function Nominees() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [nominees, setNominees] = useState([
    {
      id: 1,
      round: 'The 13th Nominees',
      created: '12/10/2024',
      status: 'Active',
      categories: [
        { category: 'Favorite Single of the Year', count: 28 },
        { category: 'Best Film of the Year', count: 28 },
        { category: 'Best Clip of the Year', count: 28 },
        { category: 'Best Actor of the Year', count: 28 },
        { category: 'Best Album of the Year', count: 28 },
        { category: 'Producer of the Year', count: 28 },
        { category: 'Best Actress of the Year', count: 28 },
      ],
    },
    {
      id: 2,
      round: 'The 12th Nominees',
      created: '12/10/2024',
      status: 'Active',
      categories: [
        { category: 'Favorite Single of the Year', count: 8 },
        { category: 'Best Film of the Year', count: 8 },
        { category: 'Best Clip of the Year', count: 8 },
        { category: 'Best Actor of the Year', count: 8 },
        { category: 'Best Album of the Year', count: 8 },
        { category: 'Producer of the Year', count: 8 },
        { category: 'Best Actress of the Year', count: 8 },
      ],
    },
    {
      id: 3,
      round: 'The 11th Nominees',
      created: '12/10/2024',
      status: 'Deactivated',
      categories: [
        { category: 'Favorite Single of the Year', count: 1 },
        { category: 'Best Film of the Year', count: 1 },
        { category: 'Best Clip of the Year', count: 1 },
        { category: 'Best Actor of the Year', count: 1 },
        { category: 'Best Album of the Year', count: 1 },
        { category: 'Producer of the Year', count: 1 },
        { category: 'Best Actress of the Year', count: 1 },
      ],
    },
  ]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancelClick = () => {
    setShowAddForm(false);
  };

  const handleAddNominee = (newNominee) => {
    setNominees([...nominees, { ...newNominee, id: Date.now() }]);
    setShowAddForm(false);
  };

  return (
    <div className="bg-gray-100 rounded-2xl shadow-lg p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Nominees Information</h1>
          <p className="text-sm text-gray-500">Admin &gt; Nominees Information</p>
        </div>
        <button
          className="bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-300"
          onClick={handleAddClick}
        >
          + Add New Nominee
        </button>
      </div>

      {/* Add Nominee Form */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showAddForm ? 'max-h-[600px]' : 'max-h-0'
        }`}
      >
        {showAddForm && <NomineeForm onAdd={handleAddNominee} onCancel={handleCancelClick} />}
      </div>

      {/* Nominee Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nominees.map((nominee) => (
          <div key={nominee.id} className="bg-white rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{nominee.round}</h2>
            <p className="text-sm text-gray-500 mb-4">Created at: {nominee.created}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Final</span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  nominee.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {nominee.status}
              </span>
            </div>
            <div className="space-y-3">
              {nominee.categories.map((cat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{cat.category}</span>
                  <span className="text-sm font-semibold text-gray-800">{cat.count}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button className="text-sm text-red-600 font-semibold hover:underline">Edit</button>
              <button className="text-sm text-red-600 font-semibold hover:underline">View Detail</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NomineeForm({ onAdd, onCancel }) {
  const [round, setRound] = useState('');
  const [categories, setCategories] = useState([{ category: '', nominees: [{ name: '' }] }]);

  const handleAddCategory = () => {
    setCategories([...categories, { category: '', nominees: [{ name: '' }] }]);
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = value;
    setCategories(updatedCategories);
  };

  const handleAddNominee = (categoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].nominees.push({ name: '' });
    setCategories(updatedCategories);
  };

  const handleNomineeChange = (categoryIndex, nomineeIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].nominees[nomineeIndex].name = value;
    setCategories(updatedCategories);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd({ round, categories });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Award Round</label>
        <input
          type="text"
          value={round}
          onChange={(e) => setRound(e.target.value)}
          className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Categories</label>
        {categories.map((cat, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <input
              type="text"
              placeholder="Category Name"
              value={cat.category}
              onChange={(e) => handleCategoryChange(categoryIndex, 'category', e.target.value)}
              className="p-3 border border-gray-300 rounded-md w-full mb-4 focus:ring-red-500 focus:border-red-500"
            />
            {cat.nominees.map((nominee, nomineeIndex) => (
              <div key={nomineeIndex} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Nominee Name"
                  value={nominee.name}
                  onChange={(e) => handleNomineeChange(categoryIndex, nomineeIndex, e.target.value)}
                  className="p-3 border border-gray-300 rounded-md flex-1 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddNominee(categoryIndex)}
              className="text-sm text-red-600 hover:underline"
            >
              + Add Nominee
            </button>
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
      <div className="flex justify-end space-x-6">
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
          Add Nominee
        </button>
      </div>
    </form>
  );
}

export default Nominees;