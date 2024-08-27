import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export const LoadingScreen = (props) => {
    const { started, setStarted } = props;
    const [showTip, setShowTip] = useState(false);
    const { progress, total, loaded, item } = useProgress();

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                setShowTip(true);
            }, 500);
        }
    }, [progress, total, loaded, item]);

    useEffect(() => {
        function onClick() {
            if (showTip) {
                setStarted(true);
            }
        }
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, [showTip]);

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-[2000ms] pointer-events-none
  flex items-center justify-center bg-indigo-50
  ${started ? "opacity-0" : "opacity-100"}`}
        >
            <div
                className={`text-4xl md:text-9xl font-bold text-indigo-900 relative ${showTip ? "animate-pulse" : "animate-none"}`}
            >
                <div
                    className="absolute left-0 top-0  overflow-hidden truncate text-clip transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                    }}
                >
                    XGZS Yanko
                </div>
                <div className="opacity-40">XGZS Yanko</div>
            </div>
            {showTip && (
                <div className=" fixed bottom-4 text-3xl font-black text-indigo-900 animate-bounce">
                    Click the screen to enter!
                </div>
            )}
        </div>
    );
};
