import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Avatar } from "./avatar/Avater";
import { useThree } from "@react-three/fiber";
import { Suspense } from "react";
import { Dots } from "./loadingdots/Dots";
import { Leva, useControls } from "leva";

export const Experience = () => {
    const texture = useTexture("textures/youtubeBackground.jpg");
    const viewport = useThree((state) => state.viewport);

    const { controlEnable } = useControls("Settings", {
        controlEnable: false,
    });

    return (
        <>
            {controlEnable && <OrbitControls />}

            <Environment preset="sunset" />
            <Suspense>
                <Dots position-y={1} rotation-x={0} position-z={0.1} />
            </Suspense>
            <Avatar position={[0, -3, 3]} scale={2} />
            <mesh>
                <planeGeometry args={[viewport.width, viewport.height]} />
                <meshBasicMaterial map={texture} />
            </mesh>
            {/* <Leva hidden /> */}
        </>
    );
};
