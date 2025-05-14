# MenuImage

MenuImage is a Next.js application that takes a picture of your restaurant menu and generates beautiful AI images for each dish. The app uses Together AI services to analyze menu images, extract menu items, and generate appealing food photography.

## Features

- Upload restaurant menu images
- Extract menu items, descriptions, and prices using Llama 3.2 Vision
- Structure the extracted data with Llama 3.1 JSON mode
- Generate professional food photographs for each dish using FLUX.1 Schnell
- Regenerate images for individual menu items

## Technologies Used

- **Next.js 14** with App Router
- **Together AI** services:
  - Llama 3.2 Vision Instruct Turbo for menu text extraction
  - Llama 3.1 8B for structured outputs (JSON mode)
  - FLUX.1 Schnell for image generation
- **TailwindCSS** for styling
- **React Dropzone** for file uploads

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your Together AI API key:
   ```
   TOGETHER_API_KEY=your_together_api_key_here
   
   # Optional: for observability
   # HELICONE_API_KEY=your_helicone_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Upload a restaurant menu image using the drag and drop interface or click to select
2. Wait for the AI to analyze the menu and extract items
3. View the generated dish images alongside menu item details
4. Click "Regenerate Image" on any dish to get a new image variation

## API Architecture

MenuImage uses a single unified API endpoint:

- **POST /api/menu** - This endpoint handles both menu extraction and image generation:
  - When receiving a form upload with a menu image, it extracts menu items and generates images
  - When receiving a JSON payload with a menu item, it regenerates an image for that specific item

The application's workflow:
1. Upload menu image → Vision model extracts menu items → JSON model structures the data → Image generation model creates dish images
2. For regenerating: Send menu item details → Image generation model creates a new image → Return updated item with new image URL

## Development Notes

- The application uses the Together AI TypeScript SDK
- All API calls include proper error handling and logging
- Image generation happens in parallel to improve performance
- The app is optimized for mobile and desktop browsers

## License

This project is MIT licensed.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
