import { useLoader } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export const useLoadAudios = (defaultKey = "welcome_zh") => {
    const [key, setKey] = useState(defaultKey);
    const audioFile = useMemo(() => new Audio(`audios/${defaultKey}.ogg`), []);
    const jsonFile = useLoader(THREE.FileLoader, `audios/${key}.json`);
    const audioMap = useRef({
        [`${defaultKey}`]: {
            audio: audioFile,
            lipsync: JSON.parse(jsonFile),
        },
    });

    const [audio, setAudio] = useState(audioFile);
    const lipsync = JSON.parse(jsonFile);

    const getAudio = async (key) => {
        let newAudio = audioMap.current[key]?.audio;
        if (!newAudio) {
            newAudio = new Audio(`audios/${key}.ogg`);
            audioMap.current[key] = {
                audio: newAudio,
            };
        }

        setAudio(newAudio);
        setKey(key);
    };

    useEffect(() => {
        if (audio) {
            audio.play();
            return () => audio.pause();
        }
    }, [audio]);

    useEffect(() => {
        if (audio?.ended) {
            audio.currentTime = 0;
            setAudio(null);
        }
    }, [audio?.ended]);

    return { getAudio, audio, lipsync };
};
