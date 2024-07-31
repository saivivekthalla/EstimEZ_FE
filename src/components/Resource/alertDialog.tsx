import Image from "next/image";
import DeleteIcon from "../../../public/assets/svg/delete-icon.svg";
import { useState } from "react";

interface AlertDialogProps {
  onClose: () => void;
  deleteAllData: (() => void)
}
export default function AlertDialog({ onClose, deleteAllData }: AlertDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  const handleConfirm = () => {
    deleteAllData();
    setOpen(false);
  };
  return (
    <div>
      <button onClick={() => handleClickOpen()} 
      className="space-x-2 border border-slate-400 bg-white hover:bg-gray-400 text-[#00A3FF] font-bold py-1 px-4 rounded-lg inline-flex items-center">
        <Image src={DeleteIcon} alt="Delete Icon" width={30} height={20} />
        <span>Delete All</span>
      </button>
      {open && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="relative bg-white rounded-xl p-4 w-[90%] sm:w-[50%] md:w-[40%] lg:w-[30%] max-w-lg">
              <div className="text-center">
                <h3 className="text-lg font-bold">Confirm</h3>
              </div>
              <div className="mt-2 flex justify-center">
                <p className="text-gray-800">Are you sure to delete all Approaches?</p>
              </div>
              <div className="mt-4 flex justify-center">
                <button onClick={handleClose} className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none">Cancel</button>
                <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
