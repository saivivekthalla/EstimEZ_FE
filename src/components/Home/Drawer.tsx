import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from 'next/navigation'
import HomeImg from "../../../public/assets/images/home.png";
import PaperImg from "../../../public/assets/images/paper.png";
import collapseLogo from "../../../public/assets/images/collapse-logo.png";
import bounteousLogo from "../../../public/assets/images/bounteous-logo.png";
import InfoImg from "../../../public/assets/images/info.png";
import TimetableImg from "../../../public/assets/menu-icons/Timetable.png";
import OtherCosts from "../../../public/assets/menu-icons/OtherCosts.png";
import StaffImg from "../../../public/assets/menu-icons/Staff.png";
import ERPSystemImg from "../../../public/assets/menu-icons/ERP-System.png";
import { getSubMenuOpen, setSubMenuOpen } from "@/features/budget/otherCostDiscountSlice";
import ArrowupIcon from "@/assets/icons/ArrowupIcon";
import { fetchCurrentProject, getEngagementType, getPractices, getProjectType, getVerticals, } from "@/features/Info/createInfoSlice";
import SearchImg from "../../../public/assets/images/search.png";
import PriceTag from "../../../public/assets/images/price-tag.png";
import ManageImg from "../../../public/assets/images/manage-icon.png";
import DealDesk from "../../../public/assets/svg/deal-desk-icon.svg";
import { getFinalised } from "../../features/summary/summarySlice"
import { getdataSaved, setdataSaved } from "../../features/resource/resourcePlanningSlice";
import { AppDispatch } from "../../features/store";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/helper/constants/types/common";
import LeavePageAlert from "../common/Alert";

const Drawer = ({ open }: any) => {
  const [isInfoPage, setIsInfoPage] = useState<boolean>(false);
  const [showwbstoolTip, setshowwbstoolTip] = useState<boolean>(false);
  const [showdealdesktoolTip, setshowdealdesktoolTip] = useState<boolean>(false);
  const [text, setText] = useState<string | MenuItem>(
    {
      id: 1,
      title: "",
      url: "",
    })
  const finalised = useSelector(getFinalised);
  const datasaved = useSelector(getdataSaved);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [openalert, setOpen] = useState(false);


  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    dispatch(setdataSaved(true));
    if (typeof text === 'string') {
      if (text === "/home" && typeof window !== 'undefined') {
        window.location.href = text;
      } else {
        router.push(text);
      }
    } else if (text && typeof text.title === 'string') {
      if (text.title === 'RESOURCE') {
        history.go(-1);
      } else {
        router.push(text.url);
      }
    }
  };


  const handlefinalalert = () => {
    if (typeof window !== 'undefined') {
      if (!finalised && window.location.href.includes("summary") && !window.location.href.includes("estimation/summary"))
        alert("Not finalised")
    }
  }

  const handleDataAlert = (text: string | MenuItem) => {
    if (typeof window !== 'undefined') {
      if (!datasaved && (window.location.href.includes("resource/estimation") ||
        window.location.href.includes("/othercost") ||
        window.location.href.includes("/discount") ||
        window.location.href.includes("/wbsEstimation") ||
        window.location.href.includes("/projectinfo"))) {
        setText(text)
        setOpen(true)
      }
    }
  };

  const searchParams = new URLSearchParams(useSearchParams().toString());
  const projectId: string | null = searchParams.get('projectId');
  const subMenuOpen = useSelector(getSubMenuOpen);
  const infoDetails = useSelector(fetchCurrentProject);
  const wbsStrategies = infoDetails?.wbsStrategies;
  const engagementType = infoDetails?.engagementTypeId === 2 ? true : false

  useEffect(() => {

    dispatch(getVerticals());
    dispatch(getPractices());
    dispatch(getEngagementType());
    dispatch(getProjectType());
    
    // Function to check if the URL contains "home"
    const checkIfHome = () => {
      if (typeof window !== 'undefined') {
        const currentUrl = window.location.href;

        setIsInfoPage(
          !currentUrl.includes("home") &&
          !currentUrl.includes("viewProjects") &&
          !currentUrl.includes("search") &&
          !currentUrl.includes("ratecards")
        );
      }

    };

    // Call the function once on component mount
    checkIfHome();

    // Add an event listener to check for URL changes
    const handleUrlChange = () => {
      checkIfHome();
    };
    if (typeof window !== 'undefined')
      window.addEventListener('popstate', handleUrlChange);
    // Clean up the event listener on component unmount
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    if (open == false) {
      dispatch(setSubMenuOpen(true))
    }
  }, [open]);

  const listItems: any[] = [
    {
      id: 1,
      title: "Home",
      icon: <Image src={HomeImg} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      url: "/home",
    },
    {
      id: 2,
      title: "View Projects",
      icon: <Image src={PaperImg} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      url: "/viewProjects",
    },
    {
      id: 3,
      title: "Search",
      icon: <Image src={SearchImg} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      url: "/search",
    },
    {

      id: 4,
      title: "Rate Cards",
      icon: <Image src={PriceTag} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      url: "/ratecards",
    },
  ];

  const subMenuList: any[] = [
    {
      id: 1,
      title: "INFO",
      icon: <Image src={InfoImg} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      url: `/viewInfo?projectId=${projectId}`,
      disableNav: projectId === null ? true : false,
      infoUrl: `/projectinfo`,
      pathUrl: `/viewInfo`
    },
    {
      id: 2,
      title: "WBS",
      icon: <Image src={TimetableImg} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      url: `/wbs?projectId=${projectId}`,
      disableNav: projectId === null ? true : (!engagementType ? true : false),
      pathUrl: `/estimation`,
      pathGraph: `/estimation/graph`,
      pathSummary: `/estimation/summary`
    },
    {
      id: 3,
      title: "BUDGET",
      icon: <Image src={StaffImg} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      // url: `/resource?projectId=${projectId}`,
      url: `/budget?projectId=${projectId}`,
      disableNav: projectId === null ? true : (!engagementType ? false : (wbsStrategies?.length > 0 ? false : true)),
      pathUrl: `/budget`,
      // pathEstimation: `/resource/estimation`,
      submenu: true
    },
    {
      id: 4,
      title: "SUMMARY",
      icon: <Image src={ERPSystemImg} alt="My Image" width={20} className="max-w-[40px]" height={20} />,
      url: `/summary?projectId=${projectId}`,
      disableNav: projectId === null ? true : (!engagementType ? false : (wbsStrategies?.length > 0 ? false : true)),
      pathUrl: `/summary`
    },
    {
      id: 5,
      title: "DEAL DESK ANALYSIS",
      icon: <Image src={DealDesk} alt="My Image" width={20} className="max-w-[40px]" height={20} />,
      url: `/dealdesk?projectId=${projectId}`,
      disableNav: projectId === null ? true : (infoDetails?.projectFinalizedRecord === null ? !finalised : false),
      pathUrl: `/dealDesk`
    },
  ];

  const collapseSubMenu: any[] = [
    {
      id: 1,
      title: "RESOURCE",
      icon: <Image src={InfoImg} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      url: `/resource?projectId=${projectId}`,
      disableNav: projectId === null ? true : (!engagementType ? false : (wbsStrategies?.length > 0 ? false : true)),
      pathUrl: `/resource`
    },
    {
      id: 2,
      title: "OTHER COSTS",
      icon: <Image src={OtherCosts} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      url: `/othercost?projectId=${projectId}`,
      disableNav: projectId === null ? true : (!engagementType ? false : (wbsStrategies?.length > 0 ? false : true)),
      pathUrl: `/othercost`,
    },
    {
      id: 3,
      title: "DISCOUNT",
      icon: <Image src={StaffImg} alt="My Image" className="max-w-[40px]" width={20} height={20} />,
      url: `/discount?projectId=${projectId}`,
      disableNav: projectId === null ? true : (!engagementType ? false : (wbsStrategies?.length > 0 ? false : true)),
      pathUrl: `/discount`,
    },
  ];

  const handleClick = () => {
    dispatch(setSubMenuOpen(!subMenuOpen));
  };

  return (
    <>
      <div
        style={{
          background: `linear-gradient(169.24deg, #01105f 71.81%, rgba(135, 42, 149, 0.94) 98.95%)`,
        }}
        className={`  whitespace-nowrap  transition-all duration-600 ${open ? 'w-[240px] min-w-[240px]' : 'w-[70px] min-w-0'} ease-in-out  overflow-x-hidden h-screen overflow-hidden flex flex-col z-0`}
      >
        <div className="m-2 basis-[10%] flex flex-row justify-center">
          <Link href={datasaved ? ("/home") : ("#")} onClick={() => {
            handleDataAlert("/home")
          }}>
            {!open ? (
              <Image src={collapseLogo} alt="Collapse Logo" width={25} height={30} />
            ) : (
              <Image src={bounteousLogo} alt="Bounteous Logo" width={150} height={40} />
            )}
          </Link>
        </div>

        <div className="ml-3 basis-[80%] flex flex-col justify-center" >
          <div>
            {(isInfoPage ? subMenuList : listItems).map((text, index) => {
              return (
                <button
                  key={text.id}
                  className={` flex flex-col !p-0`}
                  disabled={text.disableNav}
                  onClick={() => {
                    text.title !== "BUDGET" && text.title !== "SUMMARY" ? handlefinalalert() : console.log("not called")
                    if (text.title !== "BUDGET") {
                      handleDataAlert(text)
                    }
                  }}

                >
                  {text.submenu ?
                    <>
                      <div className="flex">
                        <Link href={datasaved ? (text.disableNav ? "#" : text?.url) : "#"}>

                          <button className="flex m-3">
                            <div className={`${open ? "mr-[30px]" : "mr-auto"} ${text.disableNav ? "opacity-[.4]	" : ""}`} >
                              {text.icon}
                            </div>
                            <h4 className={` text-white ${text.disableNav ? "opacity-[.4]	" : ""} ${open ? "opacity-1" : "!opacity-0"}`}>
                              {text.title}
                            </h4>
                          </button>
                        </Link>

                        {!subMenuOpen ? <div className={`text-white m-3 ${text.disableNav ? "opacity-40" : ""}`} onClick={!text.disableNav ? handleClick : undefined}><ArrowupIcon rotate="rotate(270 44 40)" /></div> : <div className={`text-white m-3 ${text.disableNav ? "opacity-40" : ""}`} onClick={!text.disableNav ? handleClick : undefined}><ArrowupIcon rotate="rotate(90 44 0)" /></div>}
                      </div>
                      <div className={`${!subMenuOpen ? 'block' : 'hidden'} text-sm ml-8`}>
                        {collapseSubMenu.map((collapseMenu: any) => (
                          <div key={collapseMenu.title}>
                            <Link href={datasaved ? (collapseMenu.disableNav ? "#" : collapseMenu?.url) : "#"} className="no-underline" onClick={() => handleDataAlert(collapseMenu)}>
                              <div>
                                <div className="flex text-white m-3 my-6 ">
                                  <div >
                                    {collapseMenu.icon}
                                  </div>
                                  <span className="ml-6 !font-[sans-serif]">
                                    {collapseMenu.title}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </>
                    :
                    <>
                      <Link href={datasaved ? (text.disableNav ? "#" : text?.url) : "#"}>
                        <button className="flex p-3 text-left"
                          onMouseEnter={() => {
                            if (text.title === "WBS") {
                              setshowwbstoolTip(true);
                            }
                            else if (text.title === "DEAL DESK ANALYSIS") {
                              setshowdealdesktoolTip(true);
                            }
                          }}
                          onMouseLeave={() => {
                            if (text.title === "WBS") {
                              setshowwbstoolTip(false);
                            }
                            else if (text.title === "DEAL DESK ANALYSIS") {
                              setshowdealdesktoolTip(false);
                            }
                          }}>
                          <div className={`${open ? 'mr-[30px]' : ''} ${text.disableNav ? "opacity-[.4]	" : ""}`}>
                            {text.icon}
                          </div>

                          <div className={`transition-opacity text-white  ${text.disableNav ? "opacity-[.4]	" : ""} ${open ? 'opacity-100' : '!opacity-0'}`}>
                            {text.title.split(' ').map((word: any, index: number) => (
                              index === 2 ? (
                                <div key={index}>
                                  <wbr />
                                  {word}
                                </div>
                              ) : (
                                <span key={index}>
                                  {index > 0 ? ' ' : ''}
                                  {word}
                                </span>
                              )
                            ))}
                          </div>
                          {showwbstoolTip && (
                            text.title === "WBS" && !engagementType ? (

                              <div className="text-white w-48 h-16 px-3 py-2 whitespace-normal translate-y-[-30%] break-words ml-12 text-[15px] absolute translate-x-[35%] bg-[#6355be] rounded">WBS will be enabled for Fixed Scope Projects</div>

                            ) : (
                              null
                            )
                          )}
                          {showdealdesktoolTip && (
                            text.title === "DEAL DESK ANALYSIS" && text.disableNav ? (

                              <div className="text-white w-48 h-16 px-3 py-2 whitespace-normal translate-y-[-17%] break-words ml-12 text-[15px] absolute translate-x-[55%] bg-[#6355be] rounded">Pending to Finalize an Approach in Summary</div>

                            ) : (
                              null
                            )
                          )}
                        </button>
                      </Link>
                    </>
                  }
                </button>
              )
            })}
          </div >

        </div>
        {
          isInfoPage ? (
            <></>
          ) : (
            <button className="flex justify-center items-center">
              <Image
                className={open ? 'pb-8' : 'pl-1 pb-8 pt-4'}
                src={ManageImg}
                alt="Manage Image"
                width={33}
              />
              {open &&
                <p className="font-bold text-xl text-[#E8FF5A]  pl-3 pb-8">MANAGE</p>
              }
            </button>
          )
        }
      </div>
      <LeavePageAlert
        open={openalert}
        title="Leaving Page?"
        message="Changes you made may not be saved."
        leaveButtonText="Leave"
        cancelButtonText="Cancel"
        handleConfirm={handleConfirm}
        handleClose={handleClose}
      />
    </>
  )
}


export default Drawer;