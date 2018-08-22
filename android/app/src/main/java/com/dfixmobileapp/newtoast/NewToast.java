package com.dfixmobileapp.newtoast;

import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.dfixmobileapp.backservice.MyService;

import java.util.Map;
import java.util.HashMap;

public class NewToast extends ReactContextBaseJavaModule {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public NewToast(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "NewToast";
  }

  @ReactMethod
  public void show(String message, int duration) {
  //  Toast.makeText(getReactApplicationContext(), "Background service started", Toast.LENGTH_SHORT).show();
   
    Intent i = new Intent(getReactApplicationContext(), MyService.class);
//    i.putExtra("foo", "bar");
    getReactApplicationContext().startService(i);
//    getReactApplicationContext().startService(new Intent(getReactApplicationContext(), MyService.class));
  }

    @ReactMethod
    public void stopService() {
        // Toast.makeText(getReactApplicationContext(), "Background service stoped", Toast.LENGTH_SHORT).show();

        Intent i = new Intent(getReactApplicationContext(), MyService.class);
//    i.putExtra("foo", "bar");
        getReactApplicationContext().stopService(i);
//    getReactApplicationContext().startService(new Intent(getReactApplicationContext(), MyService.class));
    }

}