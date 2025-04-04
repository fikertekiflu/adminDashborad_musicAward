import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faInfoCircle,
  faUsers,
  faMapMarkerAlt,
  faAward,
  faHandshake,
  faImages,
  faEnvelope,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onItemClick }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (id) => {
    setActiveItem(id);
    onItemClick(id);
  };

  return (
    <aside className="bg-gradient-to-b from-red-700 to-red-900 text-white w-64 h-screen flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-5 flex items-center border-b border-red-600">
        <img src="/logo.png" alt="Logo" className="h-8" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 mt-4">
        {[
          { id: 'dashboard', icon: faTachometerAlt, label: 'Dashboard' },
          { id: 'about', icon: faInfoCircle, label: 'About Us Information' },
          { id: 'nominees', icon: faUsers, label: 'Nominees Information' },
          { id: 'location', icon: faMapMarkerAlt, label: 'Location Information' },
          { id: 'previous-winners', icon: faAward, label: 'Previous Won Artists' },
          { id: 'sponsors', icon: faHandshake, label: 'Sponsors Information' },
          { id: 'gallery', icon: faImages, label: 'Gallery Images' },
          { id: 'contact', icon: faEnvelope, label: 'Contact Us Information' },
        ].map(({ id, icon, label }) => (
          <div
            key={id}
            onClick={() => handleItemClick(id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
              activeItem === id ? 'bg-white text-red-700 font-semibold' : 'hover:bg-red-600'
            }`}
          >
            <FontAwesomeIcon icon={icon} className="text-lg" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </nav>

      {/* Admin Info & Logout */}
      <div className="p-4 border-t border-red-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Profile Avatar */}
          <div className="bg-white text-red-700 font-bold w-10 h-10 flex items-center justify-center rounded-full">
            N
          </div>
          <div>
            <p className="text-sm font-semibold">Admin Name</p>
            <p className="text-xs opacity-70">admin@emailaccount.com</p>
          </div>
        </div>
        <button className="text-white hover:text-gray-300 transition-all">
          <FontAwesomeIcon icon={faPowerOff} size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
