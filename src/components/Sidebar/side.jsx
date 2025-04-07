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
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onItemClick }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (id) => {
    setActiveItem(id);
    onItemClick(id);
  };

  return (
    <aside className="bg-gradient-to-b from-red-700 to-red-900 text-white w-72 h-screen flex flex-col shadow-lg transition-all duration-300 ease-in-out">
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-center border-b border-red-600">
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-14 filter brightness-0 invert" // Adjusted logo size for balance
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 mt-8"> {/* Adjusted vertical margin */}
        {[
          { id: 'dashboard', icon: faTachometerAlt, label: 'Dashboard' },
          { id: 'about', icon: faInfoCircle, label: 'About Us' },
          { id: 'nominees', icon: faUsers, label: 'Nominees' },
          { id: 'location', icon: faMapMarkerAlt, label: 'Locations' },
          { id: 'previous-winners', icon: faAward, label: 'Winners' },
          { id: 'sponsors', icon: faHandshake, label: 'Sponsors' },
          { id: 'gallery', icon: faImages, label: 'Gallery' },
        ].map(({ id, icon, label }) => (
          <div
            key={id}
            onClick={() => handleItemClick(id)}
            className={`flex items-center gap-4 px-6 py-3 rounded-lg cursor-pointer transition-all mb-3 ${
              activeItem === id
                ? 'bg-white text-red-700 font-semibold'
                : 'hover:bg-red-600'
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
