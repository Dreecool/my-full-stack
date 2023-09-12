import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import WelcomeText from './pages/welcomePage';
import Register from './pages/registerPage';
import PrivateRoutes from './privateRoutes/privateRoute';

function App() {

  return (

    <>

      <BrowserRouter>

        <Routes>

          <Route path='/' element={<LoginPage/>}/>
          <Route path='/register' element={<Register/>}/>

          <Route  element={<PrivateRoutes/>}>

           <Route path='/welcome' element={<WelcomeText/>} exact/>

          </Route>

        </Routes>

      </BrowserRouter>

      
    </>

  );
}

export default App;
