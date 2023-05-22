import React, { useEffect, useState } from "react";
import "./App.css";
import moment from "moment";
import { useInterval } from "./hooks/useInterval";
import { useScreenLock } from "./hooks/useScreenLock";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";

const SLEEPS = [
    ["12:45", "15:00"],
    ["18:50", "07:00"],
];

const FORMAT = "HH:mm";

function App() {
    const mode = new URLSearchParams(window.location.search).get("mode");
    const [time, setTime] = useState<moment.Moment>(moment());
    const [sleep, setSleep] = useState<boolean>(mode === "sleep");

    const updateTime = () => {
        setTime(moment());
    };

    useInterval(updateTime, 5000);

    useEffect(() => {
        if (!mode) {
            setSleep(
                SLEEPS.some((s) => {
                    const now = moment();
                    const sleepStart = moment(s[0], FORMAT);
                    const sleepEnd = moment(s[1], FORMAT);

                    if (sleepStart.isAfter(sleepEnd)) {
                        if (now.isAfter(sleepStart) && now.isAfter(sleepEnd)) {
                            sleepEnd.add(1, "day");
                        } else {
                            sleepStart.subtract(1, "day");
                        }
                    }

                    return now.isAfter(sleepStart) && now.isBefore(sleepEnd);
                })
            );
        }
    }, [time]);

    useScreenLock();

    return (
        <div className="App">
            <header className={`App-header ${sleep ? "sleeping" : ""}`}>
                {sleep ? <BedtimeIcon /> : <LightModeIcon />}
                <p className={`clock ${sleep ? "sleeping" : ""}`}>{time.format(FORMAT)}</p>
            </header>
        </div>
    );
}

export default App;
