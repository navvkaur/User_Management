import React, { useContext, useState } from "react";
import { DataContext } from "../../src/Context/DataState";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { LoginApi, loginEmailError, loginError } = useContext(DataContext)
  const [isVisible, setVisible] = useState(false);
  const [state, setState] = useState({
    email: '',
    password: ''
  })
  const buttonDisabled = (state.email !== '' && state.password !== '')
  const navigate = useNavigate()
  const validEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  

  const validateEmail = () => {
    if (!validEmail.test(state.email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const validatepassword = () => {
    if (state.password === "") {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

  } 
  const toggle = () => {
    setVisible(!isVisible);
  };
  

  return (
    <>
      <ToastContainer></ToastContainer>                                                                   
      <div className="relative w-full h-screen bg-cover bg-center bg-no-repeat  wrapper-bg" >
        <div className="absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 w-full h-screen rounded-mg bg-[#00000062] z-[1]">
          <div className="fixed top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4">
            <div className="bg-white p-4 w-[540px] rounded-lg z-10">
              <div className="m-1 mb-5">
                <span className="font-Sans font-semibold  leading-7 text-[#202223] text-[21px]" > Welcome to </span>
                <span className="font-Sans font-semibold  leading-7 text-[#25a451] text-[21px]" > USER PORTAL </span>
              </div>
              <span className="font-Sans font-medium text-[55px] leading-7 text-[#131212]" > Sign In </span>
              <form>
                <div className="mt-6">

                  <label htmlFor="email" className="font- font-normal  leading-5 text-[#202223] text-[14px] ">Email
                    <input type="text" id="email" placeholder=" Enter your Email" className="w-full px-3 h-10 border rounded focus-visible:border-inputBorder focus-visible:outline-none focus-visible:shadow-focusshadow focus-visible:border-1" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })}
                      onKeyUp={() => { validateEmail() }} />
                    {emailError && (
                      <span className="text-left text-red-600 text-[10px] ">
                        Please Enter a valid Email
                      </span>
                    )}
                  </label>

                </div>
                <div className="m-auto text-left  ">
                  <span className="text-red-600 text-[10px]">{loginEmailError}</span>
                </div>

                <div className="mt-6">
                  <label htmlFor="password" className="font-Sans font-normal  leading-5 text-[#202223] text-[14px]">Password</label>
                  <div className="relative">
                    <input type={isVisible ? "text" : "password"} id="password" placeholder=" Enter your Password" className="w-full px-4 h-10 border rounded focus-visible:border-inputBorder focus-visible:outline-none focus-visible:shadow-focusshadow focus-visible:border-1" value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })}
                      onKeyUp={() => { validatepassword() }}
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" onClick={() => toggle()}>
                      {isVisible ? <AiOutlineEye color="#25a451" /> : <AiOutlineEyeInvisible color="#25a451" />}
                    </span>
                  </div>
                  <div className="m-auto text-left ">
                    {passwordError && (
                      <span className="text-red-600 text-[10px] ">
                        Please Enter a valid Password
                      </span>
                    )
                    }
                  </div>
                </div>
                <div className="m-auto text-left  ">
                  <span className="text-red-600 text-[10px]">{loginError}</span>
                </div>
                <button type="button" className="bg-theme mt-3 w-full h-10 flex-1 rounded-4 font-medium md:text-[13px] sm:text-[12px] xs:text-[11px] text-white p-[.4rem_1rem] " disabled={!buttonDisabled}
                  onClick={(e) => { e.preventDefault(); LoginApi(state) }}
                >
                  LOGIN
                </button>
              </form>
              <a  href={() => false} className="mt-3 text-xs text-black  gap-1 ml-32  hover:underline hover:text-[#25a451] item-justify" onClick={(e) => { navigate('/register') }}>  Dont have an Account! Register Here</a>

            </div>
          </div>
        </div>


      </div>
    </>

  )
}

export default Login;