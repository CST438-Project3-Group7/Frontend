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

export const createUser = async (user: User) => {

    console.log("user to be made in the system", user);
    const url = `https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/`;
    // const url = `http://127.0.0.1:8000/create/user/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "picture": user.picture
            }),
        });

        const data: User = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};


export const searchUsersBool = async (user: string) => {
    console.log("user to be searched", user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/searchusers/${user}/`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log(data);
        const hasDuplicate = data.some((i:User) => i.username === user);
        if (hasDuplicate) {
            console.log("Error: duplicate username");
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

export const updateUser = async (user: User) => {
    console.log("updateUser: searching on", user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/update/user/${user.id}/`;
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "picture": user.picture
            }),
        });

        const data = await response.json();
        if (data.error) {
            console.log('updateUser: update not accepted');
            return null;
        }
        else if (typeof(data.email) != 'string') {
            console.log
            console.log('updateUser: email not accepted');
            return null
        }
        console.log("updateUser: returning ", data);
        return data as User;
    } catch (error) {
        console.error('updateUser: Error:', error);
    }
    return null;
};



export const deleteAccount = async (user: string) => {
    console.log("user to be searched", user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/delete/user/${user}/`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log(data);
        return true;
    } catch (error) {
        console.error('deleteAccount: FetchError:', error);
        return false;
    }
};