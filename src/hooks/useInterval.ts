import { useEffect, useRef } from "react";

export const useInterval = (handler: () => void, timeout?: number) => {
    const interval = useRef<number>();

    useEffect(() => {
        window.clearInterval(interval.current);

        interval.current = window.setInterval(
            () => handler(),
            timeout
        );

        return () => {
            window.clearInterval(interval.current);
        };
    }, [handler, timeout]);
};
