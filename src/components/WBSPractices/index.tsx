import { useEffect, useState } from "react";
import forwardIcon from "../../../public/assets/svg/forward.svg";
import previous from "../../../public/assets/svg/previous.svg";
import next from "../../../public/assets/svg/next.svg";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPractices, fetchWBSStrategYById, fetchWBSStrategiesList, getNewProjectById, getPracticesById, getPracticesByWBSId, getProjectById, fetchCurrentPractices } from "@/features/Info/createInfoSlice";
import { AppDispatch } from "@/features/store";
import Link from "next/link";
import { getCurrentWBS, setCurrentPractice } from "@/features/estimation/estmationSlice";

const simple = 23;

const PreviousButton = () => {
  return (
    <div className="pt-2">
      <Image src={previous} alt={"Previous Image"} />
    </div>

  )
}

const WBSPractices = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Parse the URL parameters
  const searchParams = new URLSearchParams(useSearchParams().toString());
  // Get the value of the 'projectId' parameter
  const projectId: any = searchParams.get('projectId');
  const strategyId: any = searchParams.get('strategyId');
  const practices = useSelector(fetchPractices);
  const currentPractices = useSelector(fetchCurrentPractices);
  const currentWBS = useSelector(getCurrentWBS)
  const practiceList = practices.filter((item: { id: number; }) => currentPractices.includes(item.id)).map((item: { id: number; name: string; }) => ({ id: item.id, name: item.name }));

  const totalItems = practiceList?.length;
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
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

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const handlePageData = (card: any) => {
    dispatch(setCurrentPractice(card))
  };

  // Render the component only if practiceList exists
  if (!practiceList) {
    return <div>Loading...</div>; // Render loading or handle the absence of data
  }

  const getValues = (practiceId: any) => {
    const template = currentWBS?.estimations?.filter((temp: any) => temp?.practiceRecord?.id == practiceId)    
    if(template){
      return {
        totalEstimationHours: template[0]?.totalEstimationHours,
        components: template[0]?.components,
        componentsQa: template[0]?.componentsQa
      }
    }
  }

  return (
    <div>
      <h1 className='font-bold text-3xl my-8 text-[#01105F] whitespace-pre'>{`${currentWBS?.strategyName} > WBS Strategies`}</h1>
      <section className='grid grid-cols-3 gap-3 gap-y-8'>
        {practiceList?.length > 0 ?
          (practiceList?.map((data: any, index: any) => {
            const values = getValues(data.id)
            return (
              <div className="">
                {/* Card content here */}
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-72 h-52">
                  {/* Header */}
                  <div className="flex justify-between p-4 pb-0 h-16">
                    <div className="flex">
                      <div className="font-bold text-sm w-48 break-words">
                        {data?.name}
                      </div>
                      <div className="pl-9">
                      <Link href={`/wbsEstimation?projectId=${projectId}&strategyId=${strategyId}`}
                        onClick={() => handlePageData(data)}>
                          <Image src={forwardIcon} alt="forwardImage" width={25} height={25} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section */}
                  <div className="grid grid-cols-2 grid-rows-4 px-4 py-2 w-72 h-24 bg-[#dabefe4d]">
                    <div className="col-span-1 row-span-1 text-xs font-bold">Components:</div>
                    <div className="col-span-1 row-span-1 text-xs font-bold pl-4">QA Components:</div>
                    <div className="col-span-1 row-span-1 text-xs font-bold">Simple - {values?.components?.simple || 0}</div>
                    <div className="col-span-1 row-span-1 text-xs font-bold pl-4">Simple - {values?.componentsQa?.simple || 0}</div>
                    <div className="col-span-1 row-span-1 text-xs font-bold">Medium - {values?.components?.medium || 0}</div>
                    <div className="col-span-1 row-span-1 text-xs font-bold pl-4">Medium - {values?.componentsQa?.medium || 0}</div>
                    <div className="col-span-1 row-span-1 text-xs font-bold">Complex - {values?.components?.complex || 0}</div>
                    <div className="col-span-1 row-span-1 text-xs font-bold pl-4">Complex - {values?.componentsQa?.complex || 0}</div>
                  </div>

                  {/* Footer Section */}
                  <div className={`h-12 text-zinc-50 font-bold text-sm bg-[#01105fe6] p-4 flex justify-between items-center`}>
                    <div className="grid grid-cols-2 pt-2">
                      <p className="col-span-1 font-semibold text-sm pt-1">Total Duration</p>
                      <p className="col-span-1 font-bold text-end text-lg pl-7 pb-2.5">{values?.totalEstimationHours || 0} Hours</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })) : <div> No Data</div>
        }
      </section>
      <Pagination
        currentPage={currentPage}
        totalPages={(totalPages < 1) ? 1 : totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
export default WBSPractices