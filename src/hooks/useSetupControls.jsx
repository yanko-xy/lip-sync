import { useControls, set } from "leva";
import { useRef } from "react";

export const useSetupControls = (...folders) => {
    const controlValue = useRef({});
    folders.forEach((folder) => {
        controlValue.current[folder] = useControls(folder.name, folder.opts);
    });

    return controlValue.current;
};
