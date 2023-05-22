import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers/TimePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { TIME_FORMAT } from "../App";

export const TimePicker = ({ label, value, onChange }: { label?: string; value?: string; onChange: (val: string) => void }) => {
    const [time, setTime] = useState<Dayjs>(dayjs(value, TIME_FORMAT));
    useEffect(() => {
        const newValue = dayjs(value, TIME_FORMAT);
        if (newValue.toString() !== time?.toString()) {
            setTime(newValue);
        }
    }, [value]);
    const handleChange = (val: Dayjs | null) => {
        if (val) {
            setTime(dayjs(val));
            console.log(val);
            onChange(val.format(TIME_FORMAT));
        }
    };
    console.log(time);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["MobileTimePicker"]}>
                <MobileTimePicker ampm={false} label={label} format={TIME_FORMAT} value={time} onChange={handleChange} />
                {/* <MobileTimePicker ampm={false} label={label} format="HH:mm" value={time} onChange={handleChange} /> */}
            </DemoContainer>
        </LocalizationProvider>
    );
};
