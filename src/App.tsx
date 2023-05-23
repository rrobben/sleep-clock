import React, { useEffect, useState } from "react";
import "./App.css";
import { useInterval } from "./hooks/useInterval";
import { useScreenLock } from "./hooks/useScreenLock";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Settings } from "./components/Settings";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocalStorage } from "usehooks-ts";
import dayjs, { Dayjs } from "dayjs";

const SLEEPS = [["19:00", "07:00"]];

export const TIME_FORMAT = "HH:mm";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const mode = new URLSearchParams(window.location.search).get("mode");
    const [time, setTime] = useState<Dayjs>(dayjs());
    const [sleep, setSleep] = useState<boolean>(mode === "sleep");
    const [periods, setPeriods] = useLocalStorage<string[][]>("periods", SLEEPS);

    const updateTime = () => {
        setTime(dayjs());
    };

    useInterval(updateTime, 5000);

    useEffect(() => {
        if (!mode) {
            setSleep(
                periods.some((s) => {
                    const now = dayjs();
                    let sleepStart = dayjs(s[0], TIME_FORMAT);
                    let sleepEnd = dayjs(s[1], TIME_FORMAT);

                    if (sleepStart.isAfter(sleepEnd)) {
                        if (now.isAfter(sleepStart) && now.isAfter(sleepEnd)) {
                            sleepEnd = sleepEnd.add(1, "day");
                        } else {
                            sleepStart = sleepStart.subtract(1, "day");
                        }
                    }

                    return now.isAfter(sleepStart) && now.isBefore(sleepEnd);
                })
            );
        }
    }, [time, periods]);

    useScreenLock();

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="App">
                <header className={`App-header ${sleep ? "sleeping" : ""}`}>
                    <Settings periods={periods} setPeriods={setPeriods} />
                    {sleep ? <BedtimeIcon /> : <LightModeIcon />}
                    <p className={`clock ${sleep ? "sleeping" : ""}`}>{time.format(TIME_FORMAT)}</p>
                </header>
            </div>
        </ThemeProvider>
    );
}

export default App;
