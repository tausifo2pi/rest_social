const isObject = (input) => {

    if (Array.isArray(input) || input === null || typeof input === "function") return false
    else if (typeof input === "object") return true
    return false
}


const isPropertiesInObject = (Obj, ObjPropertiesArray) => {
    let notPropertiesOfObject = []
    for (let prop = 0; prop < ObjPropertiesArray; prop++) {
        if (!(ObjPropertiesArray[prop] in Obj)) notPropertiesOfObject.push(ObjPropertiesArray[prop])
    }
    return notPropertiesOfObject.length ? false : true

}

const isRealPositiveNumber = (number) => {
    return Math.sign(number) === 1 ? true : false
}



const isString = (input) => {
    if (!(typeof input === "string") || !input.trim().length) return false
    return true
}

const isArrayString = (input) => {
    if (!Array.isArray(input)) return { e: "invalid data type", r: null }

    const validate = []
    for (let i = 0; input.length > i; i++) {
        validate.push(isString(input[i]) ? true : false)
    }
    return validate
}
function getUnwantedProperties(obj, props){
    const extra = []
    Object.keys(obj).forEach((prop)=>{
        if(!props.includes(prop)) extra.push(prop)
    })
    return extra
}

const isArrayOfObjectsWithProperties = (arr, props) => {
    return arr.every(obj => props.every(prop => prop in obj));
}

const isObjectWithProperties = (obj, props) => {
    return props.every(prop => prop in obj);
}

const isArrayOfObjectsWithSomeProperties = (arr, props) => {
    return arr.every(obj => props.some(prop => prop in obj));
}

const isObjectWithSomeProperties = (obj, props) => {
    return props.some(prop => prop in obj);
}

const isArrayOfObjectsWithoutProperties = (arr, props) => {
    return arr.every(obj => props.every(prop => !(prop in obj)));
}

const isObjectWithoutProperties = (obj, props) => {
    return props.every(prop => !(prop in obj));
}

const isArrayOfObjectsWithPropertyValue = (arr, prop, value) => {
    return arr.every(obj => obj[prop] === value);
}

const isObjectWithPropertyValue = (obj, prop, value) => {
    return obj[prop] === value;
}
const findIndexByPropertyValue = (arr, prop, value) => {
    return arr.findIndex(obj => obj[prop] === value);
}



module.exports = {
    isObject,

    isString,
    isArrayString,
    isPropertiesInObject,
    isRealPositiveNumber,
    isObjectWithProperties,
    
    isObjectWithoutProperties,
    isObjectWithPropertyValue,
    isObjectWithSomeProperties,

    isArrayOfObjectsWithPropertyValue,
    isArrayOfObjectsWithoutProperties,
    isArrayOfObjectsWithSomeProperties,
    isArrayOfObjectsWithProperties,
    findIndexByPropertyValue,
    
    getUnwantedProperties
    
    
}


