import logo from './logo.svg';
import './App.css';
import SignupPage from './Pages/SignupPage';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import CarDetailsPage from './Pages/CarDetails';

function App() {
  return (
    < >
    <Routes>
    <Route exact path="/" element={<SignupPage />}  />
    <Route exact path="/login" element={<LoginPage />}  />
    <Route exact path="/dashboard" element={<DashboardPage />}  />
    <Route exact path="/cardetails/:carId" element={<CarDetailsPage />}  />
    </Routes>
    </>
  );
}

export default App;
