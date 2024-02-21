"use client";
import { PhotoProvider } from 'react-photo-view';

export default function GalleryProvider({ children }: { children: React.ReactNode }) {
    return <PhotoProvider>{children}</PhotoProvider>;
}