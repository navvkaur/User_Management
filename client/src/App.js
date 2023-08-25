import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Login from "./Component/Login"
import DataProvider from "./Context/DataState";
import UserList from './Component/UserList';
import EditProfile from './Component/EditProfile';
import Register from "./Component/Register"
import ThankYou from './Component/ThankYou';

function App() {
  return (
    <>
    <Router>
      <DataProvider>

        <Routes>
          <Route exact path="/" element={<Login />} />   
          <Route exact path="/users" element={<UserList />} /> 
          <Route exact path="/register" element={<Register />} />   
          <Route exact path="/updateProfile" element={<EditProfile />} />   
          <Route exact path = "/thankyou" element = {<ThankYou/>} />
 
        </Routes>
      </DataProvider>
    </Router>
   
    </>
   
   
  );
}

export default App;
