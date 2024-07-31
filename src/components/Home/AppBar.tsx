import { useSearchParams } from "next/navigation";
import { fetchCurrentProject } from "@/features/Info/createInfoSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import PersonIcon from "@/assets/icons/PersonIcon"
import AppsIcon from "@/assets/icons/AppsIcon"
import { useState } from "react";


const AppBar = ({ open }: any) => {
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const router = useRouter();
    const projectId: any = searchParams.get('projectId');
    const fetchCurrentProjects = useSelector(fetchCurrentProject);
    const [showTooltip, setShowTooltip] = useState(-1);
    const { projectName } = fetchCurrentProjects
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const settings = ["Profile", "Account", "Dashboard", "Logout"];

    return (
        <div className=" flex absolute w-full justify-end z-[2]">
            <div className={` flex absolute transition-all duration-600 ${open ? "w-[80%]" : "w-[90%]"}`}>
                <div className=" w-full flex flex-row justify-end">
                    <div className="bg-[#9340a0] w-[90%] flex justify-between items-center pl-[25px] pr-[10px] rounded-bl-[30px] mb-[10px] relative text-white">
                        <div>
                            {projectId !== null ? <h4 className="text-white">Project : {projectName}</h4> : ""}
                        </div>
                        <div className="flex">
                            <div className="flex justify-center px-2">
                                <button
                                    className="mx-1 my-auto" onClick={() => router.push('/')}
                                    onMouseEnter={() => setShowTooltip(1)}
                                    onMouseLeave={() => setShowTooltip(-1)}
                                >
                                    <AppsIcon />
                                </button>
                                <div className={` absolute text-white mt-12 text-xs bg-[#9340a0] px-2 py-1 rounded-lg ${showTooltip === 1 ? "block" : "hidden"}`}>
                                    One Bounteous Page
                                </div>
                            </div>
                            <div className="w-[1px] h-[25px] my-2 bg-white"></div>
                            <div className="flex justify-center px-2">
                                <button className="mx-1 my-auto" onClick={anchorElUser == null ? handleOpenUserMenu : handleCloseUserMenu} >
                                    <PersonIcon />
                                </button>
                            </div>
                            <div
                                className={`absolute mt-[5%] ml-[3%] text-white rounded-md bg-[#9340a0] shadow-xl ${Boolean(anchorElUser) ? "block" : "hidden"}`}
                                id="menu-appbar"
                                onClick={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <div key={setting} onClick={handleCloseUserMenu}>
                                        <h4 className="text-md font-normal p-2 px-3 cursor-pointer" onClick={handleCloseUserMenu}>
                                            {setting}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                            <div className="my-auto">
                                <p className="text-sm block">
                                    Admin User
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div>

    )
}
export default AppBar;

