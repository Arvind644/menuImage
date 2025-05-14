"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "../types";

interface MenuItemsProps {
  items: MenuItem[];
  onItemUpdate?: (updatedItem: MenuItem, index: number) => void;
}

export default function MenuItems({ 
  items: initialItems
}: MenuItemsProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);

  // Update local state when props change
  useEffect(() => {
    console.log("MenuItems received:", initialItems);
    setItems(initialItems);
  }, [initialItems]);

  if (items.length === 0) {
    return <div className="mt-12 text-center">No menu items to display</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Extracted Menu Items ({items.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={item.id || index} className="bg-white rounded-lg shadow overflow-hidden">
            {item.imageUrl ? (
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Image not available</p>
              </div>
            )}
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className="text-gray-700 font-medium">{item.price}</span>
              </div>
              <p className="text-gray-600 text-sm">{item.description}</p>
              {item.category && (
                <div className="mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {item.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 