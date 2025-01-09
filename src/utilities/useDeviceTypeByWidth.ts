import { useEffect, useState } from "react";

const useDeviceTypeByWidth = () => {
    const [deviceType, setDeviceType] = useState<string>("");

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 768) {
                setDeviceType("Mobile");
            } else if (width <= 1024) {
                setDeviceType("Tablet");
            } else {
                setDeviceType("PC");
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return deviceType;
};

export default useDeviceTypeByWidth;
