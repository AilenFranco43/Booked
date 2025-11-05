// src/services/cloudinary.js

export async function getSignature(paramsToSign) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cloudinary/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paramsToSign }),
    });
  
    const data = await response.json();
    return data.signature;
  }
  