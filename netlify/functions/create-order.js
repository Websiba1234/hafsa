// netlify/functions/create-order.js
// Netlify Serverless Function for Creating Razorpay Orders

const https = require('https');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
    };
  }

  try {
    let body;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Invalid JSON payload' })
      };
    }

    const { amount, receipt } = body || {};
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Valid amount is required' })
      };
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      // Fallback response for testing if keys are not set
      const mockOrderId = `order_mock_${Date.now()}`;
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: mockOrderId,
          amount: Math.round(amount * 100),
          currency: 'INR',
          key: razorpayKeyId || 'rzp_test_placeholder'
        })
      };
    }

    const amountInPaise = Math.round(amount * 100);
    const postData = JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1
    });

    const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');

    const options = {
      hostname: 'api.razorpay.com',
      port: 443,
      path: '/v1/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const razorpayResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(responseData) });
          } catch (err) {
            reject(err);
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(postData);
      req.end();
    });

    if (razorpayResponse.statusCode >= 200 && razorpayResponse.statusCode < 300) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: razorpayResponse.body.id,
          amount: razorpayResponse.body.amount,
          currency: razorpayResponse.body.currency,
          key: razorpayKeyId
        })
      };
    } else {
      console.error('Razorpay API error:', razorpayResponse.body);
      return {
        statusCode: razorpayResponse.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: razorpayResponse.body.error?.description || 'Failed to create Razorpay order'
        })
      };
    }
  } catch (err) {
    console.error('Error creating order function:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: err.message || 'Internal server error' })
    };
  }
};
