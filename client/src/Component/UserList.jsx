import React, { useRef,useContext, useEffect } from 'react';
import { DataContext } from "../../src/Context/DataState";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { AiOutlineFilePdf } from 'react-icons/ai'
import dummyimage from "../assets/dummyimage.png";
import { useDownloadExcel } from 'react-export-table-to-excel';
import LogoutModal from './LogoutModel';

const UserList = () => {
    const tableRef = useRef()
    const { Users, userList, setLogout,logout } = useContext(DataContext);
    

    const navigate = useNavigate()
    useEffect(() => {
        console.log('working')
        let user = localStorage.getItem('Token')
        if (!user) {
            toast.error('You are not Logged In!', {
                toastId: 'error1',
            })
            navigate('/')
        }
        Users()
    }, [navigate])
    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'Users table',
        sheet: 'Users'
    })
   
    return (
        <>
{logout?<LogoutModal/>:""}

            <div class="flex w-full">
                <div class="w-full px-7 py-2 overflow-y-scroll h-screen space-y-4">
                <div class="flex float-right  gap-1">         
                        <button onClick={ (e)=>{e.preventDefault(); setLogout(true)}} class="border shadow-btnshd bg-theme-color text-white   px-4 py-2 rounded text-sm">Logout</button>
                        </div>
                    <div class="pt-3 ">
                        
                        <h1 class="text-xl text-[#202223] font-semibold">User Profiles</h1>
                       
                        <div class=" flex justify-between space-x-2 pt-4 items-start flex-wrap">
                            <div class="flex gap-1">
                                    <button onClick={onDownload} class="border shadow-btnshd bg-theme-color text-white   px-4 py-2 rounded text-sm">Export</button>
                            </div>
                                                                                     
                            <div class="float-right flex">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="search-icon relative top-[0.7rem]  left-6 text-gray-500 " height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z">                                                                                                       
                                     </path>
                                </svg>
                                <input   type="text" placeholder="Search" class="py-2 px-8 text-sm border placeholder-[#202223] text-[#202223] border-[#AEB4B9] rounded   outline-none"  onKeyUp={(e)=>{e.preventDefault();  Users(e.target.value)}} />
                            </div>                                                                                                        </div>
                    </div>
                    <table class="w-full table-fixed bg-white shadow-md border-separate rounded-lg  " ref={tableRef}>
                        <thead class="cursor-pointer">
                            <tr class="text-table-head  text-left bg-[#FAFBFB] text-xs font-normal ">
                                <th class="w-[6%] px-4 py-2 rounded-tl-lg">Image</th>

                                <th class="w-[14%] px-4 py-2 text-center relative">Name<div class="px-[120px] ">
                                   
                                </div>
                                </th>
                                <th class="w-[14%] px-4 py-2 text-center relative">Email<div class="px-[120px] ">
                                   
                                </div>
                                </th>
                                <th class="w-[14%] px-4 py-2  text-center relative">Position<div class="px-[120px] ">
                                   
                                </div>
                                </th>

                                <th class="w-[14%] px-4 py-2 relative text-center">Resume<div class="px-[120px] ">
                                    
                                </div>
                                </th>
                                <th class="w-[14%] px-4 py-2 relative text-center">Organization<div class="px-[130px] ">
                                    
                                </div>
                                </th>
                                <th class="w-[14%] px-4 py-2 relative text-center">Updated At<div class="px-[130px] ">
                                    
                                </div>
                                </th>
                                <th class="w-[14%] px-4 py-2 relative text-center">Contact<div class="px-[130px] ">
                                   
                                </div>
                                </th>
                               
                            </tr>
                        </thead>
                        <tbody >
                            {userList ? (<>
                                {userList.map((item, index) => {
                                   return ( <tr class="border-t text-center text-sm text-[#202223] font-normal hover:shadow-tableRowsShadow  cursor-pointer">
                                   <td class="px-4 py-2">
                                       <img src={item?.image ?(item.image):(dummyimage)} class="w-12 h-12 rounded border-black border-2 items-center mx-auto" alt="profile_image" /></td>
                                   <td class="px-4 py-2">{item?.Name}</td>
                                   <td class="px-4 py-2">{item?.email}</td>
                                   <td class="px-4 py-2">{item?.designation ?(item.designation):("--")}</td>
                                   <td class="px-4 py-2 ">{(item.file && item.file !== "") ? (
                                       <> <a href={item.file.replace('.pdf','.jpeg')} target="_blank" rel="noreferrer">
                                       <AiOutlineFilePdf data-te-toggle="tooltip"
                                               title={"Click to Download"} className="cursor-pointer hover-text  mx-auto" size={50} /><br />
                                       </a>
                                           
                                       </>
                                   ) : ("No resume updated yet!")}</td>
                                   <td class="px-4 py-2">{item?.organization ?(item.organization):("--")}</td>
                                   <td class="px-4 py-2">{item?.updatedAt ? (new Date(item?.updatedAt).toLocaleString()):("--")}</td>
                                   <td class="px-4 py-2">{item?.phone ?(item.phone):("--")}</td>
                               </tr>)
                                })}
                            </>) : ("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default UserList;