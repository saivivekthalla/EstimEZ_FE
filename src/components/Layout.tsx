import { useState } from "react";
import AppBar from "./Home/AppBar";
import Drawer from "./Home/Drawer";
import CollapseNext from "../../public/assets/images/collapse-next.png";
import CollapsePrev from "../../public/assets/images/collapse-prev.png";
import Copyright from "./Home/CopyRight";
import Image from "next/image";

const Layout = ({ children }: any) => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="flex">
      <AppBar open={open} />
      <Drawer open={open} />
      <div className="z-1">
        <div className="absolute bottom-0 top-0 z-1 flex flex-col justify-center">
          <button
            onClick={toggleDrawer}
            className="absolute left-[-15px] w-[30px]"
          >
            <Image
              src={open ? CollapseNext : CollapsePrev}
              alt={open ? "collapse-next" : "collapse-prev"}
              width={80}
              height={30}
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between h-screen w-full overflow-auto p-4">
        <div className="container mx-auto my-10">{children}</div>
        <div className="container mx-auto">
          <Copyright />
        </div>
      </div>
    </div>
  );
};

export default Layout;
