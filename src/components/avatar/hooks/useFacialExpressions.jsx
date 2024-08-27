import { useFrame, useGraph } from "@react-three/fiber";
import { useState } from "react";
import { lerpMorphTarget } from "../utils";
import { button, useControls } from "leva";

// face data
const facialExpressions = {
    default: {},
    smile: {
        browInnerUp: 0.17,
        eyeSquintLeft: 0.4,
        eyeSquintRight: 0.44,
        noseSneerLeft: 0.1700000727403593,
        noseSneerRight: 0.14000002836874015,
        mouthPressLeft: 0.61,
        mouthPressRight: 0.41000000000000003,
    },
    funnyFace: {
        jawLeft: 0.63,
        mouthPucker: 0.53,
        noseSneerLeft: 1,
        noseSneerRight: 0.39,
        mouthLeft: 1,
        eyeLookUpLeft: 1,
        eyeLookUpRight: 1,
        cheekPuff: 0.9999924982764238,
        mouthDimpleLeft: 0.414743888682652,
        mouthRollLower: 0.32,
        mouthSmileLeft: 0.35499733688813034,
        mouthSmileRight: 0.35499733688813034,
    },
    sad: {
        mouthFrownLeft: 1,
        mouthFrownRight: 1,
        mouthShrugLower: 0.78341,
        browInnerUp: 0.452,
        eyeSquintLeft: 0.72,
        eyeSquintRight: 0.75,
        eyeLookDownLeft: 0.5,
        eyeLookDownRight: 0.5,
        jawForward: 1,
    },
    surprised: {
        eyeWideLeft: 0.5,
        eyeWideRight: 0.5,
        jawOpen: 0.351,
        mouthFunnel: 1,
        browInnerUp: 1,
    },
    angry: {
        browDownLeft: 1,
        browDownRight: 1,
        eyeSquintLeft: 1,
        eyeSquintRight: 1,
        jawForward: 1,
        jawLeft: 1,
        mouthShrugLower: 1,
        noseSneerLeft: 1,
        noseSneerRight: 0.42,
        eyeLookDownLeft: 0.16,
        eyeLookDownRight: 0.16,
        cheekSquintLeft: 1,
        cheekSquintRight: 1,
        mouthClose: 0.23,
        mouthFunnel: 0.63,
        mouthDimpleRight: 1,
    },
    crazy: {
        browInnerUp: 0.9,
        jawForward: 1,
        noseSneerLeft: 0.5700000000000001,
        noseSneerRight: 0.51,
        eyeLookDownLeft: 0.39435766259644545,
        eyeLookUpRight: 0.4039761421719682,
        eyeLookInLeft: 0.9618479575523053,
        eyeLookInRight: 0.9618479575523053,
        jawOpen: 0.9618479575523053,
        mouthDimpleLeft: 0.9618479575523053,
        mouthDimpleRight: 0.9618479575523053,
        mouthStretchLeft: 0.27893590769016857,
        mouthStretchRight: 0.2885543872656917,
        mouthSmileLeft: 0.5578718153803371,
        mouthSmileRight: 0.38473918302092225,
        tongueOut: 0.9618479575523053,
    },
};

export const useFacialExpressions = (scene) => {
    const { nodes } = useGraph(scene);
    const [facialExpression, setFacialExpression] = useState("");

    const { setupMode } = useControls("Settings", {
        setupMode: false,
    });

    useFrame(() => {
        !setupMode &&
            Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
                const mapping = facialExpressions[facialExpression];
                // exclude eyes
                if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
                    return;
                }
                if (mapping && mapping[key]) {
                    lerpMorphTarget(scene, key, mapping[key], 0.1);
                } else {
                    lerpMorphTarget(scene, key, 0, 0.1);
                }
            });
    });

    useControls("FacialExpressions", {
        facialExpression: {
            options: Object.keys(facialExpressions),
            onChange: (value) => setFacialExpression(value),
        },
        logMorphTargetValues: button(() => {
            const emotionValues = {};
            Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
                // exclude eyes
                if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
                    return;
                }
                const value = nodes.EyeLeft.morphTargetInfluences[nodes.EyeLeft.morphTargetDictionary[key]];
                if (value > 0.01) {
                    emotionValues[key] = value;
                }
            });
            console.log(JSON.stringify(emotionValues, null, 2));
        }),
    });

    const [, set] = useControls("MorphTarget", () =>
        Object.assign(
            {},
            ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => {
                return {
                    [key]: {
                        label: key,
                        value: 0,
                        min: nodes.EyeLeft.morphTargetInfluences[nodes.EyeLeft.morphTargetDictionary[key]],
                        max: 1,
                        onChange: (val) => {
                            lerpMorphTarget(scene, key, val, 1);
                        },
                    },
                };
            }),
        ),
    );
};
