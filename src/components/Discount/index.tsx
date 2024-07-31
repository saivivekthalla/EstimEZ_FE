import Image from "next/image";
import DiscountImg from "../../../public/assets/svg/discount_bg_img.svg";
import AddImage from "../../assets/icons/AddImage";
import SubstractImage from "../../assets/icons/SubstractImage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/features/store";
import { getDiscountsData, createDiscounts, getDiscounts, updateDiscounts, deleteDiscounts, lookupDiscounts, fetchDiscountCategories } from "@/features/budget/otherCostDiscountSlice";
import { discountData } from "@/helper/constants/types/common";
// import { Categories } from "@/helper/constants/staticData/discountData";
import { useSearchParams } from "next/navigation";

const discountPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = new URLSearchParams(useSearchParams().toString());
  const projectId: any = searchParams.get('projectId');
  const discounts: Array<discountData> = useSelector(getDiscountsData);
  const [Data, setData] = useState<discountData[]>(discounts);
  const Categories = useSelector(fetchDiscountCategories)  
  useEffect(() => {
    setData(discounts);
  }, [discounts]);

  useEffect(() => {
    dispatch(getDiscounts(projectId))
    dispatch(lookupDiscounts())
  }, [dispatch]);

  const resetData = () => {
    setData(discounts);
  };

  const addRow = () => {
    setData([
      ...Data,
      {
        discountId: null,
        categoryId: 0,
        description: "",
        percentage: 0,
      },
    ]);
  };

  const delRow = async (discountIndex: number) => {
    const deleteObj: discountData | undefined = Data.find((obj, index) => index === discountIndex);
    const updatedArray = Data.filter((item, index) => index !== discountIndex);
    if (deleteObj?.discountId == null) {
      setData(updatedArray);
    } else {
      try {
        await dispatch(deleteDiscounts({ projectId: projectId, discountId: deleteObj.discountId })).then((res : any) =>{
          dispatch(getDiscounts(projectId)).then((res :any)=>{
            setData(res.payload)
          })
        })
        alert("Delete Successful");
      } catch (err) {
        console.log("Delete Failed", err);
      }
    }
  };


  const hasChanges = (item: discountData) => {
    let currentItem
    let flag = true;
    if (discounts) {
      currentItem = discounts.find(obj => obj.discountId === item.discountId);
    } else {
      currentItem = null;
    }
    if (currentItem)
    {
      for (const key of Object.keys(item)) {
        if (item[key as keyof discountData] !== currentItem[key as keyof discountData])
          flag = false;
      }
    }
    return flag
  };

  const handleChange = (discountIndex: any, name: any, value: any) => {
    const updatedDataArray = Data.map((item: discountData, index: number) => {
      if (discountIndex === index) {
        return {
          ...item,
          [name]: name === "percentage" || name === "categoryId" ? parseInt(value, 10) : value,
        };
      }
      return item;
    });
    setData(updatedDataArray);
  };

  const setReduxData = async (updatedDataArray: Array<discountData>) => {
    const postData: Array<discountData> = [];
    const putData: Array<discountData> = [];
    let postSuccess: boolean = false;
    let putSuccess: boolean = false;
    let flag = 0;
    updatedDataArray.forEach((item, index) => {
      if (item.categoryId == 0 || item.description == "" || item.percentage == 0) {
        flag = 1;
      }
      else {
        if (item.discountId == null) {
          delete item.discountId;
          postData.push(item);
        } else {
          if (!hasChanges(item)) {
            putData.push(item);
          }
        }
      }
    });
    if (flag == 0) {
      const postObj = {
        createdBy: "string",
        projectId: parseInt(projectId),
        discounts: postData
      };

      const putObj = {
        updatedBy: "string",
        projectId: parseInt(projectId),
        discount: putData
      };

      if (postData.length === 0 && putData.length === 0) {
        alert("No New Data to save");
        return;
      }

      if (postData.length > 0) {
        try {
          await dispatch(createDiscounts(postObj)).then((res : any) =>{
            dispatch(getDiscounts(projectId)).then((res :any)=>{
              setData(res.payload)
            })
          });
          postSuccess = true;
        } catch (err: any) {
          postSuccess = false;
          alert(err.message)
        }
      }

      if (putData.length > 0) {
        try {
          await dispatch(updateDiscounts(putObj)).then((res : any) =>{
            dispatch(getDiscounts(projectId)).then((res :any)=>{
              setData(res.payload)
            })
          });
          putSuccess = true;
        } catch (err) {
          putSuccess = false;
          console.log("Put Discount Error", err);
        }
      }

      if (postSuccess || putSuccess) {
        alert("Saved Successfully");
      } else {
        alert("Save Failed");
      }
    }
    else
      alert("Please enter the values to create");
  };

  return (
    <div className="container relative h-[90vh] bg-[#1D154A] opacity-[92%] rounded-lg border-solid border-4 border-[#9CA8E5]">
      <div className="flex flex-row justify-between max-w-full p-2 ml-10 mr-10 mt-12">
        <h1 className="uppercase text-white text-3xl font-bold">Discounts</h1>
        <div className="flex gap-4">
          <button
            className={`border-solid border-2 border-[#B7C4F2] pt-2 pb-2 pl-6 pr-6 text-white ${discounts == Data && "opacity-50"}`}
            disabled={discounts == Data}
            onClick={() => resetData()}
          >
            Reset
          </button>
          <button
            className="border-solid border-2 border-[#B7C4F2] pt-2 pb-2 pl-6 pr-6 text-white"
            onClick={() => setReduxData(Data)}
          >
            Save
          </button>
        </div>
      </div>
      <div className="w-full h-fit absolute z-10 flex flex-col mt-10 items-center">
        <div className="realtive flex flex-col items-center w-[65vw] h-fit rounded-2xl overflow-hidden">
          <table className="w-full h-full table-auto text-white">
            <thead>
              <tr className="bg-[#01105F] h-16 text-xl">
                <th>Categories</th>
                <th>Description</th>
                <th>Percentage</th>
                <th></th>
              </tr>
            </thead>
          </table>
          <div className="w-full max-h-[50vh] overflow-y-scroll">
            <table className="w-full table-auto text-sm text-white border-separate border-spacing-y-1">
              <tbody>
                {Data && Data?.map((item: any, index: any) => {
                  return (
                    <tr
                      id={item.discountId}
                      className="bg-[#4B3D99] bg-opacity-[72%] text-center h-16 justify-center"
                    >
                      <td className="w-16 pr-4">
                        <select
                          name="categoryId"
                          className="m-2 border-none text-white bg-transparent  pr-2"
                          value={item.categoryId}
                          onChange={(event) =>
                            handleChange(
                              index,
                              event.target.name,
                              event.target.value
                            )
                          }
                        >
                          <option value={0} disabled>Select a Category</option>
                          {Categories.map((category: any) => (
                            <option
                              value={category.id}
                              className="bg-white text-black"
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="w-[26vw] pt-2 pb-1">
                        <textarea
                          disabled={item.categoryId == 0}
                          name="description"
                          className="bg-[#1D154A] p-2 rounded-lg w-full"
                          value={item.description}
                          placeholder="Enter the Description"
                          onChange={(event) =>
                            handleChange(
                              index,
                              event.target.name,
                              event.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          disabled={item.categoryId == 0 || item.description == ""}
                          name="percentage"
                          className="bg-[#1D154A] p-2 text-center w-40 rounded-lg placeholder:text-xs"
                          value={item.percentage > 0 && item.percentage <= 100 ? item.percentage : ""}
                          placeholder="Enter the Percentage"
                          type="number"
                          min="0"
                          max="100"
                          onChange={(event) =>
                            handleChange(
                              index,
                              event.target.name,
                              event.target.value
                            )
                          }
                        />
                      </td>
                      <td className="pr-2">
                        <div
                          className="cursor-pointer"
                          onClick={() => delRow(index)}
                        >
                          <SubstractImage
                            color="#DDC8FF"
                            height={22}
                            width={22}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="absolute -bottom-3 cursor-pointer" onClick={addRow}>
            <AddImage color="#DDC8FF" height={22} width={22} />
          </div>
        </div>
      </div>
      <Image
        src={DiscountImg}
        alt=""
        height={400}
        width={400}
        className="absolute bottom-0 right-0 z-0"
      ></Image>
    </div>
  );
};

export default discountPage;