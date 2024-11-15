import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/constant";

const AddCarModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    tags: "",
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 10) {
      setError("You can only upload up to 10 images");
      return;
    } else {
      setError("");
      setImages((prevImages) => [...prevImages, ...files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price) {
      setError("Please fill all the fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);

      formData.tags.split(",").map((tag) => data.append("tags[]", tag.trim()));

      images.forEach((image) => data.append("images", image));

      const response = await axios.post(`${baseUrl}/api/cars/createcar`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        onAdd();
        onClose();
      } else {
        setError("Failed to add car. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add car. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Car</h2>

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
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Images</label>

            {images.length < 10 && (
              <input
                type="file"
                name="images"
                onChange={handleFileChange}
                multiple
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            )}

            <div className="mt-2">
              {images.length > 0 && (
                <ul className="list-disc pl-4">
                  {images.map((image, index) => (
                    <li key={index}>{image.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <small className="text-gray-500">
              You can upload up to 10 images
            </small>
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
              Add Car
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal;
