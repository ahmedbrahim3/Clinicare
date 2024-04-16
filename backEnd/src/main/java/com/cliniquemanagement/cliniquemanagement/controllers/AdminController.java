package com.cliniquemanagement.cliniquemanagement.controllers;


import com.cliniquemanagement.cliniquemanagement.models.Medication;
import com.cliniquemanagement.cliniquemanagement.models.Patient;
import com.cliniquemanagement.cliniquemanagement.models.Users;
import com.cliniquemanagement.cliniquemanagement.services.MedicationServices;
import com.cliniquemanagement.cliniquemanagement.services.PatientServices;
import com.cliniquemanagement.cliniquemanagement.services.UsersServices;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AdminController {


    @Autowired
    private MedicationServices medicationServices;

    @Autowired
    private PatientServices patientServices;

     @Autowired
     private UsersServices usersServices;


    @PostMapping("/admin/creationUser")
    public ResponseEntity<String> createPatient(@Valid @RequestBody Users users, BindingResult result , HttpServletResponse response){
            if(result.hasErrors()){
                return ResponseEntity.badRequest().body("Creation Failed : " + result.toString());
            }
            usersServices.register(users , result ,response);
            return ResponseEntity.ok().body("Creation Of User With Success");
    }

    @GetMapping("/admin/showOneUser/{id}")
    public Users showOnePatient(@PathVariable("id") Long id){
        return usersServices.oneUser(id);
    }





}
