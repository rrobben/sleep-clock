import { useEffect, useRef } from "react";

export const useScreenLock = (active: boolean) => {
    const lockRef = useRef<WakeLockSentinel | null | undefined>();

    const requestLock = async () => {
        if ("wakeLock" in navigator) {
            try {
                lockRef.current = await navigator.wakeLock.request("screen");
            } catch (err) {
                lockRef.current = null;
                console.error(err);
            }
        }
    };

    const releaseLock = async () => {
        if (typeof lockRef.current !== "undefined" && lockRef.current != null) {
            await lockRef.current.release();
            lockRef.current = null;
            console.log("Lock released 🎈");
        }
    };

    useEffect(() => {
        if (active) {
            requestLock();
            console.log("lock");
        }

        return () => {
            releaseLock();
        };
    }, [active]);

    const onVisibilityChange = async () => {
        if (active && lockRef.current !== null && document.visibilityState === "visible") {
            console.log("tab change");
            await requestLock();
        }
    };

    useEffect(() => {
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);
};
