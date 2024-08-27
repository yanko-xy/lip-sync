import { useFrame, useGraph, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const corresponding = {
    A: "viseme_PP",
    B: "viseme_kk",
    C: "viseme_I",
    D: "viseme_AA",
    E: "viseme_O",
    F: "viseme_U",
    G: "viseme_FF",
    H: "viseme_TH",
    X: "viseme_PP",
};

export const useVoice = (scene, defaultKey = "welcome") => {
    const { nodes } = useGraph(scene);
    const audioFile = useMemo(() => new Audio(`audios/${defaultKey}.ogg`), []);
    const jsonFile = useLoader(THREE.FileLoader, `audios/${defaultKey}.json`);
    const audioMap = useRef({
        [`${defaultKey}`]: {
            audio: audioFile,
            lipsync: JSON.parse(jsonFile),
        },
    });

    const [audio, setAudio] = useState(null);
    const [lipsync, setLipsync] = useState(JSON.parse(jsonFile));
    const [key, setKey] = useState(undefined);

    const { playAudio, script, smoothMorphTarget, morphTargetSmoothing } = useControls("Audio", {
        playAudio: false,
        script: {
            value: "welcome",
            options: ["welcome", "touch1", "touch2", "touch3"],
        },
        smoothMorphTarget: true,
        morphTargetSmoothing: 0.5,
    });

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
        if (audio === newAudio.audio && audio.played) return;

        setLipsync(newAudio.lipsync);

        if (reset) {
            newAudio.audio.currentTime = 0;
        }

        setAudio(newAudio.audio);
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
            setKey(undefined);
        }
    }, [audio?.ended]);

    useEffect(() => {
        if (playAudio) {
            getAudio(script);
        } else {
            audio?.pause();
            setAudio(null);
            setKey(undefined);
        }
    }, [playAudio]);

    useEffect(() => {
        if (playAudio) {
            getAudio(script, true);
        }
    }, [script]);

    useFrame(() => {
        if (!audio) return;
        const currentAudioTime = audio.currentTime;

        if (currentAudioTime !== 0) {
            Object.values(corresponding).forEach((value) => {
                if (!smoothMorphTarget) {
                    nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = 0;
                    nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = 0;
                } else {
                    nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] =
                        THREE.MathUtils.lerp(
                            nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]],
                            0,
                            morphTargetSmoothing,
                        );

                    nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] =
                        THREE.MathUtils.lerp(
                            nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]],
                            0,
                            morphTargetSmoothing,
                        );
                }
            });

            // if (audio.ended) {
            //     audio.currentTime = 1;
            //     setTimeout(() => {
            //         audio.currentTime = 0;
            //     }, 100);
            // }
        }

        for (let i = 0; i < lipsync.mouthCues.length; i++) {
            const mouthCue = lipsync.mouthCues[i];
            if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
                if (!smoothMorphTarget) {
                    nodes.Wolf3D_Head.morphTargetInfluences[
                        nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
                    ] = 1;
                    nodes.Wolf3D_Teeth.morphTargetInfluences[
                        nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
                    ] = 1;
                } else {
                    nodes.Wolf3D_Head.morphTargetInfluences[
                        nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
                    ] = THREE.MathUtils.lerp(
                        nodes.Wolf3D_Head.morphTargetInfluences[
                            nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
                        ],
                        1,
                        morphTargetSmoothing,
                    );
                    nodes.Wolf3D_Teeth.morphTargetInfluences[
                        nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
                    ] = THREE.MathUtils.lerp(
                        nodes.Wolf3D_Teeth.morphTargetInfluences[
                            nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
                        ],
                        1,
                        morphTargetSmoothing,
                    );
                }
                break;
            }
        }
    });

    return { setAudio: getAudio, audio, lipsync, audioKey: key };
};
