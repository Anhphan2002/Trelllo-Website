
export const mapOrder = (array, order, key) => {
    array.sort((a,b) => order.indexOf(a[key]) - order.indexOf(b[key]));
    return array;
}
// export const mapOrder = (array, order, key) => {

//     array.sort((a, b) => {
//         return order?.indexOf(a[key]) - order?.indexOf(b[key]);
//     });

//     // console.log("Sorted Array:", array);
//     return array;
// };

// export const mapOrder = (array, order, key) => {
//     console.log('Array:', array);
//     console.log('Order:', order);
//     console.log('Key:', key);
//     if (!array || !Array.isArray(array) || !order || !Array.isArray(order) || !key) {
//         // Handle the case where any of the inputs are not valid
//         console.error('Invalid input for mapOrder function');
//         return array;
//     }

//     array.sort((a, b) => {
//         const indexA = order.indexOf(a[key]);
//         const indexB = order.indexOf(b[key]);

//         if (indexA === -1 || indexB === -1) {
//             // Handle the case where the key doesn't exist in the order array
//             console.error(`Key ${key} not found in the order array`);
//             return 0;
//         }

//         return indexA - indexB;
//     });

//     return array;
// };
