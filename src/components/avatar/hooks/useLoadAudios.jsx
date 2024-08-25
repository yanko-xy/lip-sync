import { useLoader } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export const useLoadAudios = (defaultKey = "welcome") => {
    const audioFile = useMemo(() => new Audio(`audios/${defaultKey}.ogg`), []);
    const jsonFile = useLoader(THREE.FileLoader, `audios/${defaultKey}.json`);
    const audioMap = useRef({
        [`${defaultKey}`]: {
            audio: audioFile,
            lipsync: JSON.parse(jsonFile),
        },
    });

    const [audio, setAudio] = useState(audioFile);
    const [lipsync, setLipsync] = useState(JSON.parse(jsonFile));

    const loader = useRef(new THREE.FileLoader());
    const getAudio = async (key, reset = false) => {
        let newAudio = audioMap.current[key];
        if (!newAudio) {
            const audio = new Audio(`audios/${key}.ogg`);
            const jsonFile = await loader.current.loadAsync(`audios/${key}.json`);
            const json = JSON.parse(jsonFile);
            audioMap.current[key] = {
                audio: audio,
                lipsync: json,
            };
            newAudio = audioMap.current[key];
        }

        setLipsync(newAudio.lipsync);

        if (reset) {
            newAudio.audio.currentTime = 0;
        }

        setAudio(newAudio.audio);
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

    return { setAudio: getAudio, audio, lipsync };
};
