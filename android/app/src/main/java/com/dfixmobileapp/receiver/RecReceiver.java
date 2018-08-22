package com.dfixmobileapp.receiver;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import com.dfixmobileapp.service.RecService;
import com.facebook.react.HeadlessJsTaskService;
public final class RecReceiver extends BroadcastReceiver {
    public final void onReceive(Context context, Intent intent) {
        // Toast.makeText(context,"background",Toast.LENGTH_LONG).show();
        Intent recIntent = new Intent(context, RecService.class);
        context.startService(recIntent);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}