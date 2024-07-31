import {
  fetchRecentActivities,
  getRecentActivities,
} from "@/features/Info/createInfoSlice";
import moment from "moment";
import SearchIcon from "../../../../public/assets/images/search-button.svg"
import Remove from "../../../../public/assets/images/remove-button.svg"
import WBS from "../../../../public/assets/menu-icons/Timetable.png"
import Resource from "../../../../public/assets/menu-icons/Staff.png"
import OtherCost from "../../../../public/assets/menu-icons/OtherCosts.png"
import Discount from "../../../../public/assets/menu-icons/Discount.png"
import Summary from "../../../../public/assets/menu-icons/ERP-System.png"
import DealDesk from "../../../../public/assets/svg/deal-desk-icon.svg"
import ViewProjects from "../../../../public/assets/images/paper.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AppDispatch } from "@/features/store";
import { useSelector, useDispatch } from "react-redux";

const extractDetails = (recentEstimation: any) => {
  let obj: any = [];
  recentEstimation?.map((item: any) => {
    const stringList = item?.action?.split(" ");
    obj.push(
      {
        time: item.date,
        name: stringList == null ? null : stringList[0],
        page: stringList == null ? null : stringList[3],
        line: item.action
      }
    )
  });
  return obj;
}

const RecentDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getRecentActivities([]));
  }, []);
  const recentEstimation = useSelector(fetchRecentActivities);
  let obj: any = [];
  if (recentEstimation) {
    obj = extractDetails(recentEstimation);
  }
  else {
    obj = [];
  }

  const [searchWords, setSearchWords] = useState<string[]>([]);
  const [filteredObj, setFilteredObj] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    try {
      dispatch(getRecentActivities(searchWords)).then((res: any) => {
        setFilteredObj(extractDetails(res.payload))
      })
    } catch (err) {
      alert(`Filter search error ${err}`)
    }
  }, [searchWords])

  const handleRemoveSearch = async (wordToRemove: string) => {
    const updatedSearchWords = searchWords.filter((word) => word !== wordToRemove);
    setSearchWords(updatedSearchWords);
    try {
      await dispatch(getRecentActivities(searchWords)).then((res: any) => {
        setFilteredObj(extractDetails(res.payload))
      })
    } catch (err) {
      console.log("Filter search error", err)
    }
    updatedSearchWords.length === 0 ? setFilteredObj([]) : setFilteredObj(obj.filter((item: any) =>
      updatedSearchWords.some(keyword =>
        item.line.toLowerCase().includes(keyword.toLowerCase())
      )
    ));
  };

  const handleSearch = async (event: any) => {
    if (event.key === 'Enter') {
      const searchInput = event.target.value.trim();
      if (searchInput) {
        if (searchInput.includes(' ')) {
          setSearchWords((prevSearchWords) => [...prevSearchWords, searchInput]);
        } else {
          const newSearchWords = searchInput.split(/\s+/);
          if (newSearchWords.length + searchWords.length > 5) {
            setShowPopup(true);
          } else {
            setSearchWords((prevSearchWords) => [...prevSearchWords, ...newSearchWords]);
          }
        }
        event.target.value = '';
      }
    }
  };

  const Highlight = ({ item, searchWords }: { item: any; searchWords: string[] }) => {
    const originalLine = item.line;

    return (
      <div>
        {searchWords.length > 0 ? (
          <span>
            {originalLine
              .split(new RegExp(`(${searchWords.join('|')})`, 'gi'))
              .map((part: string, index: number) => {
                const isHighlighted = searchWords.some((searchWord) =>
                  part.toLowerCase().includes(searchWord.toLowerCase())
                );
                return isHighlighted ? (
                  <span key={index} className="text-[#35297F] font-medium">
                    {part}
                  </span>
                ) : (
                  <span key={index}>{part}</span>
                );
              })}
          </span>
        ) : (
          <span>{originalLine}</span>
        )}
      </div>
    );
  };

  const checkPage = (item: any) => {
    if (item?.line?.includes(item.page)) {
      if (item.page == 'Strategy')
        return WBS
      if (item.page == 'Resource')
        return Resource
      if (item.page == 'Approach')
        return Resource
      if (item.page == 'Template')
        return ViewProjects
      if (item.page == 'Other Costs')
        return OtherCost
      if (item.page == 'Discounts')
        return Discount
      if (item.page == 'Summary')
        return Summary
      if (item.page == 'DealDesk')
        return DealDesk
    }
    return SearchIcon;
  }

  useEffect(() => {
    if (showPopup)
      alert("Can't search more than 5 keywords")
  }, [showPopup])

  return (
    <div className="bg-[#8A79F369] w-full h-[60vh] p-4 rounded-xl">
      <div className="flex justify-between text-[1.5rem] text-[#35297F] pb-2">
        <p>Recent Activities</p>
        <p className="font-medium">{filteredObj.length === 0 ? obj.length : filteredObj.length}
          <span className="text-black font-light"> Records</span>
        </p>
      </div>
      <div className="bg-[#FFFFFFCC] h-[85%] p-2 px-3 rounded-xl relative">
        <div className="flex">
          <div className="border-b-2 w-[30%] flex m-2 pb-1">
            <Image className="text-black" src={SearchIcon} height={20} width={20} alt={"Search Icon"} />
            <input className="bg-transparent pl-3 w-full outline-none" type="text" placeholder="Search Activity" onKeyDown={handleSearch} />
          </div>
          <div className="w-[70%] no-scrollbar px-1 flex items-center">
            {searchWords.map((word, index) => (
              <div key={index} className="group relative">
                <div className="border flex border-[#1B0066] p-1 mr-2 rounded-2xl font-light max-w-max">
                  <p className={`px-1 ${word.length > 10 && 'w-24 truncate'} `}> {word}</p>
                  <Image onClick={() => handleRemoveSearch(word)} src={Remove} height={15} width={15} alt="Close Button" />
                </div>
                {word.length > 10 && (
                  <div className="absolute p-2 scale-0 group-hover:scale-100 left-1/2 transform -translate-x-1/2 top-[-2.5rem] bg-white rounded-lg">
                    {word}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-y-scroll w-full h-[83%]">
          {filteredObj.length !== 0 ? (searchWords.length === 0 ? obj : filteredObj).map((item: any) => (
            <div className="p-1 flex">
              <div className="w-[80%] flex">
                <div className="flex justify-center mt-2 bg-gray-500 w-8 h-8 rounded-[50%]">
                  <Image className="text-black" src={checkPage(item)} height={5} width={20} alt={"Page Icon"} />
                </div>
                <div className="flex px-3 truncate w-[90%] items-center">
                  {
                    item != null || item != undefined ? (
                      <Highlight item={item} searchWords={searchWords} />
                    ) : (<></>)
                  }
                </div>
              </div>
              <div className="w-[20%] flex">
                <div>
                  <p className="font-light text-[#2B205F]">
                    {moment(item.time).format("DD MMM YYYY")}
                  </p>
                  <p className="font-light text-md text-[#2B205F]">
                    {moment(item.time).format("hh:mm A")}
                  </p>
                </div>
              </div>
            </div>
          ))
            : <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-gray-500 text-lg">No Data found</p>
            </div>}
        </div>
      </div>
    </div>
  );
};

export default RecentDashboard;

