import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import DeleteIcon from "../../../public/assets/svg/delete-icon.svg";
import EditIcon from "../../../public/assets/svg/edit-icon.svg";
import ForwardIcon from "../../../public/assets/svg/forward-icon.svg";
import PlusIcon from "../../../public/assets/svg/plus-icon.svg";
import CloseIcon from "../../../public/assets/svg/close-icon.svg";
import TickIcon from "../../../public/assets/svg/tick-icon.svg";
import { useSearchParams } from 'next/navigation';
import { WBSstrategy } from '@/helper/constants/types/common';
import { AppDispatch } from "../../features/store";
import { useDispatch, useSelector } from "react-redux";
import { createWbsStrategy, deleteWbsStrategy, updateWbsStrategy } from '@/features/wbs/wbsSlice';
import { fetchWBSStrategiesList, getProjectById } from "../../features/Info/createInfoSlice";
import { alertText } from '@/helper/constants/textName';
import previous from "../../../public/assets/svg/previous.svg";
import next from "../../../public/assets/svg/next.svg";
import DeleteModal from './DeleteModal';
import Link from 'next/link';
import AlertModal from './AlertModal';
import { setCurrentWBS } from '@/features/estimation/estmationSlice';

const WBSStrategy = () => {

    // Parse the URL parameters
    const searchParams = new URLSearchParams(useSearchParams().toString());
    // Get the value of the 'projectId' parameter
    const projectId: any = searchParams.get('projectId');

    const initialState = {
        projectId: projectId,
        name: "",
        description: "",
    }

    const [formData, setFormData] = useState<WBSstrategy>(initialState);
    const [existingData, setExistingData] = useState<WBSstrategy>(initialState);
    const [existingStrategyName, setexistingStrategyName] = useState("");
    const [existingDescription, setExistingDescription] = useState("");
    const [update, setUpdate] = useState("");
    const [activeStrategy, setActiveStrategy] = useState<number>();
    const dispatch = useDispatch<AppDispatch>();
    const strategiesList = useSelector(fetchWBSStrategiesList);
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState({ alert: false, message: " " });

    const colors = ["bg-blue-400", "bg-emerald-300", "bg-teal-300", "bg-violet-700"];

    const closeModal = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        dispatch(getProjectById(projectId));
    }, []);

    const handleOpen = (index?: any, updating?: any) => {
        if (index !== null) {
            setexistingStrategyName(strategiesList[index].strategyName)
            setExistingDescription(strategiesList[index].description)
            setActiveStrategy(index)
            setFormData({
                ...formData,
                projectId: projectId,
                name: strategiesList[index].strategyName,
                description: strategiesList[index].description
            })
            setUpdate(updating)

        } else {
            setFormData(initialState)
            setUpdate("new")
        }

        setIsOpen(true);
    };

    const handleCloseAlert = () => {
        setShowAlert({
            ...showAlert,
            alert: false
        });
    };


    const handleFormChange = (e: any) => {
        const fieldName = e.target.name;

        if (update !== "updating") {
            setFormData((prev:any) => ({
                ...prev,
                [e.target.name]: e.target.value.substring(0, fieldName === "name" ? 35 : 75),
                createdBy: "Bounteous"
            }));
        } else {
            setFormData((prev:any) => ({
                ...prev,
                [e.target.name]: e.target.value.substring(0, fieldName === "name" ? 35 : 75),
                updatedBy: "Bounteous"
            }));
            setExistingData((prev:any) => ({
                ...prev,
                [e.target.name]: e.target.value.substring(0, fieldName === "strategyName" ? 35 : 75),
                updatedBy: "Bounteous"
            }));
        }
    };

    const deleteData = async (index: any[], name: any[]) => {
        const deleteObj = {
            updatedBy: "Bounteous",
            wbsStrategyId: index,

        }
        dispatch(deleteWbsStrategy(deleteObj)).then(res => {
            if (JSON.stringify(res.payload.wbsStrategyid) === JSON.stringify(index)) {
                dispatch(getProjectById(projectId));
                setShowAlert({
                    ...showAlert,
                    alert: true,
                    message: `${alertText.deleteSuccess} for strategyName : ${name}`
                });
            }
            else {
                const errMsg = res.payload.message;
                const customError = `${alertText.deleteFailed} : ${errMsg}`;
                setShowAlert({
                    ...showAlert,
                    alert: true,
                    message: customError
                });
            }
        }).catch(err => {
            console.log('DeleteWBSStrategy', err)
            setShowAlert({
                ...showAlert,
                alert: true,
                message: alertText.deleteFailed
            });
        })

    };

    const deleteAllData = () => {
        const wbsStrategyId = strategiesList.map((item: any) => item.id);

        const deleteApiData = {
            updatedBy: "Bounteous",
            wbsStrategyId: wbsStrategyId,

        };
        dispatch(deleteWbsStrategy(deleteApiData)).then(res => {
            if (res.payload.wbsStrategyid !== undefined && res.payload.wbsStrategyid.length >= 1) {
                dispatch(getProjectById(projectId));
                setIsDeleteModalOpen(false);
                setShowAlert({
                    ...showAlert,
                    alert: true,
                    message: alertText.deleteSuccess
                });
            } else {
                dispatch(getProjectById(projectId));
                setIsDeleteModalOpen(false);
                const errMsg = res.payload.message;
                const customError = `${alertText.deleteFailed} : ${errMsg}`;
                setShowAlert({
                    ...showAlert,
                    alert: true,
                    message: customError
                });
            }
        }).catch(err => {
            console.log('DeleteWBSStrategy', err);
            setIsDeleteModalOpen(false);
            setShowAlert({
                ...showAlert,
                alert: true,
                message: alertText.deleteFailed
            });
        })

    };

    const createStrategy = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (update !== "updating") {

            dispatch(createWbsStrategy(formData)).then(res => {
                if (res.payload.wbsStrategyId) {
                    setIsOpen(false);
                    dispatch(getProjectById(projectId));
                    setShowAlert({
                        ...showAlert,
                        alert: true,
                        message: alertText.saveSuccess
                    });
                } else {
                    alert(`${formData.name}` + alertText.uniqueStrategy)
                    setIsOpen(false);
                    setShowAlert({
                        ...showAlert,
                        alert: true,
                        message: alertText.saveFailed
                    });
                }
            }).catch(err => {
                console.log('WBSStrategy', err)
            })
        }
        else {
            if (activeStrategy !== undefined) {
                const wbsStrategyId = strategiesList?.[activeStrategy].id;
                const objectForm = {
                    wbsStrategyId,
                    data: formData
                }

                dispatch(updateWbsStrategy(objectForm)).then(res => {
                    if (res.payload.wbsStrategyId) {
                        setIsOpen(false);
                        setShowAlert({
                            ...showAlert,
                            alert: true,
                            message: alertText.saveSuccess
                        });
                        dispatch(getProjectById(projectId));
                    } else {
                        alert(`${formData.name}` + alertText.uniqueStrategy)
                        setIsOpen(false);
                        setShowAlert({
                            ...showAlert,
                            alert: true,
                            message: alertText.saveFailed
                        });
                    }
                })

            }
        }

    };

    const totalItems = strategiesList?.length;
    const itemsPerPage = 6;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const [currentPage, setCurrentPage] = useState(1);

    const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
        return (
            <div className="flex justify-center space-x-4 pt-4 pr-6">

                <Image src={previous} alt={"Previous Image"} className="hover:cursor-pointer"
                    onClick={() => (currentPage !== 1) ? onPageChange(currentPage - 1) : null} />

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`${currentPage === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                            } px-4 py-2 rounded`}
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <Image src={next} alt={"Next Image"} className="hover:cursor-pointer"
                    onClick={() => (currentPage !== totalPages) ? onPageChange(currentPage + 1) : null} pt-2 />
            </div>
        );
    };

    const indexOfLastCard = currentPage * itemsPerPage;
    const indexOfFirstCard = indexOfLastCard - itemsPerPage;
    const currentCards = strategiesList?.slice(indexOfFirstCard, indexOfLastCard);

    const handlePageChange = (pageNumber: any) => {
        setCurrentPage(pageNumber);
    };

    const handlePageData = (card: any) => {
        dispatch(setCurrentWBS(card))
    };


    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='font-bold text-3xl my-8'>WBS Strategies</h1>
                <div className='space-x-2 text-sm'>
                    <button onClick={() => handleOpen(null)} className="space-x-2 bg-[#01105F] hover:bg-gray-400 text-white font-bold py-1 px-4 rounded-lg inline-flex items-center">
                        <Image src={PlusIcon} alt="My Image" width={30} height={20} />
                        <span>New Strategy</span>
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="space-x-2 border border-slate-400 bg-white hover:bg-gray-400 text-[#00A3FF] font-bold py-1 px-4 rounded-lg inline-flex items-center">

                        <Image className='' src={DeleteIcon} alt="My Image" width={30} height={20} />
                        <span className=''>Delete All</span>

                    </button>
                    <div className='text-[#00A3FF] font-bold py-1 px-4 rounded-lg inline-flex items-center'>
                        <DeleteModal
                            isOpen={isDeleteModalOpen}
                            onClose={() => setIsDeleteModalOpen(false)}
                            onDelete={deleteAllData}
                        />
                    </div>
                    <button>
                        <AlertModal
                            isOpened={showAlert.alert}
                            message={showAlert.message}
                            onClose={handleCloseAlert}
                        />
                    </button>

                </div>
            </div>
            {/* -----------------Modal--------------------- */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 w-450 h-350">
                    <div className="modal-overlay inset-0 bg-gray-900 opacity-50"></div>
                    <div className="bg-sky-200 modal-container w-72 h-60  p-4 rounded-lg shadow-lg">
                        <div className="modal-close cursor-pointer absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={closeModal}>
                            &times;
                        </div>
                        <form className="" onSubmit={createStrategy}>
                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="name">
                                    Name
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    type="text" placeholder="Enter WBS name" />
                            </div>
                            <div className="">
                                <div className="mb-1">
                                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows={3}
                                        placeholder="Enter Strategy Description"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <button className=""
                                    disabled={existingDescription === formData.description &&
                                        existingStrategyName === formData.name} type="submit">
                                    <Image className='' src={TickIcon} alt="My Image" width={30} height={20} />
                                </button>
                                <button onClick={closeModal} className="" type="button">
                                    <Image className='' src={CloseIcon} alt="My Image" width={30} height={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* -----------------Modal--------------------- */}

            <section className='grid grid-cols-3 gap-3 gap-y-8'>
                {strategiesList && strategiesList.length > 0 ? currentCards?.map((card: any, index: any) => {
                    const indexx = index % colors.length;
                    return (
                        <div key={index} className="">
                            {/* Card content here */}
                            <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-80 h-52">
                                {/* Header */}
                                <div className="flex justify-between p-4 pb-0 h-16">
                                    <div className="flex">
                                        <div className="font-bold text-sm w-48 break-words whitespace-pre">
                                            {card.strategyName}
                                        </div>
                                        <div className="cursor-pointer flex -mt-6 pl-16">
                                            <Image onClick={() => deleteData([card.id], [card.strategyName])} src={DeleteIcon} alt="My Image" width={30} height={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Section */}
                                <div className="px-4 py-2 w-64 h-24 break-words">
                                    {card.description}
                                </div>

                                {/* Footer Section */}
                                <div className={`h-12 text-zinc-50 font-bold text-sm ${colors[indexx]} p-4 flex justify-between items-center`}>
                                    <div>
                                        <p className="">Total Duration</p>
                                        <p className="">{card.totalStrategyHours} Hrs</p>
                                    </div>
                                    <div className="flex space-x-2 cursor-pointer">
                                        <Image className='bg-white rounded-full p-1'
                                            onClick={() => { handleOpen(index, "updating") }}
                                            src={EditIcon} alt="My Image" width={30} height={30} />
                                        <Link
                                            href={`/WBSPractices?projectId=${projectId}&strategyId=${card.id}`}

                                        >
                                            <Image
                                                className='bg-white rounded-full'
                                                src={ForwardIcon} alt="My Image"
                                                width={30} height={30}
                                                onClick={() => handlePageData(card)}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) :
                    <button onClick={() => handleOpen(null)} className='w-60 h-44 border-dotted border-2 border-slate-400 rounded-lg flex flex-col justify-center items-center'>
                        <Image className='fill-slate-700' src={PlusIcon} alt="My Image" width={70} height={70} />
                        <span className='text-base text-slate-400 font-bold'>Create New Strategy</span>
                    </button>
                }
            </section >
            <Pagination
                currentPage={currentPage}
                totalPages={(totalPages < 1) ? 1 : totalPages}
                onPageChange={handlePageChange}
            />
        </div >
    )
}

export default WBSStrategy