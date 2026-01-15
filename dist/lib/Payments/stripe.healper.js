"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaymentStatusHelper = exports.createStripePaymentLink = void 0;
const stripe_1 = __importDefault(require("stripe"));
const ENV_1 = require("../../config/ENV");
const stripe = new stripe_1.default(ENV_1.STRIPE_SECRET_KEY);
/**
 * Creates a Stripe payment link for property booking
 * @param paymentData - Object containing amount, name, author_id, booking_id, and optional URLs
 * @returns Payment link URL
 */
const createStripePaymentLink = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, name, author_id, booking_id } = paymentData;
        const successUrl = `${ENV_1.FRONT_END_URL}/bookings/success`;
        const cancelUrl = `${ENV_1.FRONT_END_URL}/bookings/cancel`;
        // Create a Stripe Checkout Session
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd", // You can make this configurable if needed
                        product_data: {
                            name: name,
                            metadata: {
                                author_id: author_id.toString(),
                                booking_id: booking_id.toString(),
                            },
                        },
                        unit_amount: amount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${cancelUrl}?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                author_id: author_id.toString(),
                booking_id: booking_id.toString(),
            },
        });
        return session.url;
    }
    catch (error) {
        throw new Error(`Failed to create payment link: ${error.message}`);
    }
});
exports.createStripePaymentLink = createStripePaymentLink;
/**
 * Checks the status of a Stripe payment session
 * @param sessionId - The ID of the Stripe checkout session to check
 * @returns Payment status and metadata
 */
const checkPaymentStatusHelper = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        return {
            status: session.payment_status,
            metadata: session.metadata,
            sessionData: {
                id: session.id,
                amount_total: session.amount_total,
                currency: session.currency,
                customer_email: (_a = session.customer_details) === null || _a === void 0 ? void 0 : _a.email,
                payment_intent: session.payment_intent,
            },
        };
    }
    catch (error) {
        throw new Error(`Failed to check payment status: ${error.message}`);
    }
});
exports.checkPaymentStatusHelper = checkPaymentStatusHelper;
