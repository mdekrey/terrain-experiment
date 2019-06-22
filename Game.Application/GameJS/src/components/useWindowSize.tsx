import React from "react";

export function useWindowSize(defaultSize: {
    width: number;
    height: number;
}) {
    const [size, setSize] = React.useState(defaultSize);
    React.useEffect(() => {
        function resizeHandler() {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        }
        window.addEventListener("resize", resizeHandler);
        resizeHandler();
        const prevOverflow = window.document.body.style.overflow;
        window.document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("resize", resizeHandler);
            window.document.body.style.overflow = prevOverflow;
        };
    }, [setSize]);
    return size;
}
