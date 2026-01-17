import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const fullEndpoint = 'http://strands-agents:9000/invocations';

    console.log('Proxying to:', fullEndpoint);

    const response = await axios.post(fullEndpoint, {
      prompt
    }, {
      responseType: 'stream'
    });

    // ストリームレスポンスをそのまま返す
    return new NextResponse(response.data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers['content-type'] || 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}