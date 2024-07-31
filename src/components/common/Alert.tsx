
const LeavePageAlert = ({ open, title, message, leaveButtonText, cancelButtonText, handleConfirm, handleClose }: any) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
          <div style={{ width: "34rem" }} className="inset-40 bg-white mb-[30%] p-6 rounded-lg  w-[32rem] ">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <p className="pr-24 mb-4">{message}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirm}
                className="text-white bg-blue-500 hover:bg-blue-500 hover:opacity-75 py-2 px-4 rounded"
              >
                {leaveButtonText}
              </button>
              <button
                onClick={handleClose}
                className="text-black bg-gray-200 hover:bg-gray-400 hover:opacity-75 py-2 px-4 rounded"
              >
                {cancelButtonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LeavePageAlert;
