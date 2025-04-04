import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaUpload, FaFolder, FaImage, FaTag, FaList, FaThLarge, FaTimes, FaCheck } from "react-icons/fa";

const GalleryManager = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragOver, setDragOver] = useState(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [view, setView] = useState("grid"); // 'grid' or 'list'
  const [filterTag, setFilterTag] = useState(null);

  // Load sample gallery data (Replace with API call later)
  useEffect(() => {
    setFolders([
      {
        id: "1",
        name: "Award Round 1",
        images: [
          { id: "1-1", url: "https://placehold.co/600x400", title: "Image 1-1", caption: "Caption 1-1", tags: ["award", "round1"] },
          { id: "1-2", url: "https://placehold.co/600x400", title: "Image 1-2", caption: "Caption 1-2", tags: ["music", "event"] },
        ],
      },
      {
        id: "2",
        name: "Award Round 2",
        images: [{ id: "2-1", url: "https://placehold.co/600x400", title: "Image 2-1", caption: "Caption 2-1", tags: ["winners"] }],
      },
    ]);
  }, []);

  // Handle Drag & Drop
  const handleDragEnter = (e, folderId) => {
    e.preventDefault();
    setDragOver(folderId);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(null);
  };
  const handleDrop = (e, folderId) => {
    e.preventDefault();
    setDragOver(null);
    handleImageUpload(e.dataTransfer.files, folderId);
  };

  // Upload Images
  const handleImageUpload = (newImages, folderId) => {
    const files = Array.from(newImages).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;

    const newImageObjects = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setUploadedImages([...uploadedImages, ...newImageObjects]);
    setSelectedFolderId(folderId);
  };

  // Remove Image
  const handleRemoveImage = (folderId, imageId) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, images: folder.images.filter((img) => img.id !== imageId) } : folder
      )
    );
  };

  // Create New Folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    setFolders([...folders, { id: `folder-${Date.now()}`, name: newFolderName, images: [] }]);
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  // Edit Image
  const handleEditImage = (folderId, imageId, newTitle, newCaption, newTags) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              images: folder.images.map((image) =>
                image.id === imageId ? { ...image, title: newTitle, caption: newCaption, tags: newTags } : image
              ),
            }
          : folder
      )
    );
  };

  const getAllTags = () => {
    const tags = new Set();
    folders.forEach((folder) => folder.images.forEach((img) => img.tags?.forEach((tag) => tags.add(tag))));
    return Array.from(tags);
  };
  const allTags = getAllTags();

  const filteredFolders = filterTag
    ? folders.map((folder) => ({ ...folder, images: folder.images.filter((img) => img.tags?.includes(filterTag)) }))
    : folders;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Gallery Management</h2>

      {/* Create Folder Button */}
      <button onClick={() => setIsCreatingFolder(true)} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
        <FaPlus className="mr-2" /> Create Folder
      </button>

      {/* Folder List */}
      <div className="mt-6 flex gap-4 flex-wrap">
        {filteredFolders.map((folder) => (
          <div
            key={folder.id}
            className="p-4 border rounded shadow-md w-64"
            onDragEnter={(e) => handleDragEnter(e, folder.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, folder.id)}
          >
            <h3 className="text-lg font-semibold flex items-center">
              <FaFolder className="mr-2" /> {folder.name}
            </h3>
            <div className="mt-4">
              {folder.images.length > 0 ? (
                <div className={view === "grid" ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}>
                  {folder.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img src={image.url} alt={image.title} className="w-full h-32 object-cover rounded" />
                      <button
                        onClick={() => handleRemoveImage(folder.id, image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No images uploaded</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Drag & Drop Upload */}
      {selectedFolderId && (
        <div
          className="mt-6 p-4 border-2 border-dashed border-gray-400 text-center cursor-pointer"
          onDrop={(e) => handleDrop(e, selectedFolderId)}
          onDragOver={(e) => e.preventDefault()}
        >
          <FaUpload className="text-2xl mx-auto mb-2" />
          <p>Drag & Drop Images Here</p>
        </div>
      )}

      {/* Folder Creation Modal */}
      {isCreatingFolder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="mt-4 flex justify-end">
              <button onClick={() => setIsCreatingFolder(false)} className="mr-2">Cancel</button>
              <button onClick={handleCreateFolder} className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
