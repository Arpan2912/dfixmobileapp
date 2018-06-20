import { AsyncStorage } from 'react-native';
import constants from '../config/constant';
let API_URL = constants.API_URL;

export default class ExpenseProvider {
    static token;
    constructor() {

    }

    static getTodayExpense(obj) {
        // console.log("obj in Stop visit pro", JSON.stringify(obj))
        let token = null;
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                .then(data => {
                    token = data;

                    fetch(`${API_URL}api/get-today-expense`, {
                        method: 'POST',
                        body: JSON.stringify({ userId: obj }),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        }
                    })
                        .then((response) => response.json())
                        .then(data => {
                            return resolve(data);
                        })
                        .catch(e => {
                            console.log("error", e);
                            reject(e);
                        })
                })
        })
    }

    static updateExpense(obj) {
        // console.log("obj in Stop visit pro", JSON.stringify(obj))
        let token = null;
        let responseStatus;
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                .then(data => {
                    token = data;

                    fetch(`${API_URL}api/update-expense`, {
                        method: 'POST',
                        body: JSON.stringify(obj),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
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
        })
    }

    static addExpense(obj) {
        // console.log("obj in Stop visit pro", JSON.stringify(obj))
        let token = null;
        let responseStatus;
        return new Promise((resolve, reject) => {
            Promise.all([
                AsyncStorage.getItem('token'),
                AsyncStorage.getItem('userName')
            ]).then(data => {
                token = data[0];
                let userName = data[1];
                obj.userName = userName;
                fetch(`${API_URL}api/add-expense`, {
                    method: 'POST',
                    body: JSON.stringify(obj),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token
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
        })
    }

    static deleteExpense(obj) {
        // console.log("obj in Stop visit pro", JSON.stringify(obj))
        let token = null;
        let responseStatus;
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                .then(data => {
                    token = data;
                    fetch(`${API_URL}api/delete-expense`, {
                        method: 'POST',
                        body: JSON.stringify(obj),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
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
        })
    }
}