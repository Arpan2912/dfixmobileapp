import { AsyncStorage } from 'react-native';
import constants from '../config/constant';
let API_URL = constants.API_URL;


export default class UserProvider {
    static getUserDetailsByEmail(email) {
        return new Promise((resolve, reject) => {
            fetch(`${API_URL}api/get-user-by-email`, {
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

    static getUserDetailsByPhone(phone) {
        let responseStatus;
        return new Promise((resolve, reject) => {
            fetch(`${API_URL}api/get-user-by-phone`, {
                method: 'POST',
                body: JSON.stringify({ phone: phone }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((data) => {
                responseStatus = data.status;
                return data.json();
            }).then(data => {
                if (responseStatus > 400) {
                    reject(data);
                } else {
                    resolve(data);
                }
            }).catch(e => {
                console.log("e", e);
                reject(e);
            })
        })
    }

    static authenticateUser(phone, password) {
        return new Promise((resolve, reject) => {
            fetch(`${API_URL}api/login`, {
                method: 'POST',
                body: JSON.stringify({ phone: phone, password: password }),
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

    static updateUserDetail(usrObj) {
        return new Promise((resolve, reject) => {
            fetch(`${API_URL}api/update-user`, {
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

    static setUserNameToLocalStorage(userName) {
        return AsyncStorage.setItem('userName', userName);
    }

    static getUserNameFromLocalStorage() {
        return AsyncStorage.getItem('userName');
    }

    static setStartDayStatus(status) {
        console.log(status);
        return AsyncStorage.setItem('startDay', status);
    }

    static getStartDayStatus() {
        return AsyncStorage.getItem('startDay');
    }

    static getAll() {
        return AsyncStorage.getAllKeys();
    }

    static removeAll() {
        return AsyncStorage.clear();
    }

    static setVisitStatus(status) {
        return AsyncStorage.setItem('visitStatus', status);
    }

    static getVisitStatus(status) {
        console.log(status);
        return AsyncStorage.getItem('visitStatus');
    }

    static resetVisitStatus(status) {
        return AsyncStorage.setItem('visitStatus', JSON.stringify(null));
    }

    static setLocationToLocalStorage(status) {
        return AsyncStorage.setItem('location', status);
    }

    static getLocationFromLocalStorage() {
        return AsyncStorage.getItem('location');
    }

    static resetLocationFromLocalStorage() {
        return AsyncStorage.removeItem('location');
    }

    static setTodayDateToLocalStorage(date) {
        return AsyncStorage.setItem('date', date);
    }

    static getTodayDateFromLocalStorage(date) {
        return AsyncStorage.getItem('date');
    }

}