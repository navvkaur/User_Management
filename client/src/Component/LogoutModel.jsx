import React, { useContext,useRef ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../src/Context/DataState";
import { ToastContainer } from "react-toastify";

const LogoutModal = () => {
    const navigate = useNavigate();
    let boxRef = useRef()
    const {  setLogout,setLoggedIn } = useContext(DataContext);
    const handleLogout = () => {
        navigate("/");
          setLogout(false);
          setLoggedIn(false)
        localStorage.removeItem("Token");
        localStorage.removeItem("devicetoken");

    }
    useEffect(() => {
        window.onclick = (event) => {
            
          if (event.target.contains(boxRef.current)
           ) {
                setLogout(false);
          } 
        }
      }, [setLogout]);
    
    return (
        <>
        <ToastContainer></ToastContainer>
            <div className="absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 w-full h-screen bg-[#00000062] z-[1]">
                <div className="fixed top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4" ref={boxRef}>
                    <div className="bg-white p-4 w-[400px] rounded z-10">

                        <div className=" flex gap-4">
                            <div className="text-[25px] sm:text-[23px] xs:text-[21px] font-semibold text-red-500" />
                            <span className="font-bold text-[18px] md:text-[17px] sm:text-[17px] pb-1">
                                Logout?
                            </span>
                        </div>
                        <div className="py-3">

                            <span className="text-[#475467] text-[14px] sm:text-[13px] xs:text-[12px]">
                                Are you sure you want to logout?
                            </span>
                        </div>
                        <div className="buttons flex gap-3 mt-6 xs:mt-4 sm:mt-5  w-full">
                            <button
                                className="rounded-md border border-[#D0D5DD] font-medium md:text-[13px] sm:text-[12px] xs:text-[11px] flex-1 p-[.4rem_1rem]"
                                onClick={() => {
                                    setLogout(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-theme-color flex-1 rounded-md font-medium md:text-[13px] sm:text-[12px] xs:text-[11px] text-white p-[.4rem_1rem]"
                                onClick={() => handleLogout()}
                            >
                                Logout
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default LogoutModal;