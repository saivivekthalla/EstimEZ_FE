import PreviousIcon from "@/assets/icons/PreviousIcon";
import NextIcon from "@/assets/icons/NextIcon";


const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
    return (
        <div className="flex justify-center space-x-1 ml-20">
            <div>

                <div
                    className="hover:cursor-pointer m-2"
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                >
                    <PreviousIcon color="yellow" className="h-4 w-4" />
                </div>
            </div>
            <div className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`${currentPage === index + 1
                            ? 'bg-[#EFFF8A] text-black'
                            : 'hidden'
                            } px-2 rounded text-xs h-4 m-2`}
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div>
                <div className="hover:cursor-pointer m-2"
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                >
                    <NextIcon color="yellow" className="h-4 w-4" />
                </div>

            </div>
        </div>
    );
};
export default Pagination;