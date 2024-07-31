import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchVertical, getVerticals } from "./createInfoSlice";
import { AppDispatch } from "../store";

export const SelectState = () => {
    const dispatch = useDispatch<AppDispatch>();
    const states = useSelector(fetchVertical);
    const [stateSelected, setStateSelected] = useState("");

    useEffect(() => {
        dispatch(getVerticals());
    }, [dispatch]);

    const handleChange = (e: any) => {
        setStateSelected(e.target.value);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small">Vertical</InputLabel>
            <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={stateSelected}
                label="estados"
                onChange={handleChange}
            >
                <MenuItem disabled>Select a vertical</MenuItem>
                {states?.map((item: any) => (
                    <MenuItem key={item.id} value={item.name}>
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
