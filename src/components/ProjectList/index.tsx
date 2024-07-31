import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { AppDispatch } from "../../features/store";
import { fetchProjectList, getAllProjectList } from "../../features/projectList/projectSlice";
import { paginateList } from "../../helper/utility/dateFunctions";
import ForwardButton from "../../../public/assets/images/forward-button.png";
import NextIcon from "@/assets/icons/NextIcon";
import PreviousIcon from "@/assets/icons/PreviousIcon";

const ViewProjectList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const projects = useSelector(getAllProjectList);
    
    useEffect(() => {
        dispatch(fetchProjectList());
    }, []);    

    const errorStyle = {
        padding: 30,
        paddingLeft: 20
    }

    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = projects?.length;
    const itemsPerPage = 8

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedList = paginateList(projects, itemsPerPage, currentPage)

    const handlePageChange = (event: any, page: any) => {
        setCurrentPage(page);
    };

    const renderList = (typeof projects !== "string") ? paginatedList?.map((project: any,index: number) => {
        return (
            <div key={index}>
                <div className="h-40 rounded-3xl border-2 overflow-hidden">
                    <div className="flex justify-between rounded-lg h-[35%] py-2 px-3">
                        <p>{project.projectName}</p>
                        <Link href={`/viewInfo?projectId=${project.projectId}`}>
                            <Image src={ForwardButton} width={25} alt="" height={25} />
                        </Link>
                    </div>
                    <div className="bg-[#2E42A6D9] h-[65%] p-3">
                        <p className="text-white">{project.description}</p>
                    </div>
                </div>
            </div>            
        )
    }) : <h1 style={errorStyle}>No data available at the moment</h1>;

    return (
        <div className="project-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="col-span-1">
                    <h1 className="text-2xl font-bold typography-styled">PROJECTS</h1>
                </div>
                <div className="col-span-1 flex justify-end">
                    <Link href="/projectinfo">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">
                            Create New Project
                        </button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {renderList}
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-center mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={(event) => handlePageChange(event,currentPage - 1)}
                        className="p-1 mx-1 text-white rounded-full"
                    >
                        <PreviousIcon color="white" className="h-5"/>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageToShow = currentPage - 3 + i;
                        if (currentPage <= 2) {
                            pageToShow = i;
                        } else if (currentPage >= totalPages - 1) {
                            pageToShow = totalPages - 5 + i;
                        }
                        return (
                            <button
                                key={i}
                                onClick={(event) => handlePageChange(event,pageToShow + 1)}
                                className={`px-3 py-1 mx-1 text-white rounded-full ${currentPage === pageToShow + 1 ? 'font-bold text-md' : ''}`}
                            >
                                {pageToShow + 1}
                            </button>
                        );
                    })}
                    
                    <button
                        disabled={currentPage === totalPages}
                        onClick={(event) => handlePageChange(event,currentPage + 1)}
                        className={`p-1 mx-1 text-white rounded-full`}
                    >
                        <NextIcon color="white" className="h-5" />
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ViewProjectList;
