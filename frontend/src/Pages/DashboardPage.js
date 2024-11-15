

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utils/constant';
import EditCarModal from '../Components/EditCarModal'; 
import AddCarModal from '../Components/AddCarModal'; 

const DashboardPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]); 
  const [error, setError] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); 
      }

      const response = await axios.get(`${baseUrl}/api/cars/usercars`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setCars(response.data.cars);
      setFilteredCars(response.data.cars); 
    } catch (err) {
      setError('Failed to load cars. Please try again.');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    const lowerCaseQuery = query.toLowerCase();

    const filtered = cars.filter((car) => {
      return (
        (car.title && car.title.toLowerCase().includes(lowerCaseQuery)) ||
        (car.description && car.description.toLowerCase().includes(lowerCaseQuery)) ||
        (car.tags &&
          car.tags.some((tag) =>
            tag.toLowerCase().includes(lowerCaseQuery)
          ))
      );
    });

    setFilteredCars(filtered);
  };

  const handleDeleteCar = async (carId) => {
    try {
      await axios.delete(`${baseUrl}/api/cars/car/${carId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchCars(); 
    } catch (err) {
      setError('Error deleting the car.');
    }
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setShowEditModal(true);
  };

  const handleAddNewCar = () => {
    setShowAddModal(true);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Dashboard</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search cars by title, description, or tags"
            className="py-2 px-4 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-6">
          <button
            onClick={handleAddNewCar} 
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add New Car
          </button>
        </div>

        {filteredCars.length === 0 ? (
          <p className="text-gray-600">No cars found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div
                key={car._id}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
              >
                <div className="cursor-pointer" onClick={() => navigate(`/cardetails/${car._id}`)}>
                  {car && car.images && car.images.length > 0 && (
                    <img
                      src={car.images[0]} 
                      alt={car.title || 'Car image'} 
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}

                  <h3 className="text-xl font-semibold text-gray-700">
                    {car?.title || 'Untitled Car'} 
                  </h3>
                  <p className="text-gray-600">{car?.description || 'No description available'}</p>
                  <p className="text-lg font-bold text-gray-800">${car?.price || 'Price unavailable'}</p>

                  {car?.tags && car.tags.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Tags: </span>
                      <div className="flex flex-wrap gap-2">
                        {car.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handleEditCar(car)} 
                    className="py-1 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Quick Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car._id)}
                    className="py-1 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditModal && (
        <EditCarModal
          car={selectedCar}
          onClose={() => setShowEditModal(false)} 
          onUpdate={fetchCars} 
        />
      )}

      {showAddModal && (
        <AddCarModal
          onClose={() => setShowAddModal(false)} 
          onAdd={fetchCars} 
        />
      )}
    </div>
  );
};

export default DashboardPage;
