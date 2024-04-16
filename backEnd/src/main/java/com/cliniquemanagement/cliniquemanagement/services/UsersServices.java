package com.cliniquemanagement.cliniquemanagement.services;


import com.cliniquemanagement.cliniquemanagement.models.LoginUser;
import com.cliniquemanagement.cliniquemanagement.models.Patient;
import com.cliniquemanagement.cliniquemanagement.models.Users;
import com.cliniquemanagement.cliniquemanagement.repository.UsersRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UsersServices {

    @Autowired
    private UsersRepository usersRepository;

    private final Map<String, Long> tokenToUserIdMap = new ConcurrentHashMap<>();
    public Users register(Users newUser, BindingResult result, HttpServletResponse response ){
        // Reject if email is taken (present in the DB)
        Optional<Users> potentialUser = usersRepository.findByUserName(newUser.getUserName());
        if(potentialUser.isPresent()) {
            result.rejectValue("userName", "registerError", "userName is Taken !");
        }
        if (result.hasErrors()) {
            return null;
        }else {
            // Hash and set password; save user to DB
            String hashedPw = BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt());
            if (hashedPw.length() > 128) {
                hashedPw = hashedPw.substring(0, 128); // Truncate if necessary
            }
            newUser.setPassword(hashedPw);
//            // save the user to the DB
//            // Map the token to the user's ID
//            // Send the token as a cookie
//            Cookie cookie = new Cookie("user_token", token);
//            cookie.setHttpOnly(true); // Make the cookie accessible only through HTTP
//            response.addCookie(cookie);
//            System.out.println(token);
//            Cookie cookie = new Cookie("token", token);
//            cookie.setHttpOnly(true);
//            cookie.setPath("/");
//            response.addCookie(cookie);
            return usersRepository.save(newUser);
        }
    }

    public Users login(LoginUser newLoginObject, BindingResult result, HttpServletResponse response) {
        Optional<Users> potentialUser = usersRepository.findByUserName(newLoginObject.getUserName());
        if (!potentialUser.isPresent()) {
            result.rejectValue("userName", "loginErrors", "Username not found");
            return null;
        }

        Users user = potentialUser.get();
        if (!BCrypt.checkpw(newLoginObject.getPassword(), user.getPassword())) {
            result.rejectValue("password", "loginErrors", "Invalid password");
            return null;
        }

        String token = UUID.randomUUID().toString();
        tokenToUserIdMap.put(token, user.getId());

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        return user;
    }


    public List<Users> findAllUsers(){
        return usersRepository.findAll();
    }

    public Users oneUser(Long id) {
        Optional<Users> oneUser = usersRepository.findById(id);
        return oneUser.orElse(null);
    }
}
