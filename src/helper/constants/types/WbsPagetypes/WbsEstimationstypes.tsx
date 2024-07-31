export interface Subcategory {
    subcategory: string | number;
    simple: number | null;
    medium: number | null;
    complex: number | null;
    simpleHours: number;
    mediumHours: number;
    complexHours: number;
}


export interface Category {

    category: string | number;
    subcategories: Subcategory[];
    simple: number | null,
    medium: number | null,
    complex: number | null,
    totalHours: number | null
}


export interface EditingCategoryState {
    [key: string]: boolean;
}
export interface SubcategoryConfig {
    simple: number;
    medium: number;
    complex: number;
}