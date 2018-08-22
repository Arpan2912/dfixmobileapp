import { AppRegistry, ToastAndroid } from 'react-native';
import App from './App';
import { routes } from './src/routes/index';
import UserProvider from './src/provider/user-provider';
import LocationProvider from './src/provider/location-provider';

const Rec = async (data) => {
    setInterval(() => {
        let location = [];
        let id = null;
        console.log('It works!');
        // ToastAndroid.show('It works', 500);
        // UserProvider.resetLocationFromLocalStorage();
        UserProvider.getLocationFromLocalStorage()
            .then(data => {
                // let data = data;
                data = JSON.parse(data);
                if (data) {
                    // ToastAndroid.show(JSON.stringify(data),2000);
                    id = data.id;
                    location = data.location;
                }
                console.log("navigator",navigator);
                // ToastAndroid.show(JSON.stringify(Position),5000);       
                navigator.geolocation.getCurrentPosition(position=>{
                    // ToastAndroid.show(JSON.stringify(position),5000);
                    let coordinates = position.coords;
                        let longitude = coordinates.longitude;
                        let latitude = coordinates.latitude;
                        let loc = {
                            latitude: latitude,
                            longitude: longitude
                        }
                        location.push(loc);
                       
                        let locObj = {
                            id: id ? id : null,
                            location: location,
                            currentLocation: loc
                        }
                        LocationProvider.addOrUpdateLocation(locObj).then(data => {

                            let localObj = {
                                id: data.data._id,
                                location: location
                            }
                            UserProvider.setLocationToLocalStorage(JSON.stringify(localObj));
                        })
                },err=>{

                })
            }).catch(e=>{
                // ToastAndroid.show(e.toString(),5000);
            })
    }, 15000);
    // ToastAndroid.show('It works', 5000);
    console.log('It works!');
}

AppRegistry.registerHeadlessTask('Rec', () => Rec);

AppRegistry.registerComponent('dfixmobileapp', () => routes);

// AppRegistry.startHeadlessTask(1, 'Rec', null);
