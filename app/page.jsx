"use client";

import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/Experience";

export default function Page() {
    return (
        <>
            <div className="w-full h-full">
                <Canvas shadows camera={{ position: [0, 0, 11], fov: 42 }}>
                    <color attach="background" args={["#ececec"]} />
                    <Experience />
                </Canvas>
            </div>
        </>
    );
}
