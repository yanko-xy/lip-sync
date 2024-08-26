import { useChat } from "@/hooks/useChat";
import { useEffect, useState } from "react";
import { Text } from "@react-three/drei";

export const Dots = (props) => {
    const { loading } = useChat();

    const [loadingText, setLoadingText] = useState("");
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingText((loadingText) => {
                    if (loadingText.length > 2) {
                        return ".";
                    }
                    return loadingText + ".";
                });
            }, 800);
            return () => clearInterval(interval);
        } else {
            setLoadingText("");
        }
    }, [loading]);

    if (!loading) return null;

    return (
        <group {...props}>
            <Text fontSize={1} anchorX={"center"} anchorY={"bottom"}>
                {loadingText}
                <meshBasicMaterial attach="material" color="gray" />
            </Text>
        </group>
    );
};
