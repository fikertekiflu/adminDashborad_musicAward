import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Trash2, Edit, ChevronDown } from "react-feather";

const LEVELS = ["Platinum", "Gold"];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const SponsorRow = ({ sponsor, handleEdit, handleDelete, setMenuOpen, menuOpen }) => {
  return (
    <motion.tr variants={itemVariants} className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-4">
        {sponsor.logo && (
          <img
            src={sponsor.logo}
            alt="Logo"
            className="w-16 h-16 rounded-md object-cover border border-gray-200"
          />
        )}
      </td>
      <td className="p-4">
        <input
          type="text"
          value={sponsor.name}
          onChange={(e) => handleEdit(sponsor.id, "name", e.target.value)}
          className="border p-2 rounded-md text-gray-800 w-full focus:ring-2 focus:ring-red-500 transition-all duration-300"
        />
      </td>
      <td className="p-4 font-medium text-gray-700">{sponsor.level}</td>
      <td className="p-4">
        <textarea
          value={sponsor.description}
          onChange={(e) => handleEdit(sponsor.id, "description", e.target.value)}
          className="border p-2 rounded-md text-gray-800 w-full focus:ring-2 focus:ring-red-500 transition-all duration-300"
        />
      </td>
      <td className="p-4 text-center relative">
        <button
          onClick={() => setMenuOpen(menuOpen === sponsor.id ? null : sponsor.id)}
          className="focus:outline-none"
        >
          <MoreVertical className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
        </button>
        <AnimatePresence>
          {menuOpen === sponsor.id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 bg-white shadow-lg rounded-md p-2 mt-2 w-36 z-10 border border-gray-200"
            >
              <div
                onClick={() =>
                  handleEdit(
                    sponsor.id,
                    "name",
                    prompt("Edit Name", sponsor.name)
                  )
                }
                className="block text-blue-600 hover:bg-gray-100 py-2 px-4 rounded-md flex items-center cursor-pointer transition-colors"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </div>
              <div
                onClick={() => handleDelete(sponsor.id)}
                className="block text-red-600 hover:bg-gray-100 py-2 px-4 rounded-md flex items-center cursor-pointer transition-colors"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
};

const SponsorsPage = () => {
  const [sponsors, setSponsors] = useState(() => {
    const saved = localStorage.getItem("sponsors");
    return saved ? JSON.parse(saved) : [];
  });
  const [filteredLevel, setFilteredLevel] = useState("");
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    description: "",
    logo: "",
    level: "Platinum",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const fileInputRef = useRef(null);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false); // State for custom dropdown

  useEffect(() => {
    localStorage.setItem("sponsors", JSON.stringify(sponsors));
  }, [sponsors]);

  const handleLogoUpload = (e, id) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const logo = event.target.result;
      if (id) {
        setSponsors((prev) =>
          prev.map((s) => (s.id === id ? { ...s, logo } : s))
        );
      } else {
        setNewSponsor((prev) => ({ ...prev, logo }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSponsor = () => {
    if (!newSponsor.name || !newSponsor.description || !newSponsor.logo) {
      return alert("Please fill all fields and upload a logo.");
    }
    const newEntry = { ...newSponsor, id: Date.now().toString() };
    setSponsors([...sponsors, newEntry]);
    setNewSponsor({ name: "", description: "", logo: "", level: "Platinum" });
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    setSponsors((prev) => prev.filter((s) => s.id !== id));
    setMenuOpen(null); // Close menu after deleting
  };

  const handleEdit = (id, field, value) => {
    setSponsors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
    setMenuOpen(null); // Close menu after editing
  };

  // Custom dropdown handler
  const handleLevelSelect = (level) => {
    setNewSponsor({ ...newSponsor, level });
    setIsLevelDropdownOpen(false);
  };
    const filteredSponsors = sponsors.filter((s) =>
    filteredLevel ? s.level === filteredLevel : true
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Sponsors Management
        </h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition-colors duration-300 shadow-md"
        >
          {isAdding ? "Cancel" : "Add Sponsor"}
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        {/* Custom dropdown for level filtering */}
        <div className="relative inline-block text-left">
          <div>
            <button
              onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
              type="button"
              className="w-56 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-between"
              id="level-select-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              {filteredLevel ? (
                <span className="truncate">{filteredLevel}</span>
              ) : (
                <span className="text-gray-500 truncate">Filter by Level</span>
              )}
              <ChevronDown
                className="ml-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </button>
          </div>

          <AnimatePresence>
            {isLevelDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="level-select-button"
              >
                <div className="py-1" role="none">
                  <button
                    onClick={() => {
                      setFilteredLevel("");
                      setIsLevelDropdownOpen(false);
                    }}
                    className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 transition-colors"
                    role="menuitem"
                  >
                    All Levels
                  </button>
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setFilteredLevel(level);
                        setIsLevelDropdownOpen(false);
                      }}
                      className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 transition-colors"
                      role="menuitem"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Sponsor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Sponsor Name"
                  value={newSponsor.name}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, name: e.target.value })
                  }
                  className="mt-1 p-2 border rounded-md text-gray-800 w-full focus:ring-2 focus:ring-red-500 transition-all duration-300 shadow-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="level"
                  className="block text-sm font-medium text-gray-700"
                >
                  Level
                </label>
                <select
                  id="level"
                  value={newSponsor.level}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, level: e.target.value })
                  }
                  className="mt-1 p-2 border rounded-md text-gray-800 w-full focus:ring-2 focus:ring-red-500 transition-all duration-300 shadow-sm"
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Sponsor Description"
                  value={newSponsor.description}
                  onChange={(e) =>
                    setNewSponsor({
                      ...newSponsor,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border rounded-md text-gray-800 w-full focus:ring-2 focus:ring-red-500 transition-all duration-300 shadow-sm"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="logo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Logo
                </label>
                <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md py-8 cursor-pointer hover:border-red-500 transition-colors">
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo"
                    className="text-gray-600 cursor-pointer flex items-center"

                  >

                    <span className="font-medium">
                      Click to upload or drag and drop
                    </span>
                  </label>
                </div>
                {newSponsor.logo && (
                  <img
                    src={newSponsor.logo}
                    alt="Logo Preview"
                    className="w-24 mt-4 rounded-md"
                  />
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAddSponsor}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition-colors duration-300 shadow-md"
              >
                Save Sponsor
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Logo
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Level
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredSponsors.map((sponsor) => (
                <SponsorRow
                  key={sponsor.id}
                  sponsor={sponsor}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  setMenuOpen={setMenuOpen}
                  menuOpen={menuOpen}
                />
              ))}
            </motion.div>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SponsorsPage;

