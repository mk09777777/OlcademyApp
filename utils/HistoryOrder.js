const OrderHistory=require("../models/RestaurantsDasModel/History");

const getOrderDateFromTimeSlot=async(orderDate,timeSlot)=>{
    const orderDatenew=new Date(orderDate);
    const [time,period]=timeSlot?.split(' ');
    let [hours,minutes]=time?.split(':');
    if(period==='PM' && hours!==12){
        hours = parseInt(hours) + 12;
    }
    if (period === 'AM' && hours === '12') {
        hours = 0;
    }
    orderDatenew.setHours(hours);
    orderDatenew.setMinutes(minutes);
    orderDatenew.setSeconds(0);
    orderDatenew.setMilliseconds(0);
  
    return orderDatenew;
};


// const OrderHistroyController=async(
// username,mode,items,totalPrice,status,orderTime
// )=>{
//     try{
//         if(totalPrice<0){
//               throw new Error("Price must be positive");
//         }
//         if(!username || !mode || !status || !orderTime){
//             throw new Error("Fields are must required..");
//         }
//         let itemsInfo=items || [];
//         const newHistory=await  OrderHistory.create({
//             username:username,
//             mode:mode,
//             items:itemsInfo,
//             totalPrice,
//             status:status,
//             orderTime,
//         })
//         console.log(newHistory)
//         if(!newHistory){
//             throw new Error("History order is not created..");
//         }
        
//     }
//     catch(error){
//         throw new Error(error);
        
//     }
// }

const OrderHistroyController = async (username, mode, items, totalPrice, status, orderTime) => {
    try {
        if (!username || !mode || !status || !orderTime) {
            throw new Error("All fields (username, mode, status, orderTime) are required.");
        }

        if (totalPrice < 0) {
            throw new Error("Total price must be non-negative.");
        }

        console.log("Attempting to create history order with:", {
            username,
            mode,
            items,
            totalPrice,
            status,
            orderTime,
        });

        const newHistory = await OrderHistory.create({
            username,
            mode,
            items: items || [],
            totalPrice,
            status,
            orderTime,
        });

        if (!newHistory) {
            throw new Error("Failed to create history order.");
        }

        await console.log("History order created successfully:", newHistory);
        return newHistory;
    } catch (error) {
        console.error("Error in OrderHistroyController:", error.message);
        throw error;
    }
};
module.exports={OrderHistroyController,getOrderDateFromTimeSlot}