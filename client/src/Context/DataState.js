import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DataContext = createContext();
const DataProvider = ({ children }) => {
  const BASE_URL = "http://localhost:3001/";
  const [loginError, setLoginError] = useState('');
  const [loginEmailError, setLoginEmailError] = useState(false);
  const [loginModal, setIsModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [logout, setLogout] = useState(false);
  const [profile, setProfile] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [passModal, setIsPassModal] = useState(false)
  const [userList , setAllUserList] = useState([])
  const navigate = useNavigate()

 

  //                                                  Login API
  const LoginApi = (state) => {

    setLoginError('');
    setLoginEmailError('');
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "email": state.email,
      "password": state.password,
    });
    console.log(raw)
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${BASE_URL}portal/login`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          setLoggedIn(true)
          toast.success(result.message)
          setProfile(result.result)
          localStorage.setItem("Token", JSON.stringify(result.token));
          
          if(result.result.role === 'Staff')
          setTimeout(() => {
            navigate('/users')
          }, 2000)
         
          if(result.result.role === 'User')
          setTimeout(() => {
            navigate('/updateProfile')
          }, 2000)

        }
        else if (result.statusCode === 401) {
          setLoginError(result.message)
        }
        else if (result.statusCode === 404) {
          setLoginEmailError(result.message)
        }
        else if (result.message === "TOKEN_EXPIRED" || result.message === "INVALID_TOKEN") {
          toast.error('Token Expired,Login Again!')
          navigate("/");
          setLogout(false);
          setLoggedIn(false)
          localStorage.removeItem("Token");
        }

      })
      .catch(error => console.log('error', error));
  };

  const AddUser = (state) => {

    
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "email": state.email,
      "password": state.password,
      "Name":state.Name
    });
    console.log(raw)
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${BASE_URL}portal/register`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          setLoggedIn(true)
          setProfile(result.Result)
          localStorage.setItem("Token", JSON.stringify(result.token));
          toast.success(result.message)
          if(result.Result.role === 'Staff')
          setTimeout(() => {
            navigate('/users')
          }, 500)
         
          if(result.Result.role === 'User')
          setTimeout(() => {
            navigate('/updateProfile')
          }, 500)

        }
        else if (result.statusCode === 401) {
          setLoginError(result.message)
        }
        else if (result.statusCode === 404) {
          setLoginEmailError(result.message)
        }
        else if (result.message === "TOKEN_EXPIRED" || result.message === "INVALID_TOKEN") {
          toast.error('Token Expired,Login Again!')
          navigate("/");
          setLogout(false);
          setLoggedIn(false)
          localStorage.removeItem("Token");
        }

      })
      .catch(error => console.log('error', error));
  };

  const Users = (params) => {
    var myHeaders = new Headers();
    const Token = JSON.parse(localStorage.getItem('Token'))
    myHeaders.append("token", Token);
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    if(params){
      fetch(BASE_URL + `portal/users?key=${params}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          setAllUserList(result.Result);

        }
      })
      .catch((error) => console.log("error", error));
    }
    else{
      fetch(BASE_URL + `portal/users`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          setAllUserList(result.Result);
        }
      })
      .catch((error) => console.log("error", error));
    }
  };


  const updateProfile = state => {
    var myHeaders = new Headers();
    const Token = JSON.parse(localStorage.getItem('Token'))
    myHeaders.append("token", Token);
    var formdata = new FormData();
    formdata.append("linkedln_profile", state.linkedln_profile);
    formdata.append("facebook_profile", state.facebook_profile);
    formdata.append("twitter_profile", state.twitter_profile);
    formdata.append("designation", state.designation);
    formdata.append("biography", state.biography);
    formdata.append("organization", state.organization);
    formdata.append("image", state.image)
    formdata.append("file", state.file)
    formdata.append("phone", state.phone)
    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(`${BASE_URL}portal/updateProfile/${state._id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          setProfile(result.result)
          toast.success("Succesfully Updated Profile")
          setTimeout(() => {
            navigate('/thankyou')
          }, 2000)
         
        }
        else if (result.message === "TOKEN_EXPIRED" || result.message === "INVALID_TOKEN") {
          toast.error('Token Expired,Login Again!')
          navigate("/");
          setLogout(false);
          setLoggedIn(false)
          localStorage.removeItem("Token");
          localStorage.removeItem("devicetoken");
        }
        else
          toast.error(result.message)

      })
      .catch(error => console.log('error', error));
  }






  return (
    <DataContext.Provider
      value={{
        updateProfile,
        LoginApi,
        setLoginError,
        loginError,
        setLoginEmailError,
        loginEmailError,
        loginModal,
        setIsModal,
        loggedIn,
        setLoggedIn,
        logout,
        setLogout,
        profile,
        setProfile,
        isOpen,
        setIsOpen,
        passModal,
        userList , 
        setAllUserList,
        Users,
        AddUser

      }}
    >
      {children}
    </DataContext.Provider>
  );
};





export default DataProvider;


// New Build Updated Date 04/07/2023