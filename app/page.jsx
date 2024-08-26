"use client";

import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/Experience";
import { UI } from "@/components/ui/UI";
import { ChatProvider } from "@/hooks/useChat";

export default function Page() {
    return (
        <>
            <div className="w-full h-full">
                <ChatProvider>
                    <Canvas shadows camera={{ position: [0, 0, 11], fov: 42 }}>
                        <color attach="background" args={["#ececec"]} />
                        <Experience />
                    </Canvas>
                    <UI hidden />
                </ChatProvider>
            </div>
        </>
    );
}
