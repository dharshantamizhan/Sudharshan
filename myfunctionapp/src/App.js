import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import AdminUpload from './AdminUpload';
import ViewDetails from './ViewDetails';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
function App() {
  return (
    <div className="App">
       <BrowserRouter>
    <Routes>
      <Route path='/' Component={AdminUpload}/>
      <Route path='/ViewDetails' Component={ViewDetails}/>

    </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
