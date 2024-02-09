import logo from './logo.svg';
import './App.css';
import Login from './Screens/Login/Login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import LandingPage from './Screens/LandingPage/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={< Login />} />
        <Route path='/landingpage' element={< LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
