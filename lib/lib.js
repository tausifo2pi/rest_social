//delay function
/**
 * 
 * @param {number} ms 
 * @returns <Promise>
 */
const delay = ms => new Promise(res => setTimeout(res, ms));


const uniqueArrayOnObjectProperties = (array, key) => {
    return [...new Map(array.map(item =>
        [item[key], item])).values()];


}
const formatNumberForWhatsapp = (number)=>{
    let output 
    if(number.startsWith("+")){
        output = number.replace("+", "")
    }
    else if(number.startsWith("01")){
        output = "88" + number
    }
    else {
        output = number
    }
    return output
}


module.exports = {
    delay,
    uniqueArrayOnObjectProperties,
    formatNumberForWhatsapp

}