const CarCard = ({ car, onEdit }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img
          src={car.images[0]}
          alt={car.title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold">{car.title}</h3>
        <p className="text-gray-600">{car.description}</p>
        <p className="text-xl font-bold text-blue-600">${car.price}</p>
        <div className="mt-4">
          <button
            onClick={onEdit}
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
      </div>
    );
  };
  
  export default CarCard;
  