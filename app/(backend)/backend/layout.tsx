'use client'
import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGlobalStore from "@/libs/zustand";
import {
    useRouter, usePathname
} from "next/navigation";
import dynamic from "next/dynamic";

// Make sure to import the Navbar component from the correct path
const Navbar = dynamic(() => import('@/components/backend/Navbar'), { ssr: false });

const Layout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { session } = useGlobalStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    useEffect(() => {
        // If session is already available, no need to wait
        if (session) {
            setIsSessionLoading(false);
            return;
        }

        // If session is not available, wait for a short period before checking again
        const timeoutId = setTimeout(() => {
            if (!session) {
                // Redirect to login page if session is still not available
                router.push("/auth/login?redirect=" + pathname);
            } else {
                setIsSessionLoading(false);

                // @ts-ignore
                if (session?.user?.role !== "ADMIN") {
                    router.push("/auth/login?redirect=" + pathname);
                }
            }
        }, 1000); // Adjust the timeout duration as needed

        // Cleanup timeout on unmount or session change
        return () => clearTimeout(timeoutId);
    }, [session, router]);

    // If session is still loading, show a loading state
    if (isSessionLoading) {
        return <div></div>;
    }

    // If no session is available after loading, do not render the page
    if (!session) {
        return null; // or redirect to login page
    }

    return (
        <>
            <Navbar />
            <div style={{ flex: 1 }} className="container mx-auto px-4 pt-4 md:pt-12 lg:px-8 max-w-8xl mb-8 mt- flex flex-col md:flex-row gap-4">
                {/* [children] */}
                {children}
            </div>
            <ToastContainer />
        </>
    );
}

export default Layout;