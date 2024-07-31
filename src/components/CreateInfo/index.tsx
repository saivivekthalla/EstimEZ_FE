import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../features/store";
import { ProjectInterface } from "../../helper/constants/types/common";
import {
  fetchEngagementType,
  fetchPractices,
  fetchProjectType,
  fetchVertical,
  getEngagementType,
  getPractices,
  getProjectType,
  getVerticals,
  postNewProject,
} from "../../features/Info/createInfoSlice";
import { useRouter } from "next/navigation";
import { textCreateInfo, formFields } from "@/helper/constants/textName";
import React from "react";
import { setdataSaved } from "../../features/resource/resourcePlanningSlice";
import Select from "react-select";

const initialValues: ProjectInterface = {
  projectName: "",
  description: "",
  verticalId: 0,
  clientName: "",
  projectTypeIds: [],
  engagementTypeId: 0,
  pursuitLead: "",
  estimationOwner: "",
  opportunityId: "",
  opportunityLink: "",
  practiceIds: [],
  createdBy: "Bounteous",
};

const CreateInfo = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const verticals = useSelector(fetchVertical);
  const engagementTypes = useSelector(fetchEngagementType);
  const practices = useSelector(fetchPractices);
  const practiceList = practices.map((data: any) => {
    return { label: `${data.name}`, value: `${data.id}` };
  });
  const projectTypes = useSelector(fetchProjectType);
  const projectTypeList = projectTypes.map((data: any) => {
    return { label: `${data.name}`, value: `${data.id}` };
  });
  const [loading, setLoading] = useState(false);
  const [createProjectInfo, setCreateProjectInfo] = useState(initialValues);
  const [verticalSelected, setVerticalSelected] = useState<number | undefined>(
    0
  );
  const [engagementTypeSelected, setEngagementTypeSelected] = useState<
    number | undefined
  >(0);
  const [error, setError] = useState(false);
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: any
  ) => {
    const { name, value } = e.target;
    if (type === "url" && !urlPattern.test(value)) {
      setError(true);
    } else {
      setError(false);
      setCreateProjectInfo({
        ...createProjectInfo,
        verticalId: verticalSelected,
        engagementTypeId: engagementTypeSelected,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (urlPattern.test(createProjectInfo.opportunityLink)) {
      setLoading(true);
      dispatch(postNewProject(createProjectInfo)).then((res) => {
        if (res?.payload?.projectId) {
          const { projectId } = res.payload;
          dispatch(setdataSaved(true));
          router.push(`/viewInfo?projectId=${projectId}`);
        }
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    dispatch(getVerticals());
    dispatch(getPractices());
    dispatch(getEngagementType());
    dispatch(getProjectType());
  }, [dispatch]);

  useEffect(() => {
    const isObjectEmpty1 = isObjectEmpty(createProjectInfo);
    if (!isObjectEmpty1) {
      dispatch(setdataSaved(false));
    } else {
      dispatch(setdataSaved(true));
    }
  }, [createProjectInfo]);

  const isObjectEmpty = (obj: ProjectInterface) => {
    return Object.keys(obj).every((key) => {
      const value = obj[key as keyof ProjectInterface];
      return (
        value === undefined || (Array.isArray(value) && value.length === 0)
      );
    });
  };

  const handleVerticalChange = (e: any) => {
    const selectedVertcial = e.target.value;
    setVerticalSelected(selectedVertcial);

    setCreateProjectInfo((prevInfo) => ({
      ...prevInfo,
      verticalId: selectedVertcial,
    }));
  };

  const handleEngagementChange = (e: any) => {
    const selectedEngagement = e.target.value;
    setEngagementTypeSelected(selectedEngagement);

    setCreateProjectInfo((prevInfo) => ({
      ...prevInfo,
      engagementType: selectedEngagement,
    }));
  };

  return (
    <div id="infoBg" className="bg-gray-100 p-4">
      <div id="infoC">
        <form
          autoComplete="off"
          onSubmit={(e) => handleSubmit(e)}
          className="w-full"
        >
          <div className="sm:w-3/4 mx-auto py-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formFields.map((field) => (
                <React.Fragment key={field.id}>
                  {field.select ? (
                    <>
                      <div className="col-span-1">
                        <label
                          htmlFor={field.id}
                          className="text-white text-md font-semibold"
                        >
                          {field.label}
                        </label>
                      </div>
                      <div className="col-span-1">
                        <select
                          id={field.id}
                          value={
                            field.label === textCreateInfo.verticalLabel
                              ? verticalSelected
                              : engagementTypeSelected
                          }
                          onChange={
                            field.label === textCreateInfo.verticalLabel
                              ? handleVerticalChange
                              : handleEngagementChange
                          }
                          className="text-white w-full p-3 rounded-md pr-5 bg-[#1c1644f0] border-4 border-[#0C2461] focus:outline-none"
                        >
                          {field.label === textCreateInfo.verticalLabel ? (
                            <>
                              <option
                                disabled
                                value={0}
                                className="text-slate-800"
                              >
                                Select Vertical
                              </option>
                              {verticals.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <>
                              <option disabled value={0}>
                                Select Engagement Type
                              </option>
                              {engagementTypes.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
                      </div>
                    </>
                  ) : field.autocomplete ? (
                    <>
                      <div className="col-span-1">
                        <label
                          htmlFor={field.id}
                          className="text-white text-md font-semibold"
                        >
                          {field.label}
                        </label>
                      </div>
                      <div className="col-span-1">
                        {field.label === textCreateInfo.practicesLabel ? (
                          <Select
                            className="border-4 border-[#0C2461] focus:outline-none"
                            styles={{
                              control: (styles) => ({
                                ...styles,
                                backgroundColor: "#1c1644f0",
                                borderColor: "transparent",
                                boxShadow: "none",
                                border: 0,
                              }),
                            }}
                            onChange={(slectedOptions: any) => {
                              setCreateProjectInfo({
                                ...createProjectInfo,
                                practiceIds: slectedOptions.map((data: any) => {
                                  return parseInt(data.value); //should be changed
                                }),
                              });
                            }}
                            options={practiceList}
                            isMulti
                          />
                        ) : (
                          <Select
                            className="border-4 border-[#0C2461] focus:outline-none"
                            styles={{
                              control: (styles) => ({
                                ...styles,
                                backgroundColor: "#1c1644f0",
                                borderColor: "transparent",
                                boxShadow: "none",
                                border: 0,
                              }),
                            }}
                            onChange={(selectedOptions: any) => {
                              setCreateProjectInfo({
                                ...createProjectInfo,
                                projectTypeIds: selectedOptions.map(
                                  (data: any) => {
                                    return parseInt(data.value); //should be changed
                                  }
                                ),
                              });
                            }}
                            options={projectTypeList}
                            isMulti
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-1">
                        <label
                          htmlFor={field.id}
                          className="text-white text-md font-semibold"
                        >
                          {field.label}
                        </label>
                      </div>
                      <div className="col-span-1">
                        <input
                          type={field.type}
                          id={field.id}
                          placeholder={field.placeholder}
                          onChange={(e) => handleChange(e, field.type)}
                          name={field.name}
                          required={field.required}
                          className="w-full p-3 rounded-md bg-[#1c1644f0] border-4 border-[#0C2461] text-white focus:outline-none"
                          maxLength={field.id === "descriptionL" ? 75 : 35}
                        />
                        {field.type === "url" && error && (
                          <p className="text-red-500">Not a valid URL</p>
                        )}
                      </div>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="text-right mr-7">
            <button
              id="createButton"
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
              disabled={loading}
            >
              {textCreateInfo.createButtonLabel}
            </button>
            {loading && (
              <div className="inline-block ml-2">
                <svg
                  className="animate-spin h-5 w-5 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4zm14-1.5A7.962 7.962 0 0120 12h-4c0 3.309-2.691 6-6 6v-4zM12 20a7.963 7.963 0 01-5.291-2H4c0 4.418 3.582 8 8 8v-4zm6.708-7.5H20c0-4.418-3.582-8-8-8v4c3.309 0 6 2.691 6 6z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInfo;
