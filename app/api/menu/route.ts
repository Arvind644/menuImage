/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { Together } from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    // Get the form data with the menu image
    const formData = await request.formData();
    const menuImage = formData.get("menuImage") as File;

    if (!menuImage) {
      return Response.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const imageBuffer = Buffer.from(await menuImage.arrayBuffer());
    const dataUrl = `data:image/${menuImage.type};base64,${imageBuffer.toString('base64')}`;
    
    // System prompt for extracting menu items
    const systemPrompt = `You are given an image of a menu. Your job is to take each item in the menu and convert it into the following JSON format:

[{"name": "name of menu item", "price": "price of the menu item", "description": "description of menu item", "category": "category (if exists)"}, ...]

Please make sure to include all items in the menu and include a price (if it exists) & a description (if it exists). 
ALSO PLEASE ONLY RETURN JSON. IT'S VERY IMPORTANT FOR MY JOB THAT YOU ONLY RETURN JSON.`;

    // Extract menu items using Llama 3.2 Vision
    console.log("Extracting menu items with Llama 3.2 Vision...");
    const output = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: systemPrompt },
            {
              type: "image_url",
              image_url: {
                url: dataUrl
              }
            }
          ]
        }
      ]
    });

    const menuItems = output?.choices[0]?.message?.content;
    if (!menuItems) {
      return Response.json(
        { error: "Failed to extract menu text from image" },
        { status: 500 }
      );
    }
    
    // Process the extracted text with Llama 3.1 to get structured JSON
    const extract = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "The following is a list of items from a menu. Only answer in JSON."
        },
        {
          role: "user",
          content: menuItems
        }
      ],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      response_format: { type: "json_object" }
    });

    let menuItemsJSON;
    if (extract?.choices?.[0]?.message?.content) {
      menuItemsJSON = JSON.parse(extract?.choices?.[0]?.message?.content);
      console.log({ menuItemsJSON });
    }

    // Get the actual array of menu items, handling different possible response structures
    let menuArray = [];
    if (Array.isArray(menuItemsJSON)) {
      menuArray = menuItemsJSON;
    } else if (menuItemsJSON?.items && Array.isArray(menuItemsJSON.items)) {
      menuArray = menuItemsJSON.items;
    } else if (menuItemsJSON?.menu && Array.isArray(menuItemsJSON.menu)) {
      menuArray = menuItemsJSON.menu;
    }
    
    if (menuArray.length === 0) {
      console.error("No menu items found in response");
      return Response.json(
        { error: "No menu items were extracted" },
        { status: 404 }
      );
    }
    
    // Create an array of promises for parallel image generation
    const imagePromises = menuArray.map(async (item: any, index: number) => {
      console.log(`Processing image for: ${item.name} (${index + 1}/${menuArray.length})`);
      try {
        const response = await together.images.create({
          prompt: `A picture of food for a menu, hyper realistic, highly detailed, ${item.name}, ${item.description || ""}.`,
          model: "black-forest-labs/FLUX.1-schnell",
          width: 768,
          height: 512,
          steps: 5
        });
        
        // Ensure item has an id for React key prop
        item.id = item.id || `menu-item-${index}`;
        item.imageUrl = response.data?.[0]?.url;
        return item;
      } catch (error) {
        console.error(`Error generating image for ${item.name}:`, error);
        // Return item even if image generation fails
        item.id = item.id || `menu-item-${index}`;
        return item;
      }
    });

    // Wait for all images to be generated
    const menuItemsWithImages = await Promise.all(imagePromises);
    console.log(`Successfully processed ${menuItemsWithImages.length} menu items with images`);

    return Response.json({ menuItems: menuItemsWithImages });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export const maxDuration = 60; 