// netlify/functions/verify-payment.js
// Netlify Serverless Function for Razorpay Payment Signature Verification

const crypto = require('crypto');

/**
 * Netlify Function handler for verifying Razorpay payment signature
 * @param {Object} event - Netlify event object containing HTTP request data
 * @param {Object} context - Netlify context object
 */
exports.handler = async (event, context) => {
  // 1. Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Method Not Allowed. Only POST requests are supported.'
      })
    };
  }

  try {
    // 2. Check if RAZORPAY_KEY_SECRET environment variable is configured
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      console.error('RAZORPAY_KEY_SECRET environment variable is missing.');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Server configuration error. Razorpay secret key is not set.'
        })
      };
    }

    // 3. Parse request body
    let body;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Invalid JSON payload in request body.'
        })
      };
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    // 4. Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
        })
      };
    }

    // 5. Generate HMAC-SHA256 signature using order_id and payment_id
    // Format required by Razorpay: `${razorpay_order_id}|${razorpay_payment_id}`
    const payloadToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(payloadToSign)
      .digest('hex');

    // 6. Secure timing-safe signature comparison using crypto.timingSafeEqual
    const generatedBuffer = Buffer.from(generatedSignature, 'utf-8');
    const receivedBuffer = Buffer.from(razorpay_signature, 'utf-8');

    let isSignatureValid = false;
    if (generatedBuffer.length === receivedBuffer.length) {
      isSignatureValid = crypto.timingSafeEqual(generatedBuffer, receivedBuffer);
    }

    // 7. Return response based on verification result
    if (isSignatureValid) {
      console.log(`Payment successfully verified for orderId: ${razorpay_order_id}, paymentId: ${razorpay_payment_id}`);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Payment verified successfully',
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id
        })
      };
    } else {
      console.warn(`Signature mismatch for orderId: ${razorpay_order_id}. Received: ${razorpay_signature}, Expected: ${generatedSignature}`);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Payment verification failed. Signature mismatch.'
        })
      };
    }
  } catch (error) {
    // 8. Catch all unexpected errors
    console.error('Unhandled error in verify-payment serverless function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error while processing payment verification.'
      })
    };
  }
};
