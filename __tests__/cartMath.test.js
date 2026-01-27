import { calculateDiscount, calculateSubtotal, calculateTotal } from '../utils/cartMath';

describe('cartMath', () => {
  test('calculateSubtotal formats to 2 decimals', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5.5, quantity: 1 },
    ];

    expect(calculateSubtotal(items)).toBe('25.50');
  });

  test('calculateDiscount sums per-item discounts by quantity', () => {
    const items = [
      { price: 10, quantity: 2, discount: 1 },
      { price: 5.5, quantity: 1, discount: 0.5 },
    ];

    expect(calculateDiscount(items)).toBe('2.50');
  });

  test('calculateTotal matches CartContext semantics', () => {
    const items = [
      { price: 10, quantity: 2, discount: 1 },
      { price: 5.5, quantity: 1, discount: 0.5 },
    ];

    const taxDetails = [{ gstAmount: 1.2 }, { gstAmount: 0.3 }];

    // subtotal 25.50 - discount 2.50 + gst 1.50 + delivery 15 + platform 10 = 49.50
    expect(
      calculateTotal({
        items,
        taxDetails,
        deliveryFee: 15,
        platformFee: 10,
      })
    ).toBe('49.50');
  });
});
