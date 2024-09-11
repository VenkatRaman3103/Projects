import BackendPage from 'pages/BackendPage';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/backend-page' element={<BackendPage />} />
      </Routes>
    </Router>
  );
}

export default App;
