import {User} from './types';

// Returns user information or null
export const getUserInfoDb = async (userId : number) => {
    if(typeof(userId) == "undefined"){
        console.log('user id was undefined');
        return null;
    }
    const url = `https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/${userId}/`;
    console.log("url is ", url)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if(data.error){
            console.log('user not found');
            return null;
        }
        console.log("data within the db func is ", data);
        return data as User;
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
};
