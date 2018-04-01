import { AsyncStorage } from 'react-native';
export default class MeetingProvider {
    static token;
    constructor() {

    }

    static startMeeting(startMeetingOj) {
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
                    fetch('http://192.168.43.72:3333/api/start-visit', {
                        method: 'POST',
                        body: JSON.stringify({ location: startMeetingOj.location, base64: startMeetingOj.base64, userId: userId, orgName: startMeetingOj.orgName,userName:userName }),
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

    static stopVisit(obj) {
        console.log("obj in Stop visit pro", JSON.stringify(obj))
        let token = null;
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                .then(data => {
                    token = data;

                    fetch('http://192.168.43.72:3333/api/stop-visit', {
                        method: 'POST',
                        body: JSON.stringify(obj),
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

    static getTodayVisits(obj) {
        // console.log("obj in Stop visit pro", JSON.stringify(obj))
        let token = null;
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                .then(data => {
                    token = data;

                    fetch('http://192.168.43.72:3333/api/get-today-visits', {
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

    static updateOrder(obj) {
        // console.log("obj in Stop visit pro", JSON.stringify(obj))
        let token = null;
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                .then(data => {
                    token = data;

                    fetch('http://192.168.43.72:3333/api/update-order', {
                        method: 'POST',
                        body: JSON.stringify(obj),
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

    static addOrder(obj) {
        // console.log("obj in Stop visit pro", JSON.stringify(obj))
        let token = null;
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                .then(data => {
                    token = data;

                    fetch('http://192.168.43.72:3333/api/add-order', {
                        method: 'POST',
                        body: JSON.stringify(obj),
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

    static deleteOrder(obj) {
        // console.log("obj in Stop visit pro", JSON.stringify(obj))
        let token = null;
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                .then(data => {
                    token = data;

                    fetch('http://192.168.43.72:3333/api/delete-order', {
                        method: 'POST',
                        body: JSON.stringify(obj),
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

    static getTodayLastRiunningVisit(userId){
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('token')
                // AsyncStorage.getItem("token")
                .then((data => {
                    // let userId = userId;
                    let token = data;

                    fetch(`http://192.168.43.72:3333/api/get-today-last-running-meeting/${userId}`, {
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