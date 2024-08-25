import { useAnimations, useFBX } from "@react-three/drei";
import { useRef, useState } from "react";

export const useLoadAnimations = (group, defaultAction = "Idle") => {
    const { animations: idleAnimation } = useFBX("animations/Idle.fbx");
    const { animations: sadIdleAnimation } = useFBX("animations/Sad Idle.fbx");
    const { animations: happyIdleAnimation } = useFBX("animations/Happy Idle.fbx");
    const { animations: robotDanceAnimation } = useFBX("animations/Robot Hip Hop Dance.fbx");
    const { animations: waveDanceAnimation } = useFBX("animations/Wave Hip Hop Dance.fbx");
    const { animations: lockingDanceAnimation } = useFBX("animations/Locking Hip Hop Dance.fbx");
    const { animations: rumbaDanceAnimation } = useFBX("animations/Rumba Dancing.fbx");
    const { animations: angryAnimation } = useFBX("animations/Angry Gesture.fbx");
    const { animations: greetingAnimation } = useFBX("animations/Standing Greeting.fbx");
    const { animations: angryPointAnimation } = useFBX("animations/Angry Point.fbx");

    idleAnimation[0].name = "Idle";
    sadIdleAnimation[0].name = "Sad Idle";
    happyIdleAnimation[0].name = "Happy Idle";
    robotDanceAnimation[0].name = "Robot Dance";
    waveDanceAnimation[0].name = "Wave Dance";
    lockingDanceAnimation[0].name = "Locking Dance";
    rumbaDanceAnimation[0].name = "Rumba Dance";
    angryAnimation[0].name = "Angry";
    greetingAnimation[0].name = "Greeting";
    angryPointAnimation[0].name = "Angry Point";

    const animationRef = useRef([
        idleAnimation[0],
        angryAnimation[0],
        greetingAnimation[0],
        sadIdleAnimation[0],
        happyIdleAnimation[0],
        robotDanceAnimation[0],
        waveDanceAnimation[0],
        lockingDanceAnimation[0],
        rumbaDanceAnimation[0],
        angryPointAnimation[0],
    ]);

    const [animation, set] = useState({
        value: defaultAction,
        dev: false,
    });
    const setAnimation = (value, dev = false) => {
        if (!animation.dev && dev === true) return;
        if (animation.value === value && animation.dev === dev) return;
        set({
            value,
            dev,
        });
    };

    const { actions } = useAnimations(animationRef.current, group);

    return { animation: animation.value, setAnimation, actions };
};
