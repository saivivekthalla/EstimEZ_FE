import { Category } from "../constants/types/WbsPagetypes/WbsEstimationstypes";

export function checkAllValues(objects: any) {
    for (const obj of objects) {
        if(objects!=undefined){
            if (typeof obj.category === 'string') {
                return false;
            }
            if (obj.simple !== null && obj.simple !== 0) {
                return false;
            }
            if (obj.medium !== null && obj.medium !== 0) {
                return false;
            }
            if (obj.complex !== null && obj.complex !== 0) {
                return false;
            }
        }
    }
    return true;
}

export function compareData(array1: any, array2: any) {
    // Check if the lengths of the arrays are different
    if ((array1 == null && array2.length > 0) || (array1 && array1.length !== array2.length)) {
        return false;
    }
    
    // Iterate over each object in array1
    for (let i = 0; i < array1.length; i++) {
        const obj1 = array1[i];
        const obj2 = array2[i];

        // Check if the keys are the same in both objects
        const keys1 = Object.keys(obj1).sort();
        const keys2 = Object.keys(obj2).sort();
        if (keys1.join(',') !== keys2.join(',')) {
            return false;
        }

        // Check if the values are the same for each key
        for (const key of keys1) {
            const value1 = obj1[key];
            const value2 = obj2[key];

            // For subcategories, compare each subcategory object
            if (key === 'subcategories') {
                if (!compareData(value1, value2)) {
                    return false;
                }
            } else {
                if (value1 !== value2) {
                    return false;
                }
            }
        }
    }

    return true;
}


export function transformData(inputData: any[]) {
    if (inputData && inputData.length > 0 && Object.keys(inputData[0]).length > 0) {
        // Initialize the result array
        let transformedObject: any = [];

        // Loop through the input data
        inputData?.forEach(task => {
            // Create a new object for the result

            // Loop through subtask details
            task?.content?.taskDetails?.forEach((subTask: any) => {
                // Loop through subTaskDetails
                let obj: any = {
                    category: subTask.taskId,
                    subcategories: [],
                    simple: null,
                    medium: null,
                    complex: null,
                    totalHours: null
                };
                subTask?.subTaskDetails?.forEach((subTaskDetail: any) => {
                    let subcategoryObject: any = {
                        subcategory: subTaskDetail?.subTaskId,
                        simple: null,
                        medium: null,
                        complex: null,
                        simpleHours: null,
                        mediumHours: null,
                        complexHours: null
                    };

                    // Set hours based on components
                    if (subTaskDetail?.components) {
                        subcategoryObject.simple = null;
                        subcategoryObject.medium = null;
                        subcategoryObject.complex = null;

                        subcategoryObject.simpleHours = subTaskDetail?.components?.simple?.hours || null;
                        subcategoryObject.mediumHours = subTaskDetail?.components?.medium?.hours || null;
                        subcategoryObject.complexHours = subTaskDetail?.components?.complex?.hours || null;
                    }

                    // Push the subcategory object to the result array
                    obj.subcategories.push(subcategoryObject);
                });
                transformedObject.push(obj);
            });

            // Add the transformed object to the result array
        });

        return transformedObject;
    } else {
        // Return an empty array if inputData is empty or contains only an empty object
        return [];
    }
}


export const sortCategories = (data: any[],
    getCategoryName: (categoryId: any) => any,
    getSubcategoryName: (categoryId: any, subcategoryId: any) => any) => {
    // Sort categories
    data.sort((a, b) => {
        const categoryNameA = isNaN(a.category) ? a.category : getCategoryName(a.category);
        const categoryNameB = isNaN(b.category) ? b.category : getCategoryName(b.category);

        // Compare category names
        return categoryNameA?.localeCompare(categoryNameB);
    });

    // Sort subcategories within each category
    data.forEach((category, index) => {
        // Create a mutable copy of the category
        const mutableSubcategories = category?.subcategories?.map((subCategory: any) => ({ ...subCategory }));

        mutableSubcategories?.sort((a: any, b: any) => {
            const subcategoryNameA = isNaN(a.subcategory) ? a.subcategory : getSubcategoryName(category.category, a.subcategory);
            const subcategoryNameB = isNaN(b.subcategory) ? b.subcategory : getSubcategoryName(category.category, b.subcategory);

            // Compare subcategory names
            return subcategoryNameA?.localeCompare(subcategoryNameB);
        });

        // Update the original category with the sorted subcategories
        data[index] = {
            ...category,
            subcategories: mutableSubcategories,
        };
    });

    return data;
};

export function mergeData(dataset1: Category[], dataset2: Category[]): Category[] {
    const mergedData: { [key: string]: Category } = {};

    // Merge dataset1
    dataset1?.forEach((item: any) => {
        const { category, subcategories } = item;
        if (!mergedData[category.toString()]) {
            mergedData[category.toString()] = { ...item, subcategories: [] };
        }
        mergedData[category.toString()].subcategories.push(...subcategories);
    });

    // Merge dataset2
    dataset2?.forEach((item: any) => {
        if (Object.keys(item).length !== 0) {
            const { category, subcategories } = item;
            if (!mergedData[category?.toString()]) {
                mergedData[category?.toString()] = { ...item, subcategories: [] };
            }
            subcategories?.forEach((subcategory:any) => {
                const existingSubcategoryIndex = mergedData[category?.toString()].subcategories.findIndex(
                    (existingSubcategory) => existingSubcategory.subcategory === subcategory.subcategory
                );
                if (existingSubcategoryIndex !== -1) {
                    mergedData[category?.toString()].subcategories[existingSubcategoryIndex] = {
                        ...mergedData[category?.toString()].subcategories[existingSubcategoryIndex],
                        ...subcategory,
                    };
                } else {
                    mergedData[category?.toString()].subcategories.push(subcategory);
                }
            });
        }
    });

    // Calculate total hours, simple, medium, and complex
    Object.values(mergedData).forEach((categoryData: Category) => {
        categoryData.totalHours = categoryData.subcategories.reduce((acc, subcat) => acc + (((subcat.simple || 0) * subcat.simpleHours + (subcat.medium || 0) * subcat.mediumHours + (subcat.complex || 0) * subcat.complexHours) || 0), 0);
        categoryData.simple = categoryData.subcategories.reduce((acc, subcat) => acc + (subcat.simple || 0), 0);
        categoryData.medium = categoryData.subcategories.reduce((acc, subcat) => acc + (subcat.medium || 0), 0);
        categoryData.complex = categoryData.subcategories.reduce((acc, subcat) => acc + (subcat.complex || 0), 0);
    });

    return Object.values(mergedData);
}