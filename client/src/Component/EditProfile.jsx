import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../Context/DataState";
 import LogoutModal from "./LogoutModel";
import dummyimage from "../assets/dummyimage.png";
import { BiSolidPencil } from "react-icons/bi"
import { AiOutlineFilePdf } from 'react-icons/ai'
import './EditProfile.css'
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
const Register = () => {
  const navigate = useNavigate()
  const { profile, logout, updateProfile } = useContext(DataContext);
  const [attachmentError, setAttachmentError] = useState(false)
  const [imageName, setImageName] = useState("")
  const [phoneError, setPhoneError] = useState(false)
  const [state, setState] = useState({});
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const regex = new RegExp(/^[0-9\b]+$/);

  useEffect(() => {
    let user = localStorage.getItem('Token')
    if (!user) {
      toast.error('You are not Logged In!', {
        toastId: 'error1',
      })
      navigate('/')
    }
    setState({ ...profile })
    if (profile?.file) {
      let url = profile.file.split('/');
      let updated_url = url[url.length - 1]
      setImageName(updated_url.split('.')[0])
    }


  }, [navigate,profile]);
  const handleValidatePhone = () => {
    if (!regex.test(state.phone) || state.phone.length !== 10) {
      setPhoneError(true);
    } else {

      setPhoneError(false);
    }

  }
 
  const onSelect = (e) => {
    const allowedExtensions = ['pdf'];

    function isFileExtensionAllowed(fileName, allowedExtensions) {
      const fileExtension = fileName?.substring(fileName.lastIndexOf('.') + 1);
      return allowedExtensions.some(extension => extension === fileExtension);
    }
    const isAllowed = isFileExtensionAllowed(e.target.files[0].name, allowedExtensions);
    if (isAllowed) {
      setAttachmentError(false)
    }
    else {
      setAttachmentError("Only pdf file format are supported - jpg,jpeg or png")
    }
    setState({ ...state, file: e.target.files[0] })
  };
  
  const handleUpdate = () => {
    if (state?.phone === undefined)
      toast.error('Phone Number is required!', {
        toastId: 'error2',
      })
    else if (state?.designation === undefined)
      toast.error('Designation is required!', {
        toastId: 'error3',
      })
    else if (state?.organization === undefined)
      toast.error('Tell about your Organization!', {
        toastId: 'error4',
      })
    else if (state?.image === "" && state?.file === "")
      toast.error('Image and resume are required!', {
        toastId: 'error5',
      })
    else
      updateProfile(state);

  }
  const onImageChange = (event) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    function isFileExtensionAllowed(fileName, allowedExtensions) {
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      return allowedExtensions.some(extension => extension === fileExtension);
    }
    const isAllowed = isFileExtensionAllowed(event.target.files[0].name, allowedExtensions);

    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }

    if (!isAllowed) {
      setImageError('Please select valid image format.');
      return false;
    }

    if ((event.target.files[0].size) && (event.target.files[0].size) / 1024 > 1024) {
      setImageError("Please select image less than 1 mb")
    }
    else {
      setImageError(false);
      setState({ ...state, image: event.target.files[0] });

    }

  };

  return (
    <>

      {logout ? <LogoutModal /> : ""}
      <ToastContainer></ToastContainer>
      <>
        <section className="min-h-screen">
          <div className=" relative w-full h-[250px] px-28 py-24 gap-11  bg-cover bg-center bg-no-repeat wrapper-bg" >
            <form>
              <label for="fileToUpload">
                <div class="profile-pic" style={{ backgroundImage: `url(${state?.image ? (image ? (image) : (state.image)) : (dummyimage)})` }} >
                  <span class="glyphicon glyphicon-camera"></span>
                  <span><BiSolidPencil /></span>
                </div>
              </label>
              <input type="File" name="fileToUpload" class="fileToUpload" id="fileToUpload" onChange={(e) => onImageChange(e)} />
              {imageError && (
                <span className="text-left text-red-600 text-[10px] ">
                  {imageError}
                </span>
              )}
            </form>
          </div>
          <section className="px-24 py-8 bg-white">
            <p className="absolute top-[16rem] left-[18rem] text-[32px] font-semibold leading-6 z-10 ">{state.Name} </p>
            <p className="absolute left-[18rem] pt-2"> <a href={() => false} className="hover:underline hover:text-[#FF8531]">{state.email} </a></p>
            <div className='flex space-x-10'>
              <div className='w-1/2 space-y-3 pt-12'>
                <h2 className='font-semibold'>Profile details</h2>
                <hr />
                <form >
                  <label className='text-sm px-1 font-semibold pb-1'>Full Name*</label>
                  <input type='text ' disabled className='w-full border dark:border-theme py-1 px-3 placeholder-[#4B4B4B] shadow-sm rounded-md  focus-visible:border-[#25a451]  focus-visible:outline-none  focus-visible:shadow-focusshadow focus-visible:border-1' value={state.Name} />
                  <div className="flex space-x-5">
                    <div className="w-1/2 ">
                      <label htmlFor="organization" className="pt-2 px-1 text-sm font-semibold text-[#202223] pb-1">Organization Name*</label>
                      <input
                        type="text" id="organization" value={state.organization} onChange={(e) => setState({ ...state, organization: e.target.value })}
                        className="w-full border  py-1 px-3 placeholder-[#4B4B4B] dark:border-theme shadow-sm rounded-md  focus-visible:border-[#25a451]  focus-visible:outline-none  focus-visible:shadow-focusshadow focus-visible:border-1"
                      />
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="designation" className="pt-2  px-1 text-sm font-semibold text-[#202223]  pb-1">Designation*</label>
                      <input
                        type="text" id="designation" value={state.designation} onChange={(e) => setState({ ...state, designation: e.target.value })}
                        className="w-full border  py-1 px-3 placeholder-[#4B4B4B] dark:border-theme shadow-sm rounded-md  focus-visible:border-[#25a451]  focus-visible:outline-none  focus-visible:shadow-focusshadow focus-visible:border-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="biography" className='pt-4 text-sm font-semibold pb-1 '>About You</label>
                    <textarea
                      type="text" id="biography" value={state.biography} onChange={(e) => setState({ ...state, biography: e.target.value })}
                      className="w-full border py-1 px-3 h-24  placeholder-[#4B4B4B]  dark:border-theme shadow-sm rounded-md  focus-visible:border-[#25a451]  focus-visible:outline-none  focus-visible:shadow-focusshadow focus-visible:border-1"></textarea>               <p className='text-sm text-gray-500'> Provide some details about the yourself, achievements and presentation goals.</p>
                  </div>
                  <label className='text-sm px-1 font-semibold pb-1'>Resume*</label>
                  <input onChange={(e) => { onSelect(e) }} class="block w-full text-sm text-white border border-theme rounded-lg cursor-pointer bg-theme dark:text-theme focus:outline-none dark:bg-white dark:border-theme dark:placeholder-theme py-1 px-3" id="file_input" type="file" />
                  <div className="flex">
                    {(typeof (state.file) == 'string' && state.file !== "") && !attachmentError ? (
                      <>
                        <AiOutlineFilePdf data-te-toggle="tooltip"
                          title={imageName} className="cursor-pointer hover-text " size={50} /><br />
                      </>
                    ) : ("")}
                    {typeof (state.file) == 'object' && !attachmentError ? (
                      <AiOutlineFilePdf size={70} />
                    ) : ("")}
                  </div>
                  {
                    attachmentError ? <small className="text-danger" style={{ fontSize: "10px", color: 'red' }}>{attachmentError}</small> : null
                  }
                </form>
              </div>
              <div className='w-1/2 space-y-3 pt-12'>
                <h2 className='font-semibold'>Others </h2>
                <hr />
                <div>
                  <label htmlFor="email" className='pt-4 text-sm font-semibold pb-1'>Account Email*</label>
                  <input type="text" id="email" disabled value={state.email} className='w-full   border  border-theme py-1 px-3 placeholder-[#4B4B4B] shadow-sm rounded-md  focus-visible:border-[#25a451]  focus-visible:outline-none  focus-visible:shadow-focusshadow focus-visible:border-1' />
                  <p className='text-sm text-gray-500 '> Provide some details about the yourself, achievements and presentation goals.</p>
                </div>
                <div>
                  <label htmlFor="phone" className='pt-4 text-sm font-semibold pb-1'>Contact Number*</label>
                  <input type="text" id="phone" onKeyUp={() => { handleValidatePhone() }} value={state.phone} className='w-full   border  border-theme py-1 px-3 placeholder-[#4B4B4B] shadow-sm rounded-md  focus-visible:border-[#25a451]  focus-visible:outline-none  focus-visible:shadow-focusshadow focus-visible:border-1' onChange={(e) => setState({ ...state, phone: e.target.value })} />
                  {phoneError && (
                    <span className="text-left text-red-600 text-[10px] ">
                      {"Enter Valid Phone Number"}
                    </span>
                  )}
                </div>
                <h2 className='pt-3 font-semibold'>Social Details </h2>
                <hr />
                <table >
                  <tr className="rounded-md border-theme">
                    <td className=' border-theme border  py-1 px-3 placeholder-[#4B4B4B] shadow-sm  text-sm  '>
                      <label htmlFor="twitter" className='pt-4 text-sm font-semibold pb-1'>twitter.com/ </label></td>
                    <td className="border border-theme">
                      <input type="text" id="twitter" value={state.twitter_profile} onChange={(e) => setState({ ...state, twitter_profile: e.target.value })} className=' placeholder-[#4B4B4B] border-theme shadow-sm  focus-visible:border-[#25a451]  focus-visible:outline-none  focus-visible:shadow-focusshadow focus-visible:border-1' />
                    </td>
                  </tr>
                </table>
                <table >
                  <tr className=" border rounded-md border-theme">
                    <td className='  border border-theme  py-1 px-3 placeholder-[#4B4B4B] shadow-sm  text-sm  '>
                      <label htmlFor="facebook" className='pt-4 text-sm font-semibold pb-1'>facebook.com/ </label></td>
                    <td className="border border-theme"> <input type="text" id="facebook" value={state.facebook_profile} onChange={(e) => setState({ ...state, facebook_profile: e.target.value })} className=' placeholder-[#4B4B4B] border-theme shadow-sm  focus-visible:border-[#25a451]  focus-visible:outline-none  focus-visible:shadow-focusshadow focus-visible:border-1' />
                    </td>
                  </tr>
                </table>
                <table >
                  <tr className=" border rounded-md border-theme">
                    <td className='  border border-theme py-1 px-3 placeholder-[#4B4B4B] shadow-sm  text-sm '>
                      <label htmlFor="linkedin" className='pt-4 text-sm font-semibold pb-1'>linkedin.com/ </label></td>
                    <td className="border border-theme"> <input type="text" id="linkedin" value={state.linkedln_profile} onChange={(e) => setState({ ...state, linkedln_profile: e.target.value })} className=' placeholder-[#4B4B4B] border-theme shadow-sm  focus-visible:border-[#25a451]  focus-visible:outline-none  focus-visible:shadow-focusshadow focus-visible:border-1' />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="pt-1"><a href="/">
              <button class="border-2 px-8 text-sm py-2 hover:bg-gray-300 rounded" onClick={() => { navigate('/') }}>Back   </button>
            </a>
              <button type="button" disabled="" class="bg-theme-color px-8 text-sm py-2 rounded disabled:opacity-50 hover:bg-orange-500 text-white ml-3" onClick={() => handleUpdate()}>Update</button>
            </div>
          </section>
        </section>
      </>
    </>
  )
}

export default Register;
