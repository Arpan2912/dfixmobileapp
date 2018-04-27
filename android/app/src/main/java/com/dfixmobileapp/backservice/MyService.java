package com.dfixmobileapp.backservice;

import android.app.IntentService;
import android.app.Service;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.dfixmobileapp.restpackage.APIClient;
import com.dfixmobileapp.restpackage.RequestDemo;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import com.facebook.react.modules.storage.ReactDatabaseSupplier;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;

public class MyService extends Service implements LocationListener{

    ReactDatabaseSupplier reactDatabaseSupplier;
    // flag for GPS status
    boolean isGPSEnabled = false;

    // flag for network status
    boolean isNetworkEnabled = false;

    // flag for GPS status
    boolean canGetLocation = false;

    Location location; // location
    double latitude; // latitude
    double longitude; // longitude
    int timeout = 1000 * 60;
    // The minimum distance to change Updates in meters
    private static final long MIN_DISTANCE_CHANGE_FOR_UPDATES = 100; // 10 meters

    // The minimum time between updates in milliseconds
    private static final long MIN_TIME_BW_UPDATES = 1000 * 15; // 1 minute

    // Declaring a Location Manager
    protected LocationManager locationManager;
    private Handler handler;
    private RequestDemo reqDemo;
    private @javax.annotation.Nullable

    SQLiteDatabase mDb;


    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    @Override
    public void onCreate() {
        super.onCreate();
        handler = new Handler();
        reactDatabaseSupplier = ReactDatabaseSupplier.getInstance(this);
        mDb = reactDatabaseSupplier.get();
        reqDemo = APIClient.getClient().create(RequestDemo.class);
        getAllDataFromLocalStorage();

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        int count = 100; //Declare as inatance variable
        getLocation();
        MyService m = new MyService();
        Timer timer = new Timer();
        //timer.schedule(new TimerTask() {


//             @Override
//             public void run() {
//                 // getLocation();
//                 handler.post(new Runnable() {
//                     @Override
//                     public void run() {
// //                        setAndStoreLocationObj();
//                     }
//                 });
//                handler.post(new Runnable() {
//                    @Override
//                    public void run() {
//                        JsonObject jsonObject = new JsonObject();
//
////                        jsonObject.addProperty("user_id",name);
//
//                        JsonArray jsonArray = new JsonArray();
//
//
//                        JsonObject jsonObjectLocation = new JsonObject();
//                        jsonObjectLocation.addProperty("lat",latitude);
//                        jsonObjectLocation.addProperty("long",longitude);
//                        jsonArray.add(jsonObjectLocation);
//                        jsonObject.add("location" , jsonArray);
//
//                        Log.i("+++","++"+jsonObject.toString());
////                        Call<ResponseBody> call = reqDemo.setLocation(jsonObject)
//                         Call<ResponseBody> call = reqDemo.startServer();
//
//
//                        call.enqueue(new Callback<ResponseBody>() {
//                            @Override
//                            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
//                                if(response.isSuccessful()){
//                                    try {
//                                        String resp = response.body().string();
//                                        Log.i("++++++++++","+++ resp +++"+resp);
//                                        JSONObject jsonObjectResp = new JSONObject(resp);
//
//                                    } catch (IOException e) {
//                                        e.printStackTrace();
//                                    } catch (JSONException e) {
//                                        e.printStackTrace();
//                                    }
//                                }
//                            }
//
//                            @Override
//                            public void onFailure(Call<ResponseBody> call, Throwable t) {
//
//                            }
//                        });
//
//
//                        Toast.makeText(MyService.this, "+"+getLatitude(), Toast.LENGTH_SHORT).show();
//                    }
//                });

            // }
        // }, 0, timeout);

        return super.onStartCommand(intent, flags, startId);
    }

    public Location getLocation() {
        try {
            locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);

            // getting GPS status
            isGPSEnabled = locationManager
                    .isProviderEnabled(LocationManager.GPS_PROVIDER);

            // getting network status
            isNetworkEnabled = locationManager
                    .isProviderEnabled(LocationManager.NETWORK_PROVIDER);

            if (!isGPSEnabled && !isNetworkEnabled) {
                // no network provider is enabled
            } else {
                this.canGetLocation = true;
                // First get location from Network Provider
                if (isNetworkEnabled) {
                    locationManager.requestLocationUpdates(
                            LocationManager.NETWORK_PROVIDER,
                            MIN_TIME_BW_UPDATES,
                            MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
                    Log.d("Network", "Network");
                    if (locationManager != null) {
                        location = locationManager
                                .getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                        if (location != null) {
                            latitude = location.getLatitude();
                            longitude = location.getLongitude();
                        }
                    }
                }
                // if GPS Enabled get lat/long using GPS Services
                if (isGPSEnabled) {
                    if (location == null) {
                        locationManager.requestLocationUpdates(
                                LocationManager.GPS_PROVIDER,
                                MIN_TIME_BW_UPDATES,
                                MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
                        Log.d("GPS Enabled", "GPS Enabled");
                        if (locationManager != null) {
                            location = locationManager
                                    .getLastKnownLocation(LocationManager.GPS_PROVIDER);

                            if (location != null) {
                                latitude = location.getLatitude();
                                longitude = location.getLongitude();
                            }
                        }
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return location;
    }

    public double getLatitude(){
        if(location != null){
            latitude = location.getLatitude();

            Log.i("+++++","++++"+getLongitude());
        }else{
            Log.i("------","----");
        }

        // return latitude
        return latitude;
    }

    /**
     * Function to get longitude
     * */
    public double getLongitude(){
        if(location != null){
            longitude = location.getLongitude();
        }

        // return longitude
        return longitude;
    }

    public void getAllDataFromLocalStorage(){

        Cursor catalystLocalStorage = mDb.query("catalystLocalStorage", new String[]{"key", "value"}, null, null, null, null, null);
        if (catalystLocalStorage.moveToFirst()) {
            do {
                // JSONObject will ask for try catch
                try {
                    String key = new String(catalystLocalStorage.getString(catalystLocalStorage.getColumnIndex("key")));
                    String value = new String(catalystLocalStorage.getString(catalystLocalStorage.getColumnIndex("value")));
                    Log.i("+++++++++++++++++ key",key);
                    Log.i("+++++++++++++++++ value",value);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } while(catalystLocalStorage.moveToNext());
        }
    }

    public String getDataFromKey(String searchKey){
        String value =null;
        String KEY_COLUMN="key";
        Cursor cursor = mDb.query("catalystLocalStorage",
                new String[]{"key", "value"},
                KEY_COLUMN + "=?",
                new String[]{searchKey}, null, null, null);
        if (cursor.moveToFirst()) {
            do {
                // JSONObject will ask for try catch
                try {
                    String key = new String(cursor.getString(cursor.getColumnIndex("key")));
                    value = new String(cursor.getString(cursor.getColumnIndex("value")));                    Log.i("++++ key +++",key);                    Log.i("++++ value +++",value);                } catch (Exception e) {                    e.printStackTrace();
                }
            } while(cursor.moveToNext());
        }
        return value;
    }

    public void insertValueToDb(String KeyColumn,String ValueColumn,SQLiteDatabase mDb){
        String KEY_COLUMN ="key";
        String VALUE_COLUMN ="value";
        ContentValues contentValues = new ContentValues();
        contentValues.put(KEY_COLUMN, KeyColumn);
        contentValues.put(VALUE_COLUMN, ValueColumn);

        long inserted = mDb.insertWithOnConflict("catalystLocalStorage",null,contentValues,SQLiteDatabase.CONFLICT_REPLACE);
        Log.i("inserted",inserted+"");
    }

    public void setAndStoreLocationObj(Location l){
//        Location l = this.getLocation();
        if(l != null){
            Log.i("location obj", String.valueOf(l));
            Double latitude = l.getLatitude();
            Double longitude =l.getLongitude();

            Float speed = l.getSpeed();
            if(speed > 5){

            }
            System.out.print("Speed "+speed.toString());
            String lat = latitude.toString();
            String lon =longitude.toString();
            String id = null;

            String userId = this.getDataFromKey("userId");
            String token = "Bearer "+this.getDataFromKey("token");
            String location = this.getDataFromKey("location");
            String userName = this.getDataFromKey("userName");
            Log.i("userId",userId+"   token "+token+" location "+location+" userName "+userName);
            try{
                JsonObject locationObj1 = new JsonObject();
                locationObj1.addProperty("latitude",lat);
                locationObj1.addProperty("longitude",lon);

                Log.i("location obj", location+"gson"+locationObj1.toString());
                JsonObject  localLocationObj;

                JsonArray localLocationArray =new JsonArray();
                if(location != null){
                    JsonParser jp =new JsonParser();
                    localLocationObj=(JsonObject)jp.parse(location);
                    Log.i("location obj gson",localLocationObj.toString());
                    localLocationObj.has("location");
                    Log.i("location", String.valueOf(localLocationObj));
                    localLocationArray =localLocationObj.getAsJsonArray("location");
                    Log.i("location array gson",localLocationArray.toString());
                    JsonObject lobj = null;
                    if(localLocationArray.size()>0) {
                         lobj = (JsonObject) localLocationArray.get(localLocationArray.size() - 1);
                    }
                    System.out.print("equal"+lobj.equals(locationObj1));
                    if(lobj.equals(locationObj1)){
                        System.out.print("inside if");
                        return;
                    }

                    if(localLocationObj.has("id")){
                        id = localLocationObj.get("id").getAsString();
                        Log.i("id",id);
                    }
                    Log.i("++++msg+++", String.valueOf(localLocationObj)+"id"+id);
                } else {
                localLocationObj = new JsonObject();
                }
                Log.i("location before", String.valueOf(localLocationArray));

                localLocationArray.add(locationObj1);
                final JsonArray locationFinalArray = localLocationArray;

                Log.i("location after", String.valueOf(localLocationArray));


                Log.i("location id",""+id);
                JsonObject prepareObj1 = new JsonObject();
                prepareObj1.addProperty("id",id);
                prepareObj1.addProperty("userId",userId);
                prepareObj1.add("location",localLocationArray);
                prepareObj1.add("currentLocation",locationObj1);
                prepareObj1.addProperty("userName",userName);

                Log.i("prepared obj",prepareObj1.toString());

//            jsonObject2.add("location",jsonArray);
                Call<ResponseBody> call = reqDemo.addOrUpdateLocation(token,prepareObj1);
                call.enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        if(response.isSuccessful()){
                                try {
                                    String resp = response.body().string();
                                    Log.i("++++++++++","+++ resp +++"+resp);
                                    JSONObject jsonObjectResp = new JSONObject(resp);
                                    if(jsonObjectResp.has("success")){
                                        if(jsonObjectResp.getBoolean("success")==true){
                                            System.out.print("jsonObjectResp.getString(\"data\")!=null "+jsonObjectResp.getString("data")!=null);
                                            if (jsonObjectResp.has("data") && jsonObjectResp.getString("data")!=null) {
                                                    System.out.print("jsonObjectResp.getString(\"data\")!=null "+jsonObjectResp.getString("data")!=null);
                                                    JSONObject res =  jsonObjectResp.getJSONObject("data");
                                                    if (res.has("_id")) {
                                                        String respId = res.getString("_id");
                                                        JsonObject objToStoreLocationToLocalStorage = new JsonObject();
                                                        objToStoreLocationToLocalStorage.addProperty("id",respId);
                                                        objToStoreLocationToLocalStorage.add("location",locationFinalArray);
                                                        Log.i("local obj", String.valueOf(objToStoreLocationToLocalStorage));
                                                        new MyService().insertValueToDb("location",objToStoreLocationToLocalStorage.toString(),mDb);
                                                    }
                                                }
                                        } else {

                                        }
                                    }
                                } catch (IOException e) {
                                    e.printStackTrace();
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                        }
                    }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Log.i("request error",t.toString());
                }
            });
        } catch(Exception e){
            e.printStackTrace();
        }
        } else {
            System.out.println("location not working");
            // Toast.makeText(t, "Location Not Found", Toast.LENGTH_SHORT).show();
            Log.i("location","location not found");
        }
    }

    @Override
    public void onLocationChanged(Location location) {
        setAndStoreLocationObj(location);
//        Float speed = location.getSpeed();
//        if(speed >= 5){
////            timeout = 1000 * 15;
//        } else if(speed <= 5){
////            timeout = 1000*60*5;
//        }
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {

    }

    @Override
    public void onProviderEnabled(String s) {

    }

    @Override
    public void onProviderDisabled(String s) {

    }
}
