package com.cliniquemanagement.cliniquemanagement.controllers;


import com.cliniquemanagement.cliniquemanagement.models.LoginUser;
import com.cliniquemanagement.cliniquemanagement.models.Users;
import com.cliniquemanagement.cliniquemanagement.services.UsersServices;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.eclipse.tags.shaded.org.apache.xpath.operations.Mod;
import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwe.ContentEncryptionAlgorithmIdentifiers;
import org.jose4j.jwe.JsonWebEncryption;
import org.jose4j.jwe.KeyManagementAlgorithmIdentifiers;
import org.jose4j.keys.AesKey;
import org.jose4j.lang.ByteUtil;
import org.jose4j.lang.JoseException;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.net.http.HttpResponse;
import java.security.Key;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UsersController {

    @Autowired
    private UsersServices usersServices;


    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/allUsers")
    public List<Users> index(Model model){
        model.addAttribute("newUser" , new Users());
        model.addAttribute("newLogin" ,new LoginUser());
        List<Users> allUsers = usersServices.findAllUsers();
        return  allUsers;
    }

//    @PostMapping("/register")
//    public ResponseEntity<Void> register(@Valid @RequestBody Users newUser,
//                           BindingResult result, Model model, HttpSession session , HttpServletResponse response)  {
//
//        // TO-DO Later -- call a register method in the service
//        // to do some extra validations and create a new user!
//        System.out.println(newUser.getId() + "User Id ");
//
//        Users user = usersServices.register(newUser, result , response );
//        if(result.hasErrors()) {
//            // Be sure to send in the empty LoginUser before
//            // re-rendering the page.
//            model.addAttribute("newLogin", new LoginUser());
//            return ResponseEntity.badRequest().build();
//        }
//
//        // Store token in session, cookie, or response body as needed
//        System.out.println(user.getId() + "The User ID Ffrom The Services");
//        String token = Jwts.builder()
//                .setSubject(user.getId().toString())
//                // Add any additional claims if needed
//                // .claim("key", value)
//                .signWith(Keys.secretKeyFor(SignatureAlgorithm.HS256))
//                .compact();
//        session.setAttribute("token", token);
//        Cookie cookie = new Cookie("token", token);
//        cookie.setHttpOnly(true);
//        cookie.setPath("/");
//        response.addCookie(cookie);
//        String user_id = BCrypt.hashpw(newUser.getId().toString(), BCrypt.gensalt());
//        session.setAttribute("user_id", user_id);
//        //        return "You Have Registered";
//        // Return token in response
//        return ResponseEntity.ok().build();
//
//
//
//
//
//
//
//
//    }


    @PostMapping("/login")
    public Map<String , String> login (@Valid @RequestBody LoginUser newLogin , BindingResult result
            , Model model
            , HttpSession session
            , HttpServletResponse response){
        String resultType = "";
        Users user = usersServices.login(newLogin , result , response);
        Map<String , String> userDetail = new HashMap<String , String>();
        if(result.hasErrors()){
            model.addAttribute("newUser" , new LoginUser());
            userDetail.put("Error :", result.toString());
            return userDetail;
        }
        switch (user.getType()){
            case "Reception", "Billing", "Emergency","Radiology", "Endoscopy","Admin":
                session.setAttribute("user_id" , user.getId());
                userDetail.put("user_type" , user.getType());
                userDetail.put("user" , user.getId().toString());
                break;
        }
        String token = Jwts.builder()
                .setSubject(user.getId().toString())
                .signWith(Keys.secretKeyFor(SignatureAlgorithm.HS256))
                .compact();
        // Store token in session, cookie, or response body as needed
        session.setAttribute("token", token);
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        userDetail.put("token" , token);
        System.out.println(cookie + "Cookies");
        System.out.println(userDetail + "qd qsd qsdqs dqsd ");
        String user_id = BCrypt.hashpw(user.getId().toString(), BCrypt.gensalt());
        return userDetail;
    }

    @PostMapping("/creationUser")
    public ResponseEntity<String> createPatient(@Valid @RequestBody Users users, BindingResult result , HttpServletResponse response){
        if(result.hasErrors()){
            StringBuilder errorMessage = new StringBuilder("Creation Failed: ");
            result.getAllErrors().forEach(error -> errorMessage.append(error.getDefaultMessage()).append("; "));
            return ResponseEntity.badRequest().body(errorMessage.toString());
        }
        usersServices.register(users , result ,response);
        return ResponseEntity.ok().body("Creation Of User With Success");
    }

    @GetMapping("/showOneUser/{id}")
    public Users showOnePatient(@PathVariable("id") Long id){
        return usersServices.oneUser(id);
    }






    @GetMapping("/logout")
    public String logout(HttpSession session , HttpServletResponse response , HttpServletRequest request){
        request.getSession().invalidate();
        return "there is no session anymore" ;
    }

}
