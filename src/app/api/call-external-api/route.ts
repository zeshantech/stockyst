import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    // Get the token
    const token = await auth0.getAccessToken();
    
    if (!token) {
      throw new Error('Failed to get access token from Auth0');
    }

    console.log('token', token);
    
    // Try the root endpoint first
    try {
      const res = await fetch('http://localhost:8080/user', {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
      
      // If root fails, log the error but don't throw yet
      const errorText = await res.text();
      console.log(`Root endpoint failed: ${res.status}, ${errorText}`);
      
    } catch (rootError) {
      console.log('Error calling root endpoint:', rootError);
    }
    
    // Try the /authorized endpoint as fallback
    const res = await fetch('http://localhost:8080', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API responded with status: ${res.status}, message: ${errorText}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API call failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to call API' },
      { status: 500 }
    );
  }
} 