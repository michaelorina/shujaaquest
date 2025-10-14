import { NextRequest, NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error('GEMINI_API_KEY environment variable is not set');
// }

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { heroName } = await request.json();
    
    if (!heroName || typeof heroName !== 'string') {
      return NextResponse.json(
        { error: 'Hero name is required' },
        { status: 400 }
      );
    }

    // Strategy 1: Try to fetch from Wikipedia API
    try {
      const wikiImage = await fetchFromWikipedia(heroName);
      if (wikiImage) {
        return NextResponse.json({ 
          imageUrl: wikiImage,
          source: 'wikipedia'
        });
      }
    } catch (error) {
      console.log('Wikipedia fetch failed:', error);
    }

    // Strategy 2: Try to generate with Gemini
    try {
      const generatedImage = await generateHeroImage(heroName);
      if (generatedImage) {
        return NextResponse.json({ 
          imageUrl: generatedImage,
          source: 'generated'
        });
      }
    } catch (error) {
      console.log('Image generation failed:', error);
    }

    // Strategy 3: Return default avatar
    return NextResponse.json({ 
      imageUrl: '/avatars/default-hero.png',
      source: 'default'
    });

  } catch (error) {
    console.error('Error fetching hero image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero image' },
      { status: 500 }
    );
  }
}

async function fetchFromWikipedia(heroName: string): Promise<string | null> {
  try {
    // Search for the hero on Wikipedia
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(heroName)}`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.thumbnail && data.thumbnail.source) {
      // Convert thumbnail URL to full size
      const thumbnailUrl = data.thumbnail.source;
      const fullSizeUrl = thumbnailUrl.replace(/\/\d+px-/, '/800px-');
      return fullSizeUrl;
    }
    
    return null;
  } catch (error) {
    console.log('Wikipedia API error:', error);
    return null;
  }
}

async function generateHeroImage(heroName: string): Promise<string | null> {
  try {
    // Future implementation for AI-generated hero images
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // const prompt = `
    // Generate a detailed, artistic portrait description of ${heroName} that could be used as a reference for creating an image. 
    // Focus on their distinctive features, clothing style, and any symbols associated with them.
    // Make it respectful and dignified, suitable for a hero quiz game.
    // Keep the description under 200 words and focus on visual elements that would make a good portrait.
    // `;

    // const result = await model.generateContent(prompt);
    // const response = await result.response;
    // const description = response.text(); // Will be used for image generation in future
    
    // For now, we'll return a placeholder that indicates we have a description
    // In a full implementation, you might use this description with an image generation API
    // or create a custom avatar based on the description
    return `/avatars/generated-${heroName.toLowerCase().replace(/\s+/g, '-')}.png`;
    
  } catch (error) {
    console.log('Image generation error:', error);
    return null;
  }
}
