import { AsyncStorage } from 'react-native';
export default class StartDayProvider {
    static token;
    constructor() {

    }

    static startDay(km, base64, userId) {
        return new Promise((resolve, reject) => {
            Promise.all([
                AsyncStorage.getItem('userId'),
                AsyncStorage.getItem('token'),
                AsyncStorage.getItem('userName')
            ])
                // AsyncStorage.getItem("token")
                .then((data => {
                    let userId = data[0];
                    let token = data[1];
                    let userName = data[2];
                    fetch('http://192.168.43.72:3333/api/start-day', {
                        method: 'POST',
                        body: JSON.stringify({ km: km, base64: base64, userId: userId,userName:userName }),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        }
                    }).then((response) => response.json())
                        .then(data => {
                            resolve(data);
                        })

                }))
        })
    }

    static stopDay(km, base64, userId, id) {
        return new Promise((resolve, reject) => {
            Promise.all([AsyncStorage.getItem('userId'), AsyncStorage.getItem('token')])
                // AsyncStorage.getItem("token")
                .then((data => {
                    let userId = data[0];
                    let token = data[1];

                    fetch('http://192.168.43.72:3333/api/stop-day', {
                        method: 'POST',
                        body: JSON.stringify({ id: id, km: km, base64: base64, userId: userId }),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        }
                    }).then((response) => response.json())
                        .then(data => {
                            resolve(data);
                        })

                })).catch(e => {

                })
        })
    }

    static getStartDayDetails(userId) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                // AsyncStorage.getItem("token")
                .then((data => {
                    // let userId = userId;
                    let token = data;

                    fetch(`http://192.168.43.72:3333/api/get-start-day-details/${userId}`, {
                        method: 'GET',
                        // body: JSON.stringify({ userId: userId }),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        }
                    }).then((response) => response.json())
                        .then(data => {
                            resolve(data);
                        })

                })).catch(e => {

                })
        })
    }
}