import { useState, useEffect } from "react";
import AlertDialog from "../Resource/alertDialog";
import PlusIcon from "../../../public/assets/svg/plus-icon.svg";
import previous from "../../../public/assets/svg/previous.svg";
import next from "../../../public/assets/svg/next.svg";
import ResourceDataCard from "./ResourceDataCard"
import { useDispatch, useSelector } from "react-redux";
import { ResourceInterface } from "../../helper/constants/types/common";
import {
  createResourceApproach,
  deleteResourceApproach,
  fetchRateCards,
  fetchRegions,
  fetchRoles,
  updateResourceApproach,
} from "../../features/resource/resourcePlanningSlice";
import { AppDispatch } from "../../features/store";
import {
  fetchResourceApproachesList,
  getProjectById, fetchCurrentProject, fetchEngagementType
} from "../../features/Info/createInfoSlice";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { alertText, resourceText } from "@/helper/constants/textName";
import SaveButtonImg from "../../../public/assets/images/save-button.png";
import DeleteButtonImg from "../../../public/assets/images/delete-button.png";

export const newApproachCardStyle: React.CSSProperties = {
  height: "200px",
  width: "220px",
  border: "2px dashed grey",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "20px",
  marginLeft: "10px",
  borderRadius: "20px",
};

const ResourceList = () => {
  const router = useRouter();
  // Parse the URL parameters
  const searchParams = new URLSearchParams(useSearchParams().toString());
  // Get the value of the 'projectId' parameter
  const projectId: any = searchParams.get("projectId");

  const initialState = {
    projectId: projectId,
    approachName: "",
    description: "",
    wbsStrategyId: null,
  };

  interface WbsStrategy {
    description: string;
    id: number;
    strategyName: string;
  }
  useEffect(() => {
    dispatch(fetchRoles())
    dispatch(fetchRegions())
    dispatch(fetchRateCards())
  }, [])
  const engagementTypeLabel = "Fixed Scope - Projects";
  const [formData, setFormData] = useState<ResourceInterface>(initialState);
  const [existingApproachName, setexistingApproachName] = useState("");
  const [existingwbsStrategyId, setexistingwbsStrategyId] = useState(null);
  const [existingDescription, setExistingDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState("");
  const [activeApproach, setActiveApproach] = useState<number>();
  const [selectedOption, setSelectedOption] = useState("");

  const [existingData, setExistingData] =
    useState<ResourceInterface>(initialState);

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch<AppDispatch>();
  const infoDetails = useSelector(fetchCurrentProject)
  const engagementTypes = useSelector(fetchEngagementType)
  const resourceList = useSelector(fetchResourceApproachesList);

  const wbsStrategies = infoDetails?.wbsStrategies
  const engagementType = engagementTypes.find((item: { id: any; }) => item.id === infoDetails?.engagementTypeId)?.name;

  const handleOpen = (index?: any, updating?: any) => {
    if (index !== null) {
      setexistingApproachName(currentCardsOnPage[index].approachName);
      setExistingDescription(currentCardsOnPage[index].description);
      setexistingwbsStrategyId(currentCardsOnPage[index].wbs_strategy_id);

      setActiveApproach(index);
      setFormData({
        ...formData,
        projectId: projectId,
        approachName: currentCardsOnPage[index].approachName,
        description: currentCardsOnPage[index].description,
        wbsStrategyId: currentCardsOnPage[index].wbs_strategy_id,
      });
      setUpdate(updating);
    } else {
      setFormData(initialState);
      setUpdate(resourceText.new);
      setSelectedOption("");
    }

    setOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    const fieldName = e.target.name;

    if (update !== resourceText.updating) {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.substring(
          0,
          fieldName === resourceText.approachName ? 35 : 75
        ),
        createdBy: "Bounteous",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.substring(
          0,
          fieldName === resourceText.approachName ? 35 : 75
        ),
        updatedBy: "Bounteous",
      }));
      setExistingData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.substring(
          0,
          fieldName === resourceText.approachName ? 35 : 75
        ),
        updatedBy: "Bounteous",
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputValue = e.target.value;
    const fieldName = e.target.name;

    if (update !== resourceText.updating) {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.substring(
          0,
          fieldName === resourceText.approachName ? 35 : 75
        ),
        createdBy: "Bounteous",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.substring(
          0,
          fieldName === resourceText.approachName ? 35 : 75
        ),
        updatedBy: "Bounteous",
      }));
      setExistingData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.substring(
          0,
          fieldName === resourceText.approachName ? 35 : 75
        ),
        updatedBy: "Bounteous",
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (update !== resourceText.updating) {
      dispatch(createResourceApproach(formData))
        .then((res) => {
          if (res.payload.approachId) {
            setOpen(false);
            dispatch(getProjectById(projectId));
            alert(alertText.saveSuccess);
          } else {
            alert(`${formData.approachName}` + alertText.uniqueApproachName);
          }
        })
        .catch((err) => { });
    } else {
      if (activeApproach !== undefined) {
        const { approachId } = resourceList?.[activeApproach];
        const objectForm = {
          approachId,
          data: formData,
        };

        dispatch(updateResourceApproach(objectForm)).then((res) => {
          if (res.payload.approachId) {
            setOpen(false);
            dispatch(getProjectById(projectId));
            alert(alertText.saveSuccess);
          } else {
            alert(`${formData.approachName}` + alertText.uniqueApproachName);
          }
        });
      }
    }
  };

  const handleDelete = () => {
    setOpen(false);
  };

  const deleteAllData = () => {
    const approachId = resourceList.map((item: any) => item.approachId);

    const deleteApiData = {
      projectId: projectId,
      approachIds: approachId,
      updatedBy: "Bounteous",
    };

    dispatch(deleteResourceApproach(deleteApiData))
      .then((res) => {        
        if (res.payload.status === 409) {
          alert("The list contains finalized approach that cannot be deleted");
        } 
        if (res.payload.approachIds.length >= 1) {
          dispatch(getProjectById(projectId));
          alert(alertText.deleteSuccess);
        } else {
          alert(alertText.deleteFailed);
        }
      })
      .catch((err) => {
        console.log("deleteResourceApproach", err);
      });
  };

  const deleteData = async (index: any[]) => {
    const deleteObj = {
      projectId: projectId,
      approachIds: index,
      updatedBy: "Bounteous",
    };

    dispatch(deleteResourceApproach(deleteObj))
      .then((res) => {
        if (res.payload.status!=409) {
          dispatch(getProjectById(projectId));
        } else {
          alert("Finalized Approach cannot be deleted!");
        }
      })
      .catch((err) => {
        console.log("ResourceComponent", err);
      });
  };

  const modalCard = () => {
    return (
      <>
        <div className={`fixed z-10 inset-0 overflow-y-auto ${open ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500  bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="relative bg-sky-200 !bg-opacity-100 rounded-xl p-4 w-[90%] sm:w-[50%] md:w-[40%] lg:w-[30%] max-w-lg">
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-2">
                  <div className="flex flex-row justify-between gap-2">
                    <div className="flex flex-col w-full">
                      <label htmlFor={resourceText.approachName} className="font-bold">Name</label>
                      <input
                        id={resourceText.approachName}
                        name={resourceText.approachName}
                        placeholder="Enter Name"
                        value={formData.approachName}
                        onChange={handleFormChange}
                        className="h-10 w-full p-2 border border-gray-300 rounded-xl mb-2"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      {engagementType === engagementTypeLabel && (
                        <>
                          <label htmlFor={resourceText.wbsStrategyId} className="font-bold">WBS</label>
                          <select
                            id={resourceText.wbsStrategyId}
                            name={resourceText.wbsStrategyId}
                            value={formData.wbsStrategyId === null ? "" : formData.wbsStrategyId}
                            onChange={(e) => {
                              setSelectedOption(e.target.value);
                              handleSelectChange(e);
                            }}
                            className={`w-full h-10 p-2 border border-gray-300 rounded-xl ${update === resourceText.updating || selectedOption ? "text-gray-900" : "text-gray-400"}`}
                            disabled={wbsStrategies.length === 0}
                            required
                            style={{ paddingRight: "0px" }}
                          >
                            {wbsStrategies.length === 0 ? (
                              <option value="" disabled hidden>Not Available</option>
                            ) : (
                              <option value="" disabled hidden>Select an option</option>
                            )}
                            {wbsStrategies.map((strategy: any) => (
                              <option key={strategy.id} value={strategy.id} className="text-gray-900">
                                {strategy.strategyName.replace(/ /g, "\u00a0")}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </div>
                  </div>
                  <label htmlFor={resourceText.description} className="font-bold">Description</label>
                  <textarea
                    id={resourceText.description}
                    name={resourceText.description}
                    placeholder="Enter Approach Description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-xl resize-none h-20"
                    required
                    rows={4}
                  />
                </div>
                <div className="flex justify-center mt-2 space-x-1">
                  <button
                    type="submit"
                    disabled={
                      existingDescription === formData.description &&
                      existingApproachName === formData.approachName &&
                      existingwbsStrategyId === formData.wbsStrategyId
                    }
                  >
                    <Image src={SaveButtonImg} alt="" width={30} height={25} />
                  </button>
                  <button onClick={handleDelete}>
                    <Image src={DeleteButtonImg} alt="" width={30} height={25} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  };

  const totalItems = resourceList ? resourceList.length : 0;
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
    return (
      <div className="flex justify-center space-x-4 pt-4 pr-6">
        <Image
          src={previous}
          alt={"Previous Image"}
          className="hover:cursor-pointer"
          onClick={() =>
            currentPage !== 1 ? onPageChange(currentPage - 1) : null
          }
        />

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`${currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
              } px-4 py-2 rounded`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <Image
          src={next}
          alt={"Next Image"}
          className="hover:cursor-pointer"
          onClick={() =>
            currentPage !== totalPages ? onPageChange(currentPage + 1) : null
          }
          pt-2
        />
      </div>
    );
  };

  const indexOfLastCard = currentPage * itemsPerPage;
  const indexOfFirstCard = indexOfLastCard - itemsPerPage;
  const currentCardsOnPage = resourceList
    ? resourceList.slice(indexOfFirstCard, indexOfLastCard)
    : 0;
  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const [showTooltip, setShowTooltip] = useState(-1);
  const strategyMapping: Record<number, string> = {};
  const strategyMappingDescription: Record<number, string> = {};

  wbsStrategies.forEach((strategy: any) => {
    strategyMapping[strategy.id] = strategy.strategyName;
    strategyMappingDescription[strategy.id] = strategy.description;
  });

  return (
    <div className="w-full">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl my-8">Resource Planning</h1>
          <div className="flex space-x-2 text-sm">
            <button
              className="space-x-2 bg-[#01105F] hover:bg-gray-400 text-white font-bold py-1 px-4 rounded-lg inline-flex items-center"
              onClick={() => handleOpen(null)}
            >
              <Image src={PlusIcon} alt="My Image" width={30} height={20} />
              <span>New Approach</span>
            </button>
            <div>
              <AlertDialog
                onClose={handleClose}
                deleteAllData={deleteAllData}
              />
            </div>
            {modalCard()}
          </div>
        </div>
      </div>
      <div>
        <ResourceDataCard
          resourceList={resourceList}
          currentCardsOnPage={currentCardsOnPage}
          deleteData={deleteData}
          strategyMapping={strategyMapping}
          strategyMappingDescription={strategyMappingDescription}
          engagementType={engagementType}
          setShowTooltip={setShowTooltip}
          showTooltip={showTooltip}
          handleOpen={handleOpen}
          dispatch={dispatch}
          getProjectById={getProjectById} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages < 1 ? 1 : totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ResourceList;
