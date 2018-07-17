package g.rainagan.take_outandroid;

import android.app.DownloadManager;
import android.content.Context;
import android.net.Network;
import android.support.constraint.solver.Cache;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;

import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;

import java.util.Iterator;
import java.util.Map;


/**
 * Created by Raina on 2017-12-10.
 */

public class HandleRequests {
    public static void testRequest(Context c) throws Exception {
        // Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(c);

        // url that used to be test json parser
        String url = "https://jsonplaceholder.typicode.com/posts/1";

        // Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        parse(response);

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("That didn't work! " + error.getMessage());
            }
        });

        // Add the request to the RequestQueue.
        queue.add(stringRequest);
    }

    static public void parse(String response) {
        // parse json
        try {
            // parse a response string
            Object obj = new JSONParser().parse(response);

            JSONObject jo = (org.json.simple.JSONObject) obj;

            // note: type to be get should match type in json file
            // get value of "userId"
            long userId = (Long) jo.get("userId");

            long id = (Long) jo.get("id");

            String title = (String) jo.get("title");

            String body = (String) jo.get("body");
            // check the values we get
            System.out.println(userId + "\n" + id + "\n" + title + "\n" + body);

//                            Map title = ((Map) jo.get("title"));
//                            Iterator<Map.Entry> itr1 = title.entrySet().iterator();
//                            while (itr1.hasNext()) {
//                                Map.Entry pair = itr1.next();
//                                System.out.println(pair.getKey());
//                            }

        } catch (Exception je) {
            System.out.println("json parse exception" + je.getMessage());
        }
    }
}
