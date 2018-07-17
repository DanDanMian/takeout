package g.rainagan.take_outandroid;

import android.content.Context;
import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import org.json.simple.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Raina on 2017-12-30.
 */

public class LoginRequest {
    static public void loginRequest(Context c, String usrname, String passwrd) throws Exception {
        // username and password to be sent
        final String username = usrname;
        final String password = passwrd;

        // Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(c);

        // login server url
        String url = "https://take-out-server.herokuapp.com/user/login";

        // a json object to send to server
        JSONObject jsonBody = new JSONObject();
        jsonBody.put("username", username);
        jsonBody.put("password", password);

        final String requestBody = jsonBody.toString();

        try {
            // login request
            StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                    // if username and password are correct, receive response
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            // response
                            Log.d("Response", response);
                        }
                    },
                    // if login error occurs, receive error
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.d("Error.Response", error.toString());
                        }
                    }
            ) {
                // specify body content type
                @Override
                public String getBodyContentType() {
                    return "application/json; charset=utf-8";
                }

                // get byte array of requestBody
                @Override
                public byte[] getBody() throws AuthFailureError {
                    try {
                        return requestBody == null ? null : requestBody.getBytes("utf-8");
                    } catch (UnsupportedEncodingException uee) {
                        VolleyLog.wtf("Unsupported Encoding while trying to get the bytes of %s using %s", requestBody, "utf-8");
                        return null;
                    }
                }

                // get response code
                @Override
                protected Response<String> parseNetworkResponse(NetworkResponse response) {
                    String responseString = "";
                    if (response != null) {
                        responseString = String.valueOf(response.statusCode);
                        // can get more details such as response.headers
                    }
                    return Response.success(responseString, HttpHeaderParser.parseCacheHeaders(response));
                }
            };

            // Add the request to the RequestQueue.
            queue.add(stringRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

