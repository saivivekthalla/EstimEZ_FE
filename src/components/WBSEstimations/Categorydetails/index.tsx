import Image from "next/image";
import DropdownIcon from "../../../../public/assets/svg/dropdown-icon.svg";
import ArrowupIcon from "../../../../public/assets/svg/dropdown-arrow-up.svg";
import toolTip from '../../../../public/assets/svg/tool-tip-green.svg'
import PlusIcon from '../../../../public/assets/svg/plus-icon-white.svg'
import blurredtick from '../../../../public/assets/svg/blurred-tick-icon.svg'
import tickicon from '../../../../public/assets/svg/tickicon-black.svg'
import closeicon from '../../../../public/assets/svg/closeicon-black.svg'
import editicon from '../../../../public/assets/svg/editicon-black.svg'
import { SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWbsEstimationDetails, getMasterWbsTemplate, fetchMasterTemplate, fetchCurrentTemplate } from "../../../features/wbs/wbsSlice"
import { AppDispatch } from "../../../features/store";
import { getCurrentWBS, getCurrentPractice, setCurrentTemplateId } from "@/features/estimation/estmationSlice";
import { getcurrentTemplateId } from "@/helper/utility/dateFunctions"
import { mergeData, sortCategories, transformData } from "@/helper/utility/helperFunctions";
import { Category,EditingCategoryState,SubcategoryConfig } from "@/helper/constants/types/WbsPagetypes/WbsEstimationstypes";

const initialCategories: Category[] = [];

const CategoryDetails = (props: any) => {

    const custom: boolean = props.custom;
    const qaTemplate: boolean = props.qaTemplate;
    const [showSimpleTooltip, setShowSimpleTooltip] = useState([-1, -1]);
    const [showMediumTooltip, setShowMediumTooltip] = useState([-1, -1]);
    const [showComplexTooltip, setShowComplexTooltip] = useState([-1, -1]);
    const [newCategory, setnewCategory] = useState(false)
    const [category_inputValue, setcategory_inputValue] = useState('');
    const [newsubCategory, setnewsubCategory] = useState(false)
    const [subcategory_inputValue, setsubcategory_inputValue] = useState('');
    const [subcategory_configValues, setsubcategory_configValues] = useState<SubcategoryConfig>({ simple: -1, medium: -1, complex: -1 })
    const [editedSubcategoryValue, setEditedSubcategoryValue] = useState<number | string>('');
    const [editedSubcategoryconfigValue, setEditedSubcategoryconfigValue] = useState<SubcategoryConfig>({ simple: -1, medium: -1, complex: -1 });
    const [editedcategoryValue, setEditedcategoryValue] = useState<number | string>('');
    const [editingState, setEditingState] = useState<EditingCategoryState>({})
    const [editingcategoryState, setEditingcategoryState] = useState<EditingCategoryState>({});
    const [activeSubCategoryCategoryId, setActiveSubCategoryCategoryId] = useState<number | null>(null);
    const [newEstimation, setnewEstimation] = useState(true);
    const [issubValid, setIssubValid] = useState(true);
    const [iscategoryValid, setIscategoryValid] = useState(true);
    const [openCategory, setOpenCategory] = useState<Array<number>>([])
    const [openSubcategory, setOpenSubcategory] = useState<Array<Object>>([])
    const currentPractice = useSelector(getCurrentPractice);
    const currentWbs = useSelector(getCurrentWBS)
    const dispatch = useDispatch<AppDispatch>();

    const handleCategoryInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
        const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);

        const existingCategory = categoryList.find((category: any) => {
            if (isNaN(category.category)) {
                return category.category === e.target.value;
            } else {
                return getCategoryName(category.category) === e.target.value;
            }
        });

        if (existingCategory) {

            setIscategoryValid(false)
        } else {
            setcategory_inputValue(e.target.value);
            setIscategoryValid(true)
        }
    };
    const handlesubCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>, categoryIndex: number) => {

        const { name, value } = e.target;

        if (name === 'name') {
            const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
            const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);

            const existingSubCategory = categoryList[categoryIndex]?.subcategories?.find((subCategory: any) => {
                if (isNaN(subCategory.subcategory)) {
                    return subCategory.subcategory === value;
                } else {
                    return getSubcategoryName(categoryList[categoryIndex].category, subCategory.subcategory) === value;
                }
            });

            if (existingSubCategory) {

                setIssubValid(false)
            } else {
                setsubcategory_inputValue(value);
                setIssubValid(true)
            }

        } else if (name === 'simple' || name === 'medium' || name === 'complex') {
            const parsedValue = parseInt(value, 10) || 0;
            const validatedValue = Math.max(parsedValue, 0)
            setsubcategory_configValues((prevValues) => ({
                ...prevValues,
                [name]: validatedValue

            }));
        }
    };

    const handleEditSubCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>, categoryIndex: number) => {

        const { name, value } = e.target;

        if (name === 'name') {
            const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
            const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);

            const existingSubCategory = categoryList[categoryIndex]?.subcategories?.find((subCategory:any) => {
                if (isNaN(subCategory.subcategory)) {
                    return subCategory.subcategory === value;
                } else {
                    return getSubcategoryName(categoryList[categoryIndex].category, subCategory.subcategory) === value;
                }
            });

            if (existingSubCategory) {
                setEditedSubcategoryValue(value);
                setIssubValid(false)
            } else {
                setEditedSubcategoryValue(value);
                setIssubValid(true)
            }

        } else if (name === 'simple' || name === 'medium' || name === 'complex') {
            const parsedValue = parseInt(value, 10) || 0;
            const validatedValue = Math.max(parsedValue, 0)
            setEditedSubcategoryconfigValue((prevValues: any) => ({
                ...prevValues,
                [name]: validatedValue

            }));
        }
    };


    const category_tickSrc = (iscategoryValid && category_inputValue) ? tickicon : blurredtick
    const subcategory_tickSrc = (issubValid && subcategory_inputValue && subcategory_configValues && Object.values(subcategory_configValues).every(value => value > 0)) ? tickicon : blurredtick;
    const editsubcategory_tickSrc = (issubValid && editedSubcategoryValue && Object.values(editedSubcategoryconfigValue).every(value => value > 0)) ? tickicon : blurredtick;
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [customCategories, setcustomCategories] = useState<Category[]>([]);
    const [qaCategories, setqaCategories] = useState<Array<Category>>([]);

    const masterTemplate = useSelector(fetchMasterTemplate);

    const getCategoryName = (id: number) => {
        return masterTemplate[0]?.content?.taskDetails[id - 1]?.taskName;
    }
    const getSubcategoryName = (categoryId: string | number, subategoryId: number) => {
        return masterTemplate[0]?.content?.taskDetails[Number(categoryId) - 1]?.subTaskDetails[subategoryId - 1]?.subTaskName;
    }

    const currentTemplate: any = useSelector(fetchCurrentTemplate);

    useEffect(() => {
        if (currentWbs?.estimations?.length > 0) {
            //qa
            const value = currentWbs?.estimations?.find((record: any) => record?.practiceRecord?.id == currentPractice.id)
            if (value?.qaDetails && value?.qaDetails?.length > 0) {
                dispatch(setCurrentTemplateId(value.templateId))
                setqaCategories(value.qaDetails)
            }
            //default
            const matchingEstimation = currentWbs.estimations.some((obj: { practiceRecord: { name: any; }; }) => obj?.practiceRecord?.name === currentPractice.name);
            if (matchingEstimation) {
                setnewEstimation(false);
                const templateId = getcurrentTemplateId(currentWbs, currentPractice.name)
                dispatch(setCurrentTemplateId(templateId))
            } else {
                setnewEstimation(true);
                dispatch(setCurrentTemplateId(null))
            }
        } else {
            setnewEstimation(true);
            dispatch(setCurrentTemplateId(null))
        }
    }, []);

    useEffect(() => {
        if (!(custom || qaTemplate))
            dispatch(getMasterWbsTemplate(currentPractice.id));
    }, [newEstimation]);

    useEffect(() => {
        if (newEstimation) {
            const sortedData = sortCategories(transformData(masterTemplate), getCategoryName, getSubcategoryName)
            setCategories(sortedData);
        }
    }, [masterTemplate]);

    useEffect(() => {
        
        if (custom) {
            setcustomCategories(currentTemplate?.content)
            dispatch(setWbsEstimationDetails(currentTemplate?.content))
        }
        else {
            const mergedData = mergeData(transformData(masterTemplate), currentTemplate?.content)
            const sortedData = sortCategories(mergedData, getCategoryName, getSubcategoryName);
            setCategories(sortedData)
            dispatch(setWbsEstimationDetails(sortedData))

        }

    }, [currentTemplate]);

    useEffect(() => {
        if (qaTemplate)
            dispatch(setWbsEstimationDetails(qaCategories))
        else {
            if (custom) {
                dispatch(setWbsEstimationDetails(customCategories))
            }
            else {
                dispatch(setWbsEstimationDetails(categories));
            }
        }
        setnewCategory(false)
        setOpenCategory([])
        setOpenSubcategory([])
    }, [custom, qaTemplate])
    
    const handlesubcategoryChanges = (categoryIndex: number, subcategoryIndex: number) => {
        //This function executes while saving the edited changes

        const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
        const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);

        if (categoryIndex !== -1 && subcategoryIndex !== -1) {
            setCategoryList((prevCategories) => {
                const updatedCategories = prevCategories.map((category, currentIndex) => {
                    if (currentIndex === categoryIndex) {
                        // Update the subcategories for the current category
                        const updatedSubcategories = category.subcategories.map((subcategory, subIndex) => {
                            if (subIndex === subcategoryIndex) {
                                // Update the hours for the specific subcategory
                                return {
                                    ...subcategory,
                                    subcategory: editedSubcategoryValue,
                                    simpleHours: editedSubcategoryconfigValue.simple,
                                    mediumHours: editedSubcategoryconfigValue.medium,
                                    complexHours: editedSubcategoryconfigValue.complex
                                };
                            }
                            return subcategory;
                        });

                        // Calculate the new totalHours for the category
                        const newTotalHours = updatedSubcategories.reduce((total, subcategory) => {
                            return total + (subcategory.simple ?? 0) * subcategory.simpleHours + (subcategory.medium ?? 0) * subcategory.mediumHours + (subcategory.complex ?? 0) * subcategory.complexHours;
                        }, 0);

                        // Update the category with the updated subcategories and totalHours
                        return {
                            ...category,
                            subcategories: updatedSubcategories,
                            totalHours: newTotalHours
                        };
                    }
                    return category;
                });

                const sortedCategories = sortCategories(updatedCategories, getCategoryName, getSubcategoryName);

                dispatch(setWbsEstimationDetails(sortedCategories));
                return sortedCategories;
            });

            setEditingState((prevEditingState) => ({
                ...prevEditingState,
                [`${categoryIndex}-${subcategoryIndex}`]: false,
            }));

            setEditedSubcategoryValue('');
            setEditedSubcategoryconfigValue({
                simple: -1,
                medium: -1,
                complex: -1,
            });
        }
    };

    const handleCategoryChanges = (categoryIndex: number) => {
        const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
        const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);

        if (categoryIndex >= 0 && categoryIndex < categoryList.length) {
            setCategoryList((prevCategories) => {
                const updatedCategories = [...prevCategories];
                updatedCategories[categoryIndex] = {
                    ...updatedCategories[categoryIndex],
                    category: editedcategoryValue
                };

                // Sort the categories using the provided sortCategories function
                const sortedCategories = sortCategories(updatedCategories, getCategoryName, getSubcategoryName);

                dispatch(setWbsEstimationDetails(sortedCategories));
                return sortedCategories;
            });

            setEditingcategoryState((prevEditingState) => ({
                ...prevEditingState,
                [`${categoryIndex}`]: false,
            }));

            setEditedcategoryValue('');
          
        }
    };

    const handleInputChange = (categoryId: number, subcategoryId: number, field: string, value: number | null) => {
        const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
        const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);

        setCategoryList((prevCategories) => {
            const updatedCategories = prevCategories.map((category, currentIndex) => {
                if (currentIndex === categoryId) {
                    const updatedSubcategories = category.subcategories.map((subcategory, subIndex) => {
                        if (subIndex === subcategoryId) {
                            return {
                                ...subcategory,
                                [field]: value,
                            };
                        }
                        return subcategory;
                    });

                    // Calculate sums for the updated category
                    let simpleHoursSum = 0;
                    let mediumHoursSum = 0;
                    let complexHoursSum = 0;

                    let simpleCompnentsSum = 0;
                    let mediumCompnentsSum = 0;
                    let complexCompnentsSum = 0;

                    updatedSubcategories.forEach((subcategory) => {
                        simpleCompnentsSum += (subcategory?.simple ?? 0);
                        mediumCompnentsSum += (subcategory?.medium ?? 0);
                        complexCompnentsSum += (subcategory?.complex ?? 0);
                        simpleHoursSum += (subcategory?.simple ?? 0) * (subcategory?.simpleHours ?? 0);
                        mediumHoursSum += (subcategory?.medium ?? 0) * (subcategory?.mediumHours ?? 0);
                        complexHoursSum += (subcategory?.complex ?? 0) * (subcategory?.complexHours ?? 0);
                    });

                    // Update the values for the category
                    return {
                        ...category,
                        subcategories: updatedSubcategories,
                        simple: simpleCompnentsSum,
                        medium: mediumCompnentsSum,
                        complex: complexCompnentsSum,
                        totalHours: simpleHoursSum + mediumHoursSum + complexHoursSum
                    };
                }
                return category;
            });

            dispatch(setWbsEstimationDetails(updatedCategories))
            return updatedCategories;

        });


    };

    const handleAddSubCategory = (categoryIndex: number) => {
        // Find the category with the specified index

        const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
        const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);


        if (categoryIndex !== -1) {
            const existingSubCategory = categoryList[categoryIndex]?.subcategories?.find(
                (subCategory) => subCategory.subcategory === subcategory_inputValue
            );

            if (!existingSubCategory) {
                const newSubCategory = {

                    subcategory: subcategory_inputValue,
                    simple: 0,
                    medium: 0,
                    complex: 0,
                    simpleHours: subcategory_configValues.simple,
                    mediumHours: subcategory_configValues.medium,
                    complexHours: subcategory_configValues.complex
                };

                setCategoryList((prevCategories) => {
                    const updatedCategories = [...prevCategories];
                    updatedCategories[categoryIndex] = {
                        ...updatedCategories[categoryIndex],
                        subcategories: [...updatedCategories[categoryIndex].subcategories, newSubCategory],
                    };
                    const sortedCategories = sortCategories(updatedCategories, getCategoryName, getSubcategoryName); // Sort the categories after adding the subcategory
                    dispatch(setWbsEstimationDetails(sortedCategories))
                    return sortedCategories;
                });
            } else {
                console.log("Subcategory with the same name already exists!");
            }

            setnewsubCategory(false);
            setsubcategory_inputValue('');
            setsubcategory_configValues({ simple: -1, medium: -1, complex: -1 })
        }

    };

    const handleAddCategory = () => {
        const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
        const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);

        const existingCategory = categoryList.find(
            (category) => category.category === category_inputValue
        );

        if (!existingCategory) {
            const newCategory = {
                category: category_inputValue,
                subcategories: [],
                simple: null,
                medium: null,
                complex: null,
                totalHours: null
            };

            const updatedCategoryList = [...categoryList, newCategory];
            const sortedCategoryList = sortCategories(updatedCategoryList, getCategoryName, getSubcategoryName);
            setCategoryList(sortedCategoryList);
            dispatch(setWbsEstimationDetails(sortedCategoryList))
            // Reset the input value after adding the category
            setcategory_inputValue('');
        } else {
            console.log("Category with the same name already exists!");
        }

        setnewCategory(false);

    };

    const deleteSubcategory = (categoryIndex: number, subcategoryIndex: number) => {
        const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
        const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);


        setCategoryList((prevCategories) => {
            const updatedCategories = prevCategories.map((category, index) => {
                if (index === categoryIndex) {
                    const subcategory = category.subcategories[subcategoryIndex];
                    const totalSubcategoryHours =
                        (subcategory?.simple || 0) * subcategory.simpleHours +
                        (subcategory?.medium || 0) * subcategory.mediumHours +
                        (subcategory?.complex || 0) * subcategory.complexHours
                    return {
                        ...category,
                        subcategories: category.subcategories.filter((_, subIndex) => subIndex !== subcategoryIndex),
                        simple: (category.simple ?? 0) - (subcategory && subcategory.simple != null ? subcategory.simple : 0),
                        medium: (category.medium ?? 0) - (subcategory && subcategory.medium != null ? subcategory.medium : 0),
                        complex: (category.complex ?? 0) - (subcategory && subcategory.complex != null ? subcategory.complex : 0),
                        totalHours: (category.totalHours) ? category.totalHours - totalSubcategoryHours : 0
                    };

                }
                return category;
            });
            dispatch(setWbsEstimationDetails(updatedCategories))
            return updatedCategories; // Return the updated categories
        });


    };

    const deleteCategory = (categoryIndex: number) => {

        const categoryList = qaTemplate ? qaCategories : (custom ? customCategories : categories);
        const setCategoryList = qaTemplate ? setqaCategories : (custom ? setcustomCategories : setCategories);
        setCategoryList((prevCategories) => {
            const updatedCategories = prevCategories.filter((_, index) => index !== categoryIndex)
            dispatch(setWbsEstimationDetails(updatedCategories))
            return updatedCategories
        });
        setnewsubCategory(false)

    };

    const handlesubcategoryEditClick = (categoryIndex: number, subcategoryIndex: number) => {

        setEditingState((prevEditingState) => ({
            ...prevEditingState,
            [`${categoryIndex}-${subcategoryIndex}`]: true,
        }));
    };

    const handlecategoryEditClick = (categoryIndex: number) => {
        setEditingcategoryState((prevEditingState) => ({
            ...prevEditingState,
            [`${categoryIndex}`]: true,
        }));
    };

    const handleCategoryToggle = (categoryIndex: number) => {
        if (openCategory.includes(categoryIndex))
            setOpenCategory(openCategory.filter((item) => item != categoryIndex))
        else
            setOpenCategory([...openCategory, categoryIndex])

        setEditingcategoryState((prevEditingState) => ({
            ...prevEditingState,
            [`${categoryIndex}`]: false,
        }));



    };

    const handleSubcategoryToggle = (categoryIndex: number, subcategoryIndex: number) => {
        if (openSubcategory.some((obj: any) => obj.category == categoryIndex && obj.subCategory == subcategoryIndex)) {
            setOpenSubcategory(openSubcategory.filter((obj: any) => !(obj.category === categoryIndex && obj.subCategory === subcategoryIndex)))
        }
        else {
            setOpenSubcategory((prevCategories) => [...prevCategories, { category: categoryIndex, subCategory: subcategoryIndex }])
        }

        setEditingState((prevEditingState) => ({
            ...prevEditingState,
            [`${categoryIndex}-${subcategoryIndex}`]: false,
        }));
    };


    return (
        <div>
            <div className="flex flex-col gap-2 mx-6">

                {(qaTemplate ? (qaCategories) : (custom ? customCategories : categories))?.map((category, category_index) => (
                    <div key={category_index} className="flex flex-col gap-2 font-semibold text-md text-white h-15 w-[100%] rounded-xl">
                        {typeof category.category === 'number' ? (
                            <div className={`flex bg-[#885AD5] rounded-xl p-2 w-full ${openCategory.includes(category_index) ? 'bg-opacity-90' : 'bg-opacity-100'}`}>
                                <div className="mx-2 m-1">
                                    <Image
                                        className="mx-2 hover:cursor-pointer"
                                        src={openCategory.includes(category_index) ? ArrowupIcon : DropdownIcon}
                                        alt="Dropdown"
                                        width={30}
                                        height={30}
                                        onClick={() => handleCategoryToggle(category_index)}
                                    />
                                </div>
                                <div>
                                    <div className="mx-3">
                                        {typeof category.category == 'number' ? getCategoryName(category.category) : category.category} <br />
                                        <div className="text-[#CCCCCC] text-sm">{category.totalHours ?? 0} Hrs</div>                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex">
                                <div className={`flex bg-[#885AD5] w-[80%] rounded-l-xl p-2 ${openCategory.includes(category_index) ? 'bg-opacity-90' : 'bg-opacity-100'}`}>
                                    {!editingcategoryState[`${category_index}`] ? (
                                        <div className="flex">
                                            <div className="mx-2 m-1">
                                                <Image
                                                    className="mx-2 hover:cursor-pointer"
                                                    src={openCategory.includes(category_index) ? ArrowupIcon : DropdownIcon}
                                                    alt="Dropdown"
                                                    width={30}
                                                    height={30}
                                                    onClick={() => handleCategoryToggle(category_index)}
                                                />
                                            </div>
                                            <div>
                                                <div className="mx-3">
                                                    {category.category} <br />
                                                    <div className="text-[#CCCCCC] text-sm">{category.totalHours ?? 0} Hrs</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={editedcategoryValue}
                                            className="p-4 text-black my-2 mx-6 w-[80%] rounded-xl h-8"
                                            onChange={(e) => setEditedcategoryValue(e.target.value)}
                                        />
                                    )
                                    }

                                </div>
                                <div className="flex bg-[#A480DF] w-[20%]  shadow-[inset_1px_0px_5px_#00000050] rounded-r-xl">
                                    <button
                                        className='ml-4'
                                        onClick={() => {
                                            if (editingcategoryState[`${category_index}`] == true) {

                                                handleCategoryChanges(category_index)
                                            }
                                            else {
                                                handlecategoryEditClick(category_index)
                                                setEditedcategoryValue(category.category);
                                                setEditingcategoryState((prevEditingState) => ({
                                                    ...prevEditingState,
                                                    [`${category_index}`]: true,
                                                }));
                                            }
                                        }}
                                    >
                                        <Image
                                            src={editingcategoryState[`${category_index}`] ? tickicon : editicon}
                                            alt="Save"
                                            width={25}
                                            height={25}

                                        />
                                    </button>
                                    <button className='mx-2'
                                        onClick={() => {
                                            deleteCategory(category_index)
                                            setnewCategory(false)
                                        }}
                                    >
                                        <Image
                                            src={closeicon}
                                            alt="Delete"
                                            width={25}
                                            height={25}
                                        />
                                    </button>

                                </div>
                            </div>
                        )}


                        {openCategory.includes(category_index) && (
                            <div className="flex flex-col gap-2 font-semibold text-md text-white h-15 w-[100%] rounded-xl">
                                {category?.subcategories?.map((subcategory, subcategory_index) => (
                                    (typeof subcategory.subcategory === "number") ? (
                                        <div key={subcategory_index} className="flex bg-[#2B205F] rounded-xl p-2 w-[85%] ml-auto">
                                            <div className="mx-2 m-1">
                                                <Image
                                                    className="mx-2 hover:cursor-pointer"
                                                    src={openSubcategory.some((obj: any) => obj.category == category_index && obj.subCategory == subcategory_index) ? ArrowupIcon : DropdownIcon}
                                                    alt="Dropdown"
                                                    width={30}
                                                    height={30}
                                                    onClick={() => handleSubcategoryToggle(category_index, subcategory_index)}
                                                />
                                            </div>
                                            <div>
                                                <div className="mx-3">
                                                    {typeof (subcategory.subcategory) == 'number' ? getSubcategoryName(category.category, subcategory.subcategory) : subcategory.subcategory} <br />                                                    <div className="text-[#CCCCCC] text-sm">
                                                        {((subcategory.simple ?? 0) * (subcategory.simpleHours ?? 0) +
                                                            (subcategory.complex ?? 0) * (subcategory.complexHours ?? 0) +
                                                            (subcategory.medium ?? 0) * (subcategory.mediumHours ?? 0))} Hrs
                                                    </div>

                                                </div>
                                                {openSubcategory.some((obj: any) => obj.category == category_index && obj.subCategory == subcategory_index) ? (
                                                    <div className="flex relative">

                                                        <input
                                                            className="w-20 text-xs text-black rounded-md m-1 p-2 pr-5"
                                                            placeholder="Simple"
                                                            value={(subcategory.simple == null || subcategory.simple == 0) ? '' : subcategory.simple}

                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                handleInputChange(category_index, subcategory_index, 'simple', isNaN(value) ? null : value);
                                                            }}

                                                        />



                                                        <Image
                                                            src={toolTip}
                                                            alt="image"
                                                            height={15}
                                                            width={15}
                                                            className="absolute ml-1 mb-1 cursor-pointer bg-white rounded-full"
                                                            style={{ top: '34%', transform: 'translateX(415%)' }}
                                                            onMouseEnter={() => setShowSimpleTooltip([category_index, subcategory_index])}
                                                            onMouseLeave={() => setShowSimpleTooltip([-1, -1])}
                                                        />
                                                        <div
                                                            className={`ml-1 text-xs absolute w-48 text-white opacity-100 bg-black  p-2 rounded-md ${showSimpleTooltip[0] === category_index && showSimpleTooltip[1] === subcategory_index ? 'block' : 'hidden'
                                                                }`}
                                                            style={{ top: '110%', transform: 'translateX(-60%)' }}
                                                        >
                                                            Requires {subcategory.simpleHours} hours, straightforward with minimal complexity.
                                                        </div>



                                                        <input
                                                            className="w-20 text-xs text-black rounded-md m-1 p-2 pr-5"
                                                            placeholder="Medium"
                                                            value={(subcategory.medium == null || subcategory.medium == 0) ? '' : subcategory.medium}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                handleInputChange(category_index, subcategory_index, 'medium', isNaN(value) ? null : value);
                                                            }}
                                                        />


                                                        <Image
                                                            src={toolTip}
                                                            alt="image"
                                                            height={15}
                                                            width={15}
                                                            className="absolute ml-1 mb-1 cursor-pointer bg-white rounded-full"
                                                            style={{ top: '34%', transform: 'translateX(1000%)' }}
                                                            onMouseEnter={() => setShowMediumTooltip([category_index, subcategory_index])}
                                                            onMouseLeave={() => setShowMediumTooltip([-1, -1])}
                                                        />
                                                        <div
                                                            className={`ml-1 text-xs absolute w-44 text-white opacity-100 bg-black  p-2 rounded-md ${showMediumTooltip[0] === category_index && showMediumTooltip[1] === subcategory_index ? 'block' : 'hidden'
                                                                }`}
                                                            style={{ top: '110%', transform: 'translateX(-10%)' }}
                                                        >
                                                            Takes {subcategory.mediumHours} hours, moderate complexity and effort required.
                                                        </div>


                                                        <input
                                                            className="w-20 text-xs text-black rounded-md m-1 p-2 pr-5"
                                                            placeholder="Complex"
                                                            value={(subcategory.complex == null || subcategory.complex == 0) ? '' : subcategory.complex}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                handleInputChange(category_index, subcategory_index, 'complex', isNaN(value) ? null : value);
                                                            }}
                                                        />

                                                        <Image
                                                            src={toolTip}
                                                            alt="image"
                                                            height={15}
                                                            width={15}
                                                            className="absolute ml-1 mb-1 cursor-pointer bg-white rounded-full"
                                                            style={{ top: '34%', transform: 'translateX(1590%)' }}
                                                            onMouseEnter={() => setShowComplexTooltip([category_index, subcategory_index])}
                                                            onMouseLeave={() => setShowComplexTooltip([-1, -1])}
                                                        />
                                                        <div
                                                            className={`ml-1 text-xs absolute w-44 text-white opacity-100 bg-black  p-2 rounded-md ${showComplexTooltip[0] === category_index && showComplexTooltip[1] === subcategory_index ? 'block' : 'hidden'
                                                                }`}
                                                            style={{ top: '110%', transform: 'translateX(40%)' }}
                                                        >
                                                            Takes {subcategory.complexHours} hours,intricate processes and extensive analysis.
                                                        </div>
                                                    </div>) : (<div></div>)}



                                            </div>
                                        </div>
                                    ) : (
                                        openSubcategory.some((obj: any) => obj.category == category_index && obj.subCategory == subcategory_index) ? (
                                            <div key={subcategory_index} className="flex bg-[#2B205F]  w-[85%] ml-auto rounded-xl p-2 ">
                                                <div className="flex">
                                                    <div className="mx-2 m-1">
                                                        <Image
                                                            className="mx-2 hover:cursor-pointer"
                                                            src={ArrowupIcon}
                                                            alt="Dropdown"
                                                            width={30}
                                                            height={30}
                                                            onClick={() => handleSubcategoryToggle(category_index, subcategory_index)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="mx-3">
                                                            {subcategory.subcategory} <br />
                                                            <div className="text-[#CCCCCC] text-sm">
                                                                {((subcategory.simple ?? 0) * (subcategory.simpleHours ?? 0) +
                                                                    (subcategory.complex ?? 0) * (subcategory.complexHours ?? 0) +
                                                                    (subcategory.medium ?? 0) * (subcategory.mediumHours ?? 0))} Hrs
                                                            </div>
                                                        </div>
                                                        {openSubcategory.some((obj: any) => obj.category == category_index && obj.subCategory == subcategory_index) ? (
                                                            <div className="flex relative">

                                                                <input
                                                                    className="w-20 text-xs text-black rounded-md m-1 p-2 pr-5"
                                                                    placeholder="Simple"

                                                                    value={(subcategory.simple == null || subcategory.simple == 0) ? '' : subcategory.simple}
                                                                    onChange={(e) => {
                                                                        const value = parseInt(e.target.value);
                                                                        handleInputChange(category_index, subcategory_index, 'simple', isNaN(value) ? null : value);
                                                                    }}
                                                                />


                                                                <Image
                                                                    src={toolTip}
                                                                    alt="image"
                                                                    height={15}
                                                                    width={15}
                                                                    className="absolute ml-1 mb-1 cursor-pointer bg-white rounded-full"
                                                                    style={{ top: '34%', transform: 'translateX(415%)' }}
                                                                    onMouseEnter={() => setShowSimpleTooltip([category_index, subcategory_index])}
                                                                    onMouseLeave={() => setShowSimpleTooltip([-1, -1])}
                                                                />
                                                                <div
                                                                    className={`ml-1 text-xs absolute w-48 text-white opacity-100 bg-black  p-2 rounded-md ${showSimpleTooltip[0] === category_index && showSimpleTooltip[1] === subcategory_index ? 'block' : 'hidden'
                                                                        }`}
                                                                    style={{ top: '110%', transform: 'translateX(-60%)' }}
                                                                >
                                                                    Requires {subcategory.simpleHours} hours, straightforward with minimal complexity.
                                                                </div>



                                                                <input
                                                                    className="w-20 text-xs text-black rounded-md m-1 p-2 pr-5"
                                                                    placeholder="Medium"
                                                                    value={(subcategory.medium == null || subcategory.medium == 0) ? '' : subcategory.medium}
                                                                    onChange={(e) => {
                                                                        const value = parseInt(e.target.value);
                                                                        handleInputChange(category_index, subcategory_index, 'medium', isNaN(value) ? null : value);
                                                                    }}
                                                                />

                                                                <Image
                                                                    src={toolTip}
                                                                    alt="image"
                                                                    height={15}
                                                                    width={15}
                                                                    className="absolute ml-1 mb-1 cursor-pointer bg-white rounded-full"
                                                                    style={{ top: '34%', transform: 'translateX(1000%)' }}
                                                                    onMouseEnter={() => setShowMediumTooltip([category_index, subcategory_index])}
                                                                    onMouseLeave={() => setShowMediumTooltip([-1, -1])}
                                                                />
                                                                <div
                                                                    className={`ml-1 text-xs absolute w-44 text-white opacity-100 bg-black  p-2 rounded-md ${showMediumTooltip[0] === category_index && showMediumTooltip[1] === subcategory_index ? 'block' : 'hidden'
                                                                        }`}
                                                                    style={{ top: '110%', transform: 'translateX(-10%)' }}
                                                                >
                                                                    Takes {subcategory.mediumHours} hours, moderate complexity and effort required.
                                                                </div>


                                                                <input
                                                                    className="w-20 text-xs text-black rounded-md m-1 p-2 pr-5"
                                                                    placeholder="Complex"
                                                                    value={(subcategory.complex == null || subcategory.complex == 0) ? '' : subcategory.complex}
                                                                    onChange={(e) => {
                                                                        const value = parseInt(e.target.value);
                                                                        handleInputChange(category_index, subcategory_index, 'complex', isNaN(value) ? null : value);
                                                                    }}
                                                                />

                                                                <Image
                                                                    src={toolTip}
                                                                    alt="image"
                                                                    height={15}
                                                                    width={15}
                                                                    className="absolute ml-1 mb-1 cursor-pointer bg-white rounded-full"
                                                                    style={{ top: '34%', transform: 'translateX(1590%)' }}
                                                                    onMouseEnter={() => setShowComplexTooltip([category_index, subcategory_index])}
                                                                    onMouseLeave={() => setShowComplexTooltip([-1, -1])}
                                                                />
                                                                <div
                                                                    className={`ml-1 text-xs absolute w-44 text-white opacity-100 bg-black  p-2 rounded-md ${showComplexTooltip[0] === category_index && showComplexTooltip[1] === subcategory_index ? 'block' : 'hidden'
                                                                        }`}
                                                                    style={{ top: '110%', transform: 'translateX(40%)' }}
                                                                >
                                                                    Takes {subcategory.complexHours} hours,intricate processes and extensive analysis.
                                                                </div>
                                                            </div>) :
                                                            (<div></div>)}
                                                    </div>
                                                </div>

                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex w-[85%] ml-auto">
                                                    <div key={subcategory_index} className=" flex bg-[#2B205F] rounded-l-xl w-[80%] p-2 ">
                                                        {!editingState[`${category_index}-${subcategory_index}`] ? (
                                                            <div className="flex">
                                                                <div className="mx-2 m-1">
                                                                    <Image
                                                                        className="mx-2 hover:cursor-pointer"
                                                                        src={DropdownIcon}
                                                                        alt="Dropdown"
                                                                        width={30}
                                                                        height={30}
                                                                        onClick={() => handleSubcategoryToggle(category_index, subcategory_index)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="mx-3">
                                                                        {subcategory.subcategory} <br />
                                                                        <div className="text-[#CCCCCC] text-sm">
                                                                            {((subcategory.simple ?? 0) * (subcategory.simpleHours ?? 0) +
                                                                                (subcategory.complex ?? 0) * (subcategory.complexHours ?? 0) +
                                                                                (subcategory.medium ?? 0) * (subcategory.mediumHours ?? 0))} Hrs
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={editedSubcategoryValue}
                                                                    className="p-4 text-black my-2 mx-6 w-[80%] rounded-xl h-8"
                                                                    onChange={(e) => handleEditSubCategoryInputChange(e,category_index)}
                                                                />
                                                                {!issubValid && <p className="mx-9 text-red-700 text-[60%] ">Subcategory already exists</p>}
                                                            </div>
                                                        )
                                                        }

                                                    </div>
                                                    <div className="flex bg-[#A480DF] w-[20%]  shadow-[inset_1px_0px_5px_#00000050] rounded-r-xl">
                                                        <button
                                                            className='ml-4'
                                                            disabled={editingState[`${category_index}-${subcategory_index}`] == true ? 
                                                                        ( issubValid && editedSubcategoryValue && (Object.values(editedSubcategoryconfigValue).every(value => value > 0 )) 
                                                                        ? false : true ) 
                                                                    :false}
                                                            onClick={() => {
                                                                if (editingState[`${category_index}-${subcategory_index}`] == true) {
                                                                    handlesubcategoryChanges(category_index, subcategory_index)
                                                                }
                                                                else {
                                                                    handlesubcategoryEditClick(category_index, subcategory_index)
                                                                    setEditedSubcategoryValue(subcategory.subcategory);
                                                                    setEditedSubcategoryconfigValue({ simple: subcategory.simpleHours, medium: subcategory.mediumHours, complex: subcategory.complexHours })
                                                                    setEditingState((prevEditingState) => ({
                                                                        ...prevEditingState,
                                                                        [`${category_index}-${subcategory_index}`]: true,
                                                                    }));
                                                                }

                                                            }}
                                                        >
                                                            <Image
                                                                src={editingState[`${category_index}-${subcategory_index}`] ? editsubcategory_tickSrc : editicon}
                                                                alt="Dropdown"
                                                                width={25}
                                                                height={25}

                                                            />
                                                        </button>
                                                        <button className='mx-2'
                                                            onClick={() => {
                                                                setnewsubCategory(false)
                                                                deleteSubcategory(category_index, subcategory_index)
                                                            }}
                                                        >
                                                            <Image
                                                                src={closeicon}
                                                                alt="Dropdown"
                                                                width={25}
                                                                height={25}
                                                            />
                                                        </button>

                                                    </div>


                                                </div>
                                                {editingState[`${category_index}-${subcategory_index}`] ? (
                                                    <div className="bg-[#885AD5] ml-auto mt-2 flex flex-col items-center gap-3 justify-center h-24 w-[80%] rounded-xl">
                                                        <h2 className="justify-center text-white text-sm">
                                                            Configure Simple, Medium, Complex in hrs
                                                        </h2>
                                                        <div className="flex w-full ml-auto justify-evenly">
                                                            <div className="w-20 m-1 flex after:px-1 after:h-7 text-black font-normal after:content-['hrs'] after:rounded-r-md after:bg-slate-200 after:vertical-align:-50%">
                                                                <input
                                                                    name="simple"
                                                                    value={isNaN(editedSubcategoryconfigValue.simple) ? "" : editedSubcategoryconfigValue.simple ?? ''}
                                                                    onChange={(e) =>
                                                                        setEditedSubcategoryconfigValue((prevValues) => ({
                                                                            ...prevValues,
                                                                            simple: parseInt(e.target.value),
                                                                        }))
                                                                    }
                                                                    className="text-black w-full px-2 h-7 rounded-l-md after:relative [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

                                                                />
                                                            </div>

                                                            <div className="w-20 m-1 flex after:px-1 after:h-7 text-black font-normal after:content-['hrs'] after:rounded-r-md after:bg-slate-200 after:vertical-align:-50%  ">
                                                                <input name="medium"
                                                                    value={editedSubcategoryconfigValue.medium ?? ''}
                                                                    onChange={(e) =>
                                                                        setEditedSubcategoryconfigValue((prevValues) => ({
                                                                            ...prevValues,
                                                                            medium: parseInt(e.target.value),
                                                                        }))
                                                                    }
                                                                    className="text-black w-full h-7 px-2 rounded-l-md after:relative [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" />
                                                            </div>
                                                            <div className="w-20 m-1 flex after:px-1 after:h-7 text-black font-normal after:content-['hrs'] after:rounded-r-md after:bg-slate-200 after:vertical-align:-50%  ">
                                                                <input name="complex"
                                                                    value={editedSubcategoryconfigValue.complex ?? ''}
                                                                    onChange={(e) =>
                                                                        setEditedSubcategoryconfigValue((prevValues) => ({
                                                                            ...prevValues,
                                                                            complex: parseInt(e.target.value),
                                                                        }))
                                                                    }

                                                                    className="text-black w-full h-7 px-2 rounded-l-md after:relative [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                ) : (<></>)}
                                            </div>
                                        )

                                    )


                                ))}


                                {newsubCategory && category_index === activeSubCategoryCategoryId ? (
                                    <div>
                                        <div className={`flex text-white font-semibold rounded-xl w-[85%] h-16 ml-auto`}>
                                            <div className=" w-[80%] h-16 bg-[#2B205F] rounded-l-xl ">
                                                <input
                                                    placeholder="Enter Subcategory name"
                                                    className="p-4 text-black mt-4 mx-6 w-[80%] rounded-xl h-8 focus:outline-0"
                                                    name="name"
                                                    onChange={(e) => handlesubCategoryInputChange(e, category_index)}

                                                />
                                                {!issubValid && <p className="mx-9 text-red-700 text-[60%] ">Subcategory already exists</p>}
                                            </div>
                                            <div className="flex bg-[#A480DF] w-[20%] shadow-[inset_1px_0px_5px_#00000050] rounded-r-xl">
                                                <button
                                                    disabled={(issubValid && subcategory_inputValue && subcategory_configValues && Object.values(subcategory_configValues).every(value => value > 0)) ? false : true}
                                                    className='ml-4'
                                                    title={(subcategory_inputValue && subcategory_configValues && Object.values(subcategory_configValues).every(value => value > 0)) ? '' : 'Please enter a valid input'}
                                                    onClick={() => {
                                                        handleAddSubCategory(category_index);
                                                    }}
                                                >
                                                    <Image
                                                        src={subcategory_tickSrc}
                                                        alt="Dropdown"
                                                        width={25}
                                                        height={25}
                                                    />
                                                </button>
                                                <button className='mx-2'
                                                    onClick={() => { setnewsubCategory(false); setIssubValid(true) }}
                                                >
                                                    <Image
                                                        src={closeicon}
                                                        alt="Dropdown"
                                                        width={25}
                                                        height={25}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-[#885AD5] ml-auto mt-2 flex flex-col items-center gap-3 justify-center h-24 w-[80%] rounded-xl">
                                            <h2 className="justify-center text-white text-sm">
                                                Configure Simple, Medium, Complex in hrs
                                            </h2>
                                            <div className="flex w-full ml-auto justify-evenly">
                                                <div className="w-20 m-1 flex after:px-1 after:h-7 text-black font-normal after:content-['hrs'] after:rounded-r-md after:bg-slate-200 after:vertical-align:-50%  ">
                                                    <input name="simple"
                                                        min="1"
                                                        onChange={(e) => handlesubCategoryInputChange(e, category_index)}
                                                        className="text-black w-full px-2 h-7 rounded-l-md after:relative [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number"
                                                    />
                                                </div>
                                                <div className="w-20 m-1 flex after:px-1 after:h-7 text-black font-normal after:content-['hrs'] after:rounded-r-md after:bg-slate-200 after:vertical-align:-50%  ">
                                                    <input name="medium" onChange={(e) => handlesubCategoryInputChange(e, category_index)}
                                                        className="text-black w-full h-7 px-2 rounded-l-md after:relative [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" />
                                                </div>
                                                <div className="w-20 m-1 flex after:px-1 after:h-7 text-black font-normal after:content-['hrs'] after:rounded-r-md after:bg-slate-200 after:vertical-align:-50%  ">
                                                    <input name="complex" onChange={(e) => handlesubCategoryInputChange(e, category_index)}
                                                        className="text-black w-full h-7 px-2 rounded-l-md after:relative [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <button className=" bg-[#2B205F] flex  rounded-xl p-2 w-[50%] ml-auto mr-20 hover:bg-opacity-60"
                                    onClick={() => { setnewsubCategory(true); setActiveSubCategoryCategoryId(category_index); }}
                                >
                                    <div>
                                        <Image
                                            className="mx-2 hover:cursor-pointer"
                                            src={PlusIcon}
                                            alt="Dropdown"
                                            width={30}
                                            height={30}
                                        />
                                    </div>
                                    <div className=" font-semibold text-white mt-1">
                                        Add Subcategory
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {newCategory ? (
                    <div className={`flex  text-white font-semibold rounded-xl  w-full h-16`}>
                        <div className="w-[80%] h-16 bg-[#885AD5] rounded-l-xl">
                            <input
                                placeholder="Enter Category name"
                                className="p-4 text-black mt-4 mx-6 w-[80%] rounded-xl h-8"
                                onChange={(e) => { handleCategoryInputChange(e) }}
                            />
                            {!iscategoryValid && <p className="mx-9 text-red-100 text-[60%] ">Category already exists</p>}
                        </div>
                        <div className="flex bg-[#A480DF] w-[20%]  shadow-[inset_1px_0px_5px_#00000050] rounded-r-xl">
                            <button
                                disabled={(iscategoryValid && category_inputValue) ? false : true}
                                className='ml-4'
                                onClick={() => { handleAddCategory() }}
                            >
                                <Image
                                    src={category_tickSrc}
                                    alt="Dropdown"
                                    width={25}
                                    height={25}

                                />
                            </button>
                            <button className='mx-2'
                                onClick={() => { setnewCategory(false); setIscategoryValid(true) }}
                            >
                                <Image
                                    src={closeicon}
                                    alt="Dropdown"
                                    width={25}
                                    height={25}
                                />
                            </button>

                        </div>
                    </div>
                ) : (
                    <></>
                )}

                <button className={`flex bg-[#885AD5] rounded-xl p-3 w-[60%] ml-auto mr-auto bg-opacity-80 hover:cursor-pointer hover:bg-opacity-50`}
                    onClick={() => {
                        setnewCategory(true)
                    }}
                >
                    <div className=" flex ml-auto mr-auto ">
                        <div >
                            <Image
                                className="mx-2 hover:cursor-pointer"
                                src={PlusIcon}
                                alt="Dropdown"
                                width={30}
                                height={30}
                            />
                        </div>
                        <div className=" font-semibold text-white mt-1">
                            Add Category
                        </div>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default CategoryDetails