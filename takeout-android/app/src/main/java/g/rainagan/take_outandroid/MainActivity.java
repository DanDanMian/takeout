package g.rainagan.take_outandroid;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import static g.rainagan.take_outandroid.LoginRequest.loginRequest;

//import static g.rainagan.take_outandroid.HandleRequests.testRequest;

public class MainActivity extends AppCompatActivity {
    private Button login;
    private Button signup;
    EditText username, password;
    private String un, pw;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        login = (Button) findViewById(R.id.login);
        signup = (Button) findViewById(R.id.signup);

        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                username = (EditText) findViewById(R.id.username);
                password = (EditText) findViewById(R.id.password);
                un = username.getText().toString();
                pw = password.getText().toString();
                try {
                    loginRequest(MainActivity.this, un, pw);
                } catch (Exception e) {
                    System.err.println("Login error");
                }
            }

        });

        // add content for debug purpose
//        try {
//            testRequest(this);
//        } catch (Exception e){
//            System.err.println("handle request failed");
//        }
    }
}
