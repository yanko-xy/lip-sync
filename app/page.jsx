"use client";

import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/Experience";
import { UI } from "@/components/ui/UI";
import { ChatProvider } from "@/hooks/useChat";
import { Suspense, useState } from "react";
import { LoadingScreen } from "@/components/loadingscreen/LoadingScreen";

export default function Page() {
    const [started, setStarted] = useState(false);

    return (
        <>
            <div className="w-full h-full">
                <ChatProvider>
                    <Canvas shadows camera={{ position: [0, 0, 11], fov: 42 }}>
                        <color attach="background" args={["#ececec"]} />
                        <Suspense>{started && <Experience />}</Suspense>
                    </Canvas>
                    <Suspense>{started && <UI hidden />}</Suspense>
                    <LoadingScreen started={started} setStarted={setStarted} />
                </ChatProvider>
            </div>
        </>
    );
}
