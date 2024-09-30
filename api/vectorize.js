import { NextResponse } from 'next/server';

const API_ID = 'vkp6a6288xwqgkn';
const API_SECRET = '8bfsrfvo09du286s937flvr6rqipu9odqp8utmu5a4qnucb5tp4s';

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
