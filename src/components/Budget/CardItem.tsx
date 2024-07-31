import { getWBSStrategyNameById } from "@/features/Info/createInfoSlice";
import { ResourceCardProps } from "@/helper/constants/types/ResourcePlanningtypes/resourceCardTypes";
import { useSelector } from 'react-redux';

const CardItem: React.FC<ResourceCardProps> = ({ data, index, selectedItem, onClick }) => {

    const wbsStrategyName = useSelector((state : any) => getWBSStrategyNameById(state, data.wbs_strategy_id));
    return (
        <div
            key={index}
            className={`flex justify-around bg-white mx-[4%] h-20 rounded-lg my-1 p-1 hover:cursor-pointer ${index === selectedItem ? 'border-[#90AA29] border-[5px]' : ''}`}
            onClick={() => onClick(index, data.approachName)}
        >
            <div className="text-[#1B0066] font-semibold m-1 flex justify-center items-center flex-col">
                <div className="truncate w-[6rem] text-center">{data.approachName}</div>
                <div className="text-[#6D6E83]  text-center truncate w-[6rem] font-light">{data.description}</div>
                <div className="text-[#6D6E83] text-center font-light">{wbsStrategyName.toUpperCase()}</div>
            </div>
            <div className="flex justify-center flex-col font-semibold m-1 bg-[#1B0066CC] text-white rounded-lg w-[40%]  items-center">
                Total Cost<br /><span className="text-[#EFFF8A]">${data.totalCost}</span>
            </div>
        </div>
    );
}

export default CardItem;