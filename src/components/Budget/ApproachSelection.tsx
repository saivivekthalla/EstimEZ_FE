import { resourceData } from "@/helper/constants/staticData/resourceData";
import { ResourceCard } from "@/helper/constants/types/ResourcePlanningtypes/resourceCardTypes";
import { calculateMathCeil } from "@/helper/utility/mathFunctions";
import { useSelector } from 'react-redux';
import { useState } from "react";
import CardItem from "./CardItem";
import Pagination from "./Pagination";
import { fetchResourceApproachesList } from "@/features/Info/createInfoSlice";

const ApproachSelection = ({ setSelectedCard }: any) => {
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
    // populate the data from fetchApproachlist
    const currentdata: ResourceCard[] = useSelector(fetchResourceApproachesList);
    const totalItems = currentdata?.length;
    const itemsPerPage = 6;
    const totalPages = calculateMathCeil(totalItems, itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const handleItemClick = (index: number, name: string) => {
        setSelectedItem(index);
        setSelectedItemName(name)
        setSelectedCard(currentdata[index])
    };

    const indexOfLastCard = currentPage * itemsPerPage;
    const indexOfFirstCard = indexOfLastCard - itemsPerPage;
    const currentCards = currentdata?.slice(indexOfFirstCard, indexOfLastCard);

    const handlePageChange = (pageNumber: any) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="text-white h-[40vh] border bg-[#2B205F] rounded-lg">
            <div className="flex justify-around my-1 mx-4 text-lg">
                <div className="p-1">
                    Approach Selection
                </div>
                <Pagination
                    className="p-1"
                    currentPage={currentPage}
                    totalPages={(totalPages < 1) ? 1 : totalPages}
                    onPageChange={handlePageChange}
                />
                <div className="p-1 flex flex-row">

                    <div className="border-r-[1px] mr-2 pr-2">
                        <div className="text-[#EFFF8A]">
                            {(selectedItemName) ? (
                                    <div className="truncate mx-[3px] text-end" style={{width:"300px"}}>Chosen Approach - {selectedItemName}</div>
                            ) : "Select An Approach"}
                        </div>
                    </div>
                    <div>{currentCards.length} - {totalItems} Records</div>
                </div>
            </div>
            <div className="grid grid-cols-3 m-4 mt-0 text-sm">
                {currentCards.map((data, index) => (
                    <CardItem
                        key={indexOfFirstCard + index}
                        data={data}
                        index={indexOfFirstCard + index}
                        selectedItem={selectedItem}
                        onClick={(index: number, name: string) => handleItemClick(index, name)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ApproachSelection