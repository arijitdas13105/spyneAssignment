const express = require('express');
const { uploadCarImages,deleteCarImage,getAllcars,createCar, getUserCars, searchCars, getCarById, updateCar, deleteCar } = require('../Controllers/carController');
const authenticateUser = require('../Middleware/authMiddleware');
const upload = require('../Middleware/upload');

const router = express.Router();

router.post('/createcar', upload.array('images',10) ,authenticateUser, createCar);
router.get('/usercars', authenticateUser, getUserCars);
router.get('/car/:id', authenticateUser, getCarById);
router.put('/car/:id', authenticateUser, updateCar);
router.delete('/car/:id', authenticateUser, deleteCar);
router.get('/allcars', getAllcars);
router.delete('/car/:id/image', authenticateUser, deleteCarImage);
router.post('/car/:id/upload-images', upload.array('images', 10), authenticateUser, uploadCarImages);

module.exports = router;
