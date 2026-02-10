const userDetail = new Map();

const userIDKey = 'HMO_USER_OBJECT_ID';

export function setUserObjectId(userObjectId){
    console.log("Storing user ID in cache:", userObjectId); 
    localStorage.setItem(userIDKey, userObjectId);

}

export function getUserObjectId(){
    const val = localStorage.getItem(userIDKey);
    console.log("Getting user ID from cache:", val); 
    return val;

}





