import { AsyncStorage } from 'react-native';
export default class UserProvider {
    static getUserDetailsByEmail(email) {
        return new Promise((resolve, reject) => {
            fetch('http://192.168.43.72:3333/api/get-user-by-email', {
                method: 'POST',
                body: JSON.stringify({ email: email }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json())
                .then(data => {
                    resolve(data);
                })
        })
    }

    static authenticateUser(email, password) {
        return new Promise((resolve, reject) => {
            fetch('http://192.168.43.72:3333/api/login', {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json())
                .then(data => {
                    resolve(data);
                })
        })
    }

    static getUserTokenFromLocalStorage() {
        return AsyncStorage.getItem('token');
    }

    static setUserTokenToLocalStorage(token) {
        return AsyncStorage.setItem('token', token);
    }

    static setUserIdToLocalStorage(userId) {
        return AsyncStorage.setItem('userId', userId);
    }

    static getUserIdFromLocalStorage() {
        return AsyncStorage.getItem('userId');
    }

    static updateUserDetail(usrObj) {
        return new Promise((resolve, reject) => {
            fetch('http://192.168.43.72:3333/api/update-user', {
                method: 'POST',
                body: JSON.stringify(usrObj),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json())
                .then(data => {
                    resolve(data);
                })
        })
    }
}