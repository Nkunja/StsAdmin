import React, { useState } from 'react';
import './LandingPage.css';
import AddProduct from '../ICTDepartment/AddProducts/AddProducts';

export default function LandingPage() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);


  const handleDropdownClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setDropdownVisible(false); // Close the dropdown after clicking a menu item
  };

  return (
    <div className='landingpageContainer'>
      <div className='sidebar'>
        <div className='logo'>
          <img src='#' alt='logo' />
        </div>
        <div className='menulist'>
          <ul>
            <li onClick={handleDropdownClick}>ICT Department</li>
            {isDropdownVisible && (
              <div className='dropdown'>
                {/* Add dropdown menu items here */}
                <ul className='sublist'>
                <li onClick={() => handleMenuItemClick('Add Products')}>
                      Add Products
                    </li>
                  <li>Edit/Delete Products</li>
                </ul>
              </div>
            )}
            <li>Technical Department</li>
          </ul>
        </div>
        <div className='logout'>
          <button>Logout</button>
        </div>
      </div>
      <div className='mainbar'>
          {selectedMenuItem === 'Add Products' && <AddProduct />}
          {selectedMenuItem !== 'Add Products' && (
            <h1>WELCOME TO STS ADMIN DASHBOARD</h1>
          )}
      </div>
    </div>
  );
}
