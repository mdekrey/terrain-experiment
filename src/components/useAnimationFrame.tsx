import React from "react";
export function useAnimationFrame(callback: FrameRequestCallback) {
    React.useEffect(() => {
        let request = requestAnimationFrame(looper);
        function looper(time: number) {
            callback(time);
            request = requestAnimationFrame(looper);
        }
        return () => cancelAnimationFrame(request);
    }, [callback]);
}
