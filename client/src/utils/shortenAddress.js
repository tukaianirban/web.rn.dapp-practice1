 export const shortenAddress = (address) => {
    // return a formatted string which has the first 5 chars and last 4 chars
    return `${address.slice(0,5)}....${address.slice(address.length-4)}`
 }