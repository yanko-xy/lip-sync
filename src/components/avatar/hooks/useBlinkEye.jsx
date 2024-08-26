import { useSetupControls } from "@/hooks/useSetupControls";
import { useFrame } from "@react-three/fiber";
import { button } from "leva";
import { useEffect, useState } from "react";
import { lerpMorphTarget } from "../utils";
import * as THREE from "three";

export const useBlinkEye = (scene) => {
    const [blink, setBlink] = useState(false);
    const [winkLeft, setWinkLeft] = useState(false);
    const [winkRight, setWinkRight] = useState(false);

    // eyes wink
    useFrame(() => {
        lerpMorphTarget(scene, "eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
        lerpMorphTarget(scene, "eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);
    });
    // Natural blink
    useEffect(() => {
        let blinkTimeout;
        const nextBlink = () => {
            blinkTimeout = setTimeout(
                () => {
                    setBlink(true);
                    setTimeout(() => {
                        setBlink(false);
                        nextBlink();
                    }, 200);
                },
                THREE.MathUtils.randInt(1000, 5000),
            );
        };
        nextBlink();
        return () => clearTimeout(blinkTimeout);
    }, []);

    const {} = useSetupControls({
        name: "FacialExpressions",
        opts: {
            chat: button(() => chat()),
            winkLeft: button(() => {
                setWinkLeft(true);
                setTimeout(() => setWinkLeft(false), 300);
            }),
            winkRight: button(() => {
                setWinkRight(true);
                setTimeout(() => setWinkRight(false), 300);
            }),
        },
    });
};
