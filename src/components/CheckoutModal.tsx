import React, { useState, useRef } from 'react';
import { X, CheckCircle, ShoppingBag, ShieldCheck, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  promoApplied: string;
  onOrderSuccess: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  promoApplied,
  onOrderSuccess
}: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Road No. 5, Mahesh Babu Chowk',
    city: 'Muzaffarpur',
    state: 'Bihar',
    zip: '842002',
    country: 'India',
    paymentMethod: 'cod'
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const isSubmittingRef = useRef(false);

  if (!isOpen) return null;

  const subtotal = (cartItems || []).reduce((acc, item) => acc + (item.quantity || 1) * (item.product?.price || 0), 0);
  const isFreeShipping = subtotal >= 999;
  const shippingCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  // Helper to save COD order locally if shipment API is unreachable
  const backupFailedCodOrder = (orderNum: string, payload: any) => {
    try {
      const existing = JSON.parse(localStorage.getItem('siba_failed_cod_orders') || '[]');
      existing.push({
        orderId: orderNum,
        createdAt: new Date().toISOString(),
        payload
      });
      localStorage.setItem('siba_failed_cod_orders', JSON.stringify(existing));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  };

  // Helper to format NimbusPost shipment payload
  const createShipmentPayload = (orderNum: string, paymentMode: 'cod' | 'prepaid', collectableAmount: number) => {
    const safeItems = Array.isArray(cartItems) ? cartItems : [];
    const totalQty = Math.max(1, safeItems.reduce((acc, item) => acc + (Number(item?.quantity) || 1), 0));
    const totalWeight = Math.max(150, totalQty * 150);

    return {
      order_number: orderNum,
      payment_mode: paymentMode,
      order_collectable_amount: collectableAmount,
      shipping_address: {
        name: formData.name.trim(),
        email: formData.email.trim() || '',
        address: formData.address.trim(),
        pincode: formData.zip.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: 'India',
        phone: formData.phone.trim()
      },
      items: safeItems.map((item) => ({
        name: item.product?.name || 'Item',
        qty: item.quantity || 1,
        price: item.product?.price || 0,
        sku: item.product?.productId || item.product?.id || 'SKU-DEFAULT'
      })),
      package: {
        weight: totalWeight,
        length: 25,
        width: 18,
        height: 3
      }
    };
  };

  // Detailed validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Full Name
    const nameTrim = formData.name.trim();
    if (!nameTrim) {
      newErrors.name = 'Full Name is required';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(nameTrim)) {
      newErrors.name = 'Full Name should contain letters and spaces only (min 2 characters)';
    }

    // Mobile Number
    const phoneTrim = formData.phone.trim();
    if (!phoneTrim) {
      newErrors.phone = 'Mobile Number is required';
    } else if (!/^[6-9]\d{9}$/.test(phoneTrim)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }

    // Email (Optional)
    const emailTrim = formData.email.trim();
    if (emailTrim && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address
    const addressTrim = formData.address.trim();
    if (!addressTrim) {
      newErrors.address = 'Shipping address is required';
    } else if (addressTrim.length < 10) {
      newErrors.address = 'Shipping address must be at least 10 characters long';
    }

    // City
    const cityTrim = formData.city.trim();
    if (!cityTrim) {
      newErrors.city = 'City is required';
    } else if (cityTrim.length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    // PIN Code
    const zipTrim = formData.zip.trim();
    if (!zipTrim) {
      newErrors.zip = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(zipTrim)) {
      newErrors.zip = 'Please enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus on the first error field
      const fieldOrder = ['name', 'phone', 'email', 'address', 'city', 'zip'];
      const firstErrorField = fieldOrder.find((f) => newErrors[f]);
      if (firstErrorField) {
        const el = document.getElementById(`field-${firstErrorField}`);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return false;
    }

    return true;
  };

  // Form validity for disabling button
  const isFormValid =
    formData.name.trim().length >= 2 &&
    /^[a-zA-Z\s]{2,50}$/.test(formData.name.trim()) &&
    /^[6-9]\d{9}$/.test(formData.phone.trim()) &&
    (!formData.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) &&
    formData.address.trim().length >= 10 &&
    formData.city.trim().length >= 2 &&
    /^\d{6}$/.test(formData.zip.trim());

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = (err) => {
        console.error('Razorpay SDK load error:', err);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Prevent double submission
    if (isSubmittingRef.current || isProcessing) {
      return;
    }

    if (!validate()) {
      return;
    }

    isSubmittingRef.current = true;

    // 1. COD Payment Method Logic
    if (formData.paymentMethod === 'cod') {
      setIsProcessing(true);

      const generatedOrderId = `SIBA-COD-${Math.floor(100000 + Math.random() * 900000)}`;
      const payload = createShipmentPayload(generatedOrderId, 'cod', finalTotal);

      try {
        const shipmentRes = await fetch('/.netlify/functions/create-shipment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const shipmentData = await shipmentRes.json().catch(() => null);

        if (shipmentRes.ok && shipmentData && shipmentData.success === true) {
          setOrderId(generatedOrderId);
          setPaymentId('');
          setSuccessMessage('Order Confirmed! Tracking details jaldi milengi.');
          setIsSuccess(true);
          onOrderSuccess();
        } else {
          // Save backup locally so order isn't lost
          backupFailedCodOrder(generatedOrderId, payload);
          setOrderId(generatedOrderId);
          setPaymentId('');
          setSuccessMessage('Order Placed! Aapka order receive ho gaya hai, humari team confirm karke tracking details bhejegi.');
          setIsSuccess(true);
          onOrderSuccess();
        }
      } catch (shipmentErr) {
        backupFailedCodOrder(generatedOrderId, payload);
        setOrderId(generatedOrderId);
        setPaymentId('');
        setSuccessMessage('Order Placed! Aapka order receive ho gaya hai, humari team confirm karke tracking details bhejegi.');
        setIsSuccess(true);
        onOrderSuccess();
      } finally {
        setIsProcessing(false);
        isSubmittingRef.current = false;
      }
      return;
    }

    // 2. Online Payment (Razorpay) Logic
    setIsProcessing(true);

    try {
      const uniqueReceipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

      // 10 second timeout for create-order API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);

      let createOrderRes: Response;
      try {
        createOrderRes = await fetch('/.netlify/functions/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: finalTotal,
            receipt: uniqueReceipt
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr.name === 'AbortError') {
          setApiError('Request timeout, dobara try karein.');
        } else {
          setApiError('Payment initiate nahi ho paya, dobara try karein.');
        }
        setIsProcessing(false);
        isSubmittingRef.current = false;
        return;
      }

      if (!createOrderRes.ok) {
        throw new Error(`Create order failed with HTTP ${createOrderRes.status}`);
      }

      const orderData = await createOrderRes.json().catch(() => null);

      if (!orderData || !orderData.orderId || !orderData.key) {
        throw new Error('Invalid response structure from create-order');
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK script failed to load');
      }

      // Open Razorpay checkout modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Siba Collection',
        description: 'Order Payment',
        order_id: orderData.orderId,
        prefill: {
          name: formData.name.trim(),
          email: formData.email.trim() || '',
          contact: formData.phone.trim()
        },
        theme: {
          color: '#b81236'
        },
        handler: async function (razorpayResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          setIsProcessing(true);
          setApiError(null);

          const verifiedOrderId = razorpayResponse.razorpay_order_id;
          const verifiedPaymentId = razorpayResponse.razorpay_payment_id;

          try {
            const verifyRes = await fetch('/.netlify/functions/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json().catch(() => null);

            if (verifyRes.ok && verifyData && verifyData.success === true) {
              setOrderId(verifiedOrderId);
              setPaymentId(verifiedPaymentId);

              const prepaidPayload = createShipmentPayload(verifiedOrderId, 'prepaid', 0);
              try {
                const shipmentRes = await fetch('/.netlify/functions/create-shipment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(prepaidPayload)
                });
                const shipmentData = await shipmentRes.json().catch(() => null);

                if (shipmentRes.ok && shipmentData && shipmentData.success === true) {
                  setSuccessMessage('Order Confirmed! Payment received, tracking details jaldi milengi.');
                } else {
                  setSuccessMessage('Payment successful! Order receive ho gaya hai, tracking details verify ho ke jaldi milengi.');
                }
              } catch (sErr) {
                setSuccessMessage('Payment successful! Order receive ho gaya hai, tracking details verify ho ke jaldi milengi.');
              }

              setIsSuccess(true);
              onOrderSuccess();
            } else {
              // Money was deducted from Razorpay! Never tell customer payment failed.
              setOrderId(verifiedOrderId);
              setPaymentId(verifiedPaymentId);
              setSuccessMessage('Payment ho gaya hai, verification pending hai, humari team confirm karegi.');
              setIsSuccess(true);
              onOrderSuccess();
            }
          } catch (verifyError) {
            // Network issue during verify call - Payment was completed on Razorpay!
            setOrderId(verifiedOrderId);
            setPaymentId(verifiedPaymentId);
            setSuccessMessage('Payment ho gaya hai, verification pending hai, humari team confirm karegi.');
            setIsSuccess(true);
            onOrderSuccess();
          } finally {
            setIsProcessing(false);
            isSubmittingRef.current = false;
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            isSubmittingRef.current = false;
          }
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on('payment.failed', function (failureData: any) {
        setApiError('Payment fail ho gaya, kripya dobara koshish karein.');
        setIsProcessing(false);
        isSubmittingRef.current = false;
      });

      razorpayInstance.open();
    } catch (err) {
      setApiError('Payment initiate nahi ho paya, dobara try karein.');
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  };

  const handleOrderSuccessClose = () => {
    onOrderSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={isSuccess ? undefined : onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal content box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 35 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0, y: 35 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto relative z-10 border border-brand-100 flex flex-col p-6 sm:p-8"
        >
          {/* Close top button */}
          {!isSuccess && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-brand-50 hover:bg-brand-100 text-gray-500 hover:text-brand-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {!isSuccess ? (
            /* Billing Form / Checkout screen */
            <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
                  <ShoppingBag className="w-5 h-5 text-brand-600" />
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-wider">
                    Checkout Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping Form Left column */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <MapPin className="w-4 h-4 text-brand-500" />
                      Delivery Information
                    </h3>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                      <input
                        id="field-name"
                        type="text"
                        placeholder="Siba Kumari"
                        value={formData.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, name: val });
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: '' }));
                          }
                        }}
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none bg-brand-50/20 ${
                          errors.name ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-brand-500'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-xs text-gray-500 font-bold">+91</span>
                        <input
                          id="field-phone"
                          type="tel"
                          placeholder="8210941262"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, phone: val });
                            if (errors.phone) {
                              setErrors((prev) => ({ ...prev, phone: '' }));
                            }
                          }}
                          className={`w-full text-xs p-3 pl-11 rounded-xl border focus:outline-none bg-brand-50/20 ${
                            errors.phone ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-brand-500'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="field-email"
                        type="email"
                        placeholder="customer@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, email: val });
                          if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: '' }));
                          }
                        }}
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none bg-brand-50/20 ${
                          errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-brand-500'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Shipping Address *</label>
                      <textarea
                        id="field-address"
                        rows={2}
                        placeholder="Flat, House no., Building, Street Name"
                        value={formData.address}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, address: val });
                          if (errors.address) {
                            setErrors((prev) => ({ ...prev, address: '' }));
                          }
                        }}
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none bg-brand-50/20 resize-none ${
                          errors.address ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-brand-500'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* ZIP & City */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                        <input
                          id="field-city"
                          type="text"
                          value={formData.city}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({ ...formData, city: val });
                            if (errors.city) {
                              setErrors((prev) => ({ ...prev, city: '' }));
                            }
                          }}
                          className={`w-full text-xs p-3 rounded-xl border focus:outline-none bg-brand-50/20 ${
                            errors.city ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-brand-500'
                          }`}
                        />
                        {errors.city && (
                          <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">PIN Code *</label>
                        <input
                          id="field-zip"
                          type="text"
                          maxLength={6}
                          placeholder="842001"
                          value={formData.zip}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, zip: val });
                            if (errors.zip) {
                              setErrors((prev) => ({ ...prev, zip: '' }));
                            }
                          }}
                          className={`w-full text-xs p-3 rounded-xl border focus:outline-none bg-brand-50/20 ${
                            errors.zip ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-brand-500'
                          }`}
                        />
                        {errors.zip && (
                          <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                            {errors.zip}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method and Summary Right column */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <CreditCard className="w-4 h-4 text-brand-500" />
                      Payment Method
                    </h3>

                    {/* Payment Radios */}
                    <div className="space-y-2.5">
                      {/* Cash on Delivery */}
                      <label className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-100/60 bg-brand-50/20 hover:bg-brand-50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                          className="text-brand-500 focus:ring-brand-500 accent-brand-500 w-4 h-4"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Cash on Delivery (COD)</p>
                          <p className="text-[10px] text-gray-500">Pay cash/UPI at the time of delivery</p>
                        </div>
                      </label>

                      {/* UPI */}
                      <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/10 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                          className="text-brand-500 focus:ring-brand-500 accent-brand-500 w-4 h-4"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Instant UPI Payment</p>
                          <p className="text-[10px] text-gray-500">Scan QR or enter ID (GPay, PhonePe, Paytm)</p>
                        </div>
                      </label>

                      {/* Card */}
                      <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/10 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                          className="text-brand-500 focus:ring-brand-500 accent-brand-500 w-4 h-4"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Debit / Credit Card</p>
                          <p className="text-[10px] text-gray-500">Visa, Mastercard, RuPay cards supported</p>
                        </div>
                      </label>
                    </div>

                    {/* Compact Order summary breakdown */}
                    <div className="bg-brand-50/45 p-4 rounded-xl border border-brand-100/50 space-y-2 text-xs">
                      <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px] border-b border-brand-100/40 pb-1.5 mb-2">
                        Bag Summary ({cartItems.length} items)
                      </p>

                      <div className="flex justify-between text-gray-600">
                        <span>Items Subtotal</span>
                        <span className="font-serif">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>

                      {promoApplied && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Discount ({promoApplied})</span>
                          <span className="font-serif">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-600">
                        <span>Shipping Cost</span>
                        <span className="font-serif">
                          {shippingCost === 0 ? (
                            <span className="text-emerald-700 font-semibold uppercase">Free</span>
                          ) : (
                            `₹${shippingCost}`
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-dashed border-brand-200/50 pt-2.5 mt-2.5">
                        <span>Total Due</span>
                        <span className="font-serif">₹{finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Api Error Alert Banner */}
              {apiError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 my-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="font-medium leading-relaxed">{apiError}</p>
                </div>
              )}

              {/* Form submit button */}
              <div className="border-t border-gray-100 pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  Your payment and shipping data is encrypted and secure.
                </span>
                <button
                  id="submit-order-btn"
                  type="submit"
                  disabled={!isFormValid || isProcessing}
                  className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{formData.paymentMethod === 'cod' ? 'Placing Order...' : 'Processing...'}</span>
                    </>
                  ) : formData.paymentMethod === 'cod' ? (
                    `Place Order (COD)`
                  ) : (
                    `Pay Now (₹${finalTotal.toLocaleString('en-IN')})`
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* SUCCESS Screen with high end animations */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 space-y-6 flex-1 flex flex-col justify-center items-center"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Order Successfully Placed!</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">{successMessage}</p>
              </div>

              {/* Order reference badges */}
              <div className="bg-brand-50/40 border border-brand-100 rounded-2xl p-4 text-xs max-w-sm w-full space-y-2">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Order ID:</span>
                  <span className="font-mono font-bold text-gray-900">{orderId}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Payment ID:</span>
                    <span className="font-mono font-bold text-gray-900">{paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-600 pt-1 border-t border-brand-100/50">
                  <span>Total Paid/Due:</span>
                  <span className="font-bold text-brand-700">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleOrderSuccessClose}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Continue Shopping
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
