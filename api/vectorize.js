import { NextResponse } from 'next/server';

const API_ID = 'vk237hgpmwkt3cb';
const API_SECRET = 'dppou3qr9kj1dkvk6m0el874n9qk0ipv0972ls5v469p5u587sgf';

export async function POST(req) {
  const formData = await req.formData();
  const image = formData.get('image');
  
  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const vectorizerApiUrl = 'https://vectorizer.ai/api/v1/vectorize';

  // Add mode=test to the formData
  formData.append('mode', 'test');

  try {
    const response = await fetch(vectorizerApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(API_ID + ':' + API_SECRET).toString('base64')
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const vectorizedImage = await response.blob();
    
    return new NextResponse(vectorizedImage, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
  }
}
