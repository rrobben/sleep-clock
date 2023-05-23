import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { TimePicker } from "./TimePicker";
import Grid2 from "@mui/material/Unstable_Grid2";
import update from "immutability-helper";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { TIME_FORMAT } from "../App";

export const Settings = ({ periods, setPeriods }: { periods: string[][]; setPeriods: React.Dispatch<React.SetStateAction<string[][]>> }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [editedPeriods, setEditedPeriods] = useState<string[][]>(periods);

    const handleClose = () => {
        setOpen(false);
        setEditedPeriods(periods);
    };

    const updatePeriod = (index: number, attrIndex: number, value: string) => {
        setEditedPeriods(
            update(editedPeriods, {
                [index]: {
                    [attrIndex]: {
                        $set: value,
                    },
                },
            })
        );
    };

    const deletePeriod = (index: number) => {
        setEditedPeriods(
            update(editedPeriods, {
                $splice: [[index, 1]],
            })
        );
    };

    const addPeriod = () => {
        setEditedPeriods(
            update(editedPeriods, {
                $push: [[dayjs().format(TIME_FORMAT), dayjs().add(12, "hours").format(TIME_FORMAT)]],
            })
        );
    };

    const handleSave = () => {
        setPeriods(editedPeriods);
        setOpen(false);
    };

    return (
        <>
            <IconButton color="inherit" aria-label="settings" onClick={() => setOpen(true)} sx={{ position: "absolute", top: "0.5rem", right: "1rem" }}>
                <SettingsIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose} fullScreen>
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ ml: 2, flex: 1 }}>
                            <Typography variant="h6" component="span" sx={{ verticalAlign: "middle", mr: 1 }}>
                                Sleep periods
                            </Typography>
                            <IconButton color="inherit" aria-label="add" onClick={addPeriod}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </Box>
                        <Button autoFocus color="inherit" onClick={handleSave}>
                            Save
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        {editedPeriods.map((p, i) => (
                            <Grid2 key={i} container xs={12}>
                                <Grid2 container xs={10} sm={11}>
                                    <Grid2 xs={12} sm={6}>
                                        <TimePicker label="Start" value={p[0]} onChange={(val) => updatePeriod(i, 0, val)} />
                                    </Grid2>
                                    <Grid2 xs={12} sm={6}>
                                        <TimePicker label="End" value={p[1]} onChange={(val) => updatePeriod(i, 1, val)} />
                                    </Grid2>
                                </Grid2>
                                <Grid2 xs={2} sm={1} sx={{ display: "flex", verticalAlign: "middle", alignItems: "center" }}>
                                    <IconButton aria-label="delete" size="medium" onClick={() => deletePeriod(i)}>
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </Grid2>
                            </Grid2>
                        ))}
                    </Grid2>
                </DialogContent>
            </Dialog>
        </>
    );
};
