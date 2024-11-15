import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../utils/constant";

const EditCarModal = ({ car, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: car.title,
    description: car.description,
    price: car.price,
    images: car.images || [],
    tags: car.tags || [],
  });
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setFormData({
      title: car.title,
      description: car.description,
      price: car.price,
      images: car.images || [],
      tags: car.tags || [],
    });
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await axios.put(
        `${baseUrl}/api/cars/car/${car._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate();
      onClose();
    } catch (err) {
      setError("Failed to update car. Please try again.");
    }
  };

  const handleTagInputChange = (e) => {
    const inputValue = e.target.value;
    setTagInput(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === ",") {
      e.preventDefault();
      const newTags = [...formData.tags, tagInput.trim()];
      setFormData({
        ...formData,
        tags: newTags,
      });
      setTagInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Car</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Tags</label>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter tags, separated by commas"
            />
            <div className="mt-2">
              <p className="text-gray-500">Current Tags:</p>
              <ul className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <li key={index} className="bg-gray-200 p-2 rounded-md">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCarModal;
