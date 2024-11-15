const Car = require("../Models/Car");
const cloudinary = require("../Config/cloundinaryConfig");
// Create Car
// exports.createCar = async (req, res) => {
//   try {
//     const { title, description,price, tags, images } = req.body;
//     // Check image limit

//     console.log(title,description,price,tags,images)
//     const imageArray=Array.isArray(images)?images:[]

//     if(req.file){
//       const uploadResult=await cloudinary.uploader(req.file.path,{folder:'cars'})
//       images.push(uploadResult.secure_url)
//     }
//     if (imageArray.length > 10) {
//       return res.status(400).json({ message: 'Cannot add more than 10 images' });
//     }
//     const car = new Car({
//       userId: req.user.userId, // Assuming req.user contains decoded JWT with userId
//       title,
//       description,
//       tags,
//       price,
//       images:imageArray,
//     });
//     await car.save();

//     res.status(201).json({ message: 'Car created successfully', car });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating car', error: error.message });
//   }
// };

exports.createCar = async (req, res) => {
  try {
    const { title, description, price, tags } = req.body;

    console.log("FormData received:", req.body);
    console.log("Uploaded files:", req.files);

    const imageArray = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "cars",
        });
        imageArray.push(uploadResult.secure_url);
      }
    }

    if (imageArray.length > 10) {
      return res
        .status(400)
        .json({ message: "Cannot add more than 10 images" });
    }

    const car = new Car({
      userId: req.user.userId,
      title,
      description,
      tags,
      price,
      images: imageArray,
    });
    await car.save();

    res.status(201).json({ message: "Car created successfully", car });
  } catch (error) {
    console.error("Error creating car:", error);
    res
      .status(500)
      .json({ message: "Error creating car", error: error.message });
  }
};

exports.getUserCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.user.userId });
    res.status(200).json({ cars });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cars", error: error.message });
  }
};

exports.searchCars = async (req, res) => {
  try {
    const { keyword } = req.query;
    const cars = await Car.find({
      userId: req.user.userId,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ],
    });
    res.status(200).json({ cars });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching cars", error: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ car });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching car details", error: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { title, description, tags, images, price } = req.body;

    if (images && images.length > 10) {
      return res
        .status(400)
        .json({ message: "Cannot add more than 10 images" });
    }

    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, description, tags, images, price },
      { new: true }
    );
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ message: "Car updated successfully", car });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating car", error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting car", error: error.message });
  }
};

exports.getAllcars = async (req, res) => {
  try {
    const allCars = await Car.find();
    if (!allCars) {
      return res.status(404).json({ message: "Car not found" });
    }
    return res.status(200).json({ allCars });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting car", error: error.message });
  }
};

exports.deleteCarImage = async (req, res) => {
  try {
    const { carId, imageUrl } = req.body;

    if (!carId || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Car ID and Image URL are required" });
    }

    const car = await Car.findOne({ _id: carId, userId: req.user.userId });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const updatedImages = car.images.filter((image) => image !== imageUrl);

    car.images = updatedImages;
    await car.save();

    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`cars/${publicId}`);

    res.status(200).json({ message: "Image deleted successfully", car });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting image", error: error.message });
  }
};

exports.uploadCarImages = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = [];

    for (let file of files) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "cars",
      });

      imageUrls.push(uploadResult.secure_url);
    }

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { $push: { images: { $each: imageUrls } } },
      { new: true }
    );

    res
      .status(200)
      .json({
        message: "Images uploaded successfully",
        images: updatedCar.images,
      });
  } catch (error) {
    console.error("Error uploading images:", error);
    res
      .status(500)
      .json({ message: "Error uploading images", error: error.message });
  }
};
