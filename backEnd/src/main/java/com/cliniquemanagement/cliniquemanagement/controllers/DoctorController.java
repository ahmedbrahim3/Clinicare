package com.cliniquemanagement.cliniquemanagement.controllers;


import com.cliniquemanagement.cliniquemanagement.models.DoctorModel;
import com.cliniquemanagement.cliniquemanagement.models.Patient;
import com.cliniquemanagement.cliniquemanagement.repository.DoctortRepository;
import com.cliniquemanagement.cliniquemanagement.services.DoctorServices;
import com.cliniquemanagement.cliniquemanagement.services.PatientServices;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class DoctorController {

    @Autowired
    private DoctorServices doctorServices;

    @Autowired
    private DoctortRepository doctortRepository;

    @Autowired
    private PatientServices patientServices;

    @GetMapping("/allDoctors")
    public List<DoctorModel> showAll(){
        List<DoctorModel> allDoctor = doctorServices.findAllDoctor();
        return allDoctor;
    }

    @PostMapping("/doctor/add")
    public ResponseEntity<String> createDoctor(@Valid @RequestBody DoctorModel doctorModel
            , BindingResult result
            , Model model , HttpSession session , HttpServletResponse response){
        if(result.hasErrors()){
            return ResponseEntity.badRequest().body("An Error Encountred : " + result.toString());
        }
        DoctorModel doctor  = doctorServices.createDoctor(doctorModel);
        doctor.setAvailable(true);
        doctorServices.updateDoctor(doctor);
        return ResponseEntity.ok().body("The Creation Of Doctor Success");
    }

    @PutMapping("/doctor/edit/{id}")
    public ResponseEntity<Void> updateDoctor(@Valid @RequestBody Patient patient
            , HttpServletResponse response ,BindingResult result
            , @PathVariable("id") Long id){

        if(result.hasErrors()){
            return ResponseEntity.badRequest().build();
        }
        DoctorModel oneDoctor = doctorServices.showOne(id);
        Patient currentPatient = patientServices.showOnePatient(patient.getId());
        currentPatient.setDoctor(oneDoctor);
        patientServices.editOnePatient(currentPatient);
        System.out.println(doctorServices.showOne(id).getPatients());
            return  ResponseEntity.ok().build();
    }

    @GetMapping("/oneDoctor/{id}")
    public DoctorModel oneDoctor(@PathVariable("id")Long id){
        return doctorServices.showOne(id);
    }

}
