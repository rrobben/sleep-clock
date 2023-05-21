import { useEffect } from "react";

export const useScreenLock = () => {
    const requestLock = async () => {
        if ("wakeLock" in navigator) {
            let lock;

            try {
                lock = await navigator.wakeLock.request("screen");
            } catch (err) {
                console.error(err);
            }
            return lock;
        }
    };

    useEffect(() => {
        let screenLock: WakeLockSentinel | undefined;

        requestLock().then((lock) => {
            console.log("lock");
            screenLock = lock;
        });

        const onVisibilityChange = async () => {
            if (screenLock !== null && document.visibilityState === "visible") {
                console.log("tab change");
                screenLock = await requestLock();
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            if (typeof screenLock !== "undefined" && screenLock != null) {
                screenLock.release().then(() => {
                    console.log("Lock released 🎈");
                });
            }

            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);
};
