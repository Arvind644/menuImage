"use client";

import { useState } from "react";
import Image from "next/image";
import ImageUploader from "./components/ImageUploader";
import MenuItems from "./components/MenuItems";
import { MenuItem } from "./types";

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setMenuItems([]);
    setError(null);
    
    try {
      // Create a URL for preview
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);

      // Convert file to FormData
      const formData = new FormData();
      formData.append("menuImage", file);
      
      // Upload to our API route
      console.log("Uploading menu image...");
      const response = await fetch("/api/menu", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract menu items");
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.menuItems && Array.isArray(data.menuItems)) {
        console.log(`Received ${data.menuItems.length} menu items with images`);
        setMenuItems(data.menuItems);
      } else {
        console.error("Unexpected response format:", data);
        setError("Received an unexpected response format from the API");
      }
    } catch (error) {
      console.error("Error extracting menu items:", error);
      setError(error instanceof Error ? error.message : "Failed to extract menu items");
    } finally {
      setIsLoading(false);
    }
  };

  // This is a simplified version for our demo that doesn't support image regeneration
  const handleMenuItemUpdate = () => {
    console.log("Image regeneration not supported in this simplified version");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col">
      <header className="mb-10 text-center">
        {/* Build Club Logo */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/buildclub-long.png" 
            alt="Build Club Logo" 
            width={300} 
            height={60} 
            className="h-auto"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Menu<span className="text-blue-600">Image</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload a picture of your restaurant menu and we'll generate beautiful images 
          for each dish using Together AI's Llama 3.2 Vision and FLUX.1 Schnell.
        </p>
      </header>

      <main className="max-w-6xl mx-auto w-full flex-grow">
        <ImageUploader onUpload={handleImageUpload} isLoading={isLoading} />
        
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-red-500 mt-2">
              Please make sure you have set your Together API key in the .env.local file.
            </p>
          </div>
        )}
        
        {originalImage && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Original Menu</h2>
            <div className="flex justify-center">
              <img 
                src={originalImage} 
                alt="Uploaded menu" 
                className="max-h-[500px] object-contain rounded border border-gray-200" 
              />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-8 text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Analyzing your menu and generating dish images...</p>
            <p className="mt-2 text-sm text-gray-500">This may take a minute or two depending on the size and complexity of the menu.</p>
          </div>
        )}

        {menuItems.length > 0 && (
          <MenuItems 
            items={menuItems} 
            onItemUpdate={handleMenuItemUpdate}
          />
        )}
      </main>
        
      <footer className="border-t py-4 bg-gray-50">
          <div className="container mx-auto text-center text-sm text-gray-600">
            <p>Powered by Together AI & Next.js</p>
            <p className="mt-1">© 2025 <a href="https://buildclub.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">Build Club</a>. All rights reserved.</p>
          </div>
        </footer>
    </div>
  );
}
