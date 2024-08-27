import * as THREE from "three";

// Model target deformation
export const lerpMorphTarget = (scene, target, value, speed = 0.1) => {
    scene.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
            const index = child.morphTargetDictionary[target];
            if (index === undefined || child.morphTargetInfluences[index] === undefined) {
                return;
            }

            child.morphTargetInfluences[index] = THREE.MathUtils.lerp(child.morphTargetInfluences[index], value, speed);
        }
    });
};

// Random number
export const getRandomNumber = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1)) + start;
};
