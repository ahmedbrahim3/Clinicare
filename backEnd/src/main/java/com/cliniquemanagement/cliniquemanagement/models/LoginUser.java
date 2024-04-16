package com.cliniquemanagement.cliniquemanagement.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class LoginUser {

    @NotEmpty(message="userName is required!")
    private String userName;

    @NotEmpty(message="Password is required!")
    @Size(min = 8 , max=120, message="Password must be between 8 and 128 characters")
    private String password;

    public LoginUser(){

    }
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
