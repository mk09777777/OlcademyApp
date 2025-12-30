export const calculateSubtotal = (items = []) => {
  const subtotal = items.reduce((sum, item) => {
    const price = typeof item?.price === 'number' ? item.price : Number(item?.price) || 0;
    const quantity = typeof item?.quantity === 'number' ? item.quantity : Number(item?.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  return subtotal.toFixed(2);
};

export const calculateDiscount = (items = []) => {
  const discount = items.reduce((sum, item) => {
    const perItemDiscount = typeof item?.discount === 'number' ? item.discount : Number(item?.discount) || 0;
    const quantity = typeof item?.quantity === 'number' ? item.quantity : Number(item?.quantity) || 0;
    return sum + perItemDiscount * quantity;
  }, 0);

  return discount.toFixed(2);
};

export const calculateGst = (taxDetails = []) => {
  return taxDetails.reduce((sum, tax) => {
    const gstAmount = typeof tax?.gstAmount === 'number' ? tax.gstAmount : Number(tax?.gstAmount) || 0;
    return sum + gstAmount;
  }, 0);
};

export const calculateTotal = ({
  items = [],
  taxDetails = [],
  deliveryFee = 0,
  platformFee = 0,
} = {}) => {
  const subtotal = Number(calculateSubtotal(items));
  const discount = Number(calculateDiscount(items));
  const gst = calculateGst(taxDetails);

  const safeDeliveryFee = typeof deliveryFee === 'number' ? deliveryFee : Number(deliveryFee) || 0;
  const safePlatformFee = typeof platformFee === 'number' ? platformFee : Number(platformFee) || 0;

  return (subtotal - discount + gst + safeDeliveryFee + safePlatformFee).toFixed(2);
};
