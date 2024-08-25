import { useLoader } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export const useLoadAudios = () => {
    const welcome = useMemo(() => new Audio("audios/welcome_zh.ogg"), []);
    const welcomeJsonFile = useLoader(THREE.FileLoader, "audios/welcome_zh.json");
    const audioMap = useRef({
        welcome_zh: {
            audio: welcome,
            lipsync: JSON.parse(welcomeJsonFile),
        },
    });
    const [audio, setAudio] = useState(welcome);
    const [lipsync, setLipsync] = useState(JSON.parse(welcomeJsonFile));

    const loader = useRef(new THREE.Loader());

    const getAutio = useCallback(
        (key) => {
            let getAudio = audioMap[key];
            if (getAudio) {
                setAudio(getAudio.audio);
                setLipsync(getAudio.lipsync);

                return getAudio.audio;
            }
            getAudio = {
                audio: audio,
                lipsync: lipsync,
            };
            getAudio.audio = new Audio(`audios/${key}.ogg`);

            loader.current.load(`audios/${key}.json`, (data) => {
                getAudio.lipsync = JSON.parse(data);
                setLipsync(getAudio.lipsync);
            });
            setAudio(getAudio.audio);
            audioMap[key] = getAudio;
            return getAudio.audio;
        },
        [audioMap.current, audio, lipsync],
    );

    return { getAutio, audio, lipsync };
};
