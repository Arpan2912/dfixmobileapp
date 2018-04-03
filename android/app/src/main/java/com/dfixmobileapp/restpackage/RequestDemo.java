package com.dfixmobileapp.restpackage;

import com.google.gson.JsonObject;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Query;

/**
 * Created by user on 2/4/18.
 */

public interface RequestDemo {
    @POST("/new")
    Call<ResponseBody> setLocation(@Body JsonObject jsonObject);

    @GET("/")
    Call<ResponseBody> startServer();
}
