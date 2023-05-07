import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecordView from './RecordView'
import UploadQuestion from './components/Mod1UploadQuestion'
import UploadQuestion2 from './components/Mod2UploadQuestion'
import ExpertDashboard from './components/ExpertDashboard'

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>                
            <Route path="/UploadQuestion" element={<UploadQuestion/>} />
            <Route path="/UploadQuestion2" element={<UploadQuestion2/>} />
            <Route path="/ExpertDashboard" element={<ExpertDashboard/>} />
            <Route path="/" element={<RecordView/>} />
          </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
