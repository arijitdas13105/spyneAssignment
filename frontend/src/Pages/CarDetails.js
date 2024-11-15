import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/constant";

const CarDetailsPage = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    tags: [],
    images: [],
  });
  const navigate = useNavigate();

  const fetchCarDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${baseUrl}/api/cars/car/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCar(response.data.car);
      setFormData({
        title: response.data.car.title,
        description: response.data.car.description,
        price: response.data.car.price,
        tags: response.data.car.tags,
        images: response.data.car.images,
      });
    } catch (err) {
      setError("Failed to load car details. Please try again.");
    }
  };

  useEffect(() => {
    fetchCarDetails();
  }, [carId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTagChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      tags: value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handleImageDelete = async (imageUrl) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const data = {
        carId: carId,
        imageUrl: imageUrl,
      };

      const response = await axios.delete(
        `${baseUrl}/api/cars/car/${carId}/image`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: data,
        }
      );

      setFormData((prevState) => ({
        ...prevState,
        images: prevState.images.filter((image) => image !== imageUrl),
      }));

      fetchCarDetails();
    } catch (err) {
      setError("Failed to delete image. Please try again.");
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const formData = new FormData();
      Array.from(e.target.files).forEach((file) => {
        formData.append("images", file);
      });

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${baseUrl}/api/cars/car/${carId}/upload-images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...response.data.images],
      }));
    } catch (err) {
      setError("Failed to upload images. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put(`${baseUrl}/api/cars/car/${carId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCarDetails();
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update car details. Please try again.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!car) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        {/* Car Image */}
        {car.images && car.images.length > 0 && (
          <div className="mb-4">
            {car.images.map((image, index) => (
              <div key={index} className="relative inline-block mr-4">
                <img
                  src={image}
                  alt={`Car image ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <button
                  onClick={() => handleImageDelete(image)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Car Title"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Car Description"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Price"
            />
            <input
              type="text"
              name="tags"
              value={formData.tags.join(", ")}
              onChange={handleTagChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Tags (comma separated)"
            />

            {/* Image Upload */}
            <input
              type="file"
              onChange={handleImageUpload}
              multiple
              className="mb-4"
            />

            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {car.title || "Untitled Car"}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {car.description || "No description available"}
            </p>
            <p className="text-2xl font-semibold text-gray-800 mb-4">
              ${car.price || "Price unavailable"}
            </p>

            {/* Tags */}
            {car.tags && car.tags.length > 0 && (
              <div className="mb-4">
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

            <button
              onClick={() => setIsEditing(true)}
              className="py-2 px-4 bg-yellow-500 text-white rounded-md mt-6"
            >
              Edit Car Details
            </button>
          </>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="py-2 px-4 bg-gray-500 text-white rounded-md mt-6"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CarDetailsPage;
