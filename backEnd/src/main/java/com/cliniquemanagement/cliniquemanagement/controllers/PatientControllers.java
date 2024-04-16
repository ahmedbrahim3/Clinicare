package com.cliniquemanagement.cliniquemanagement.controllers;


import com.cliniquemanagement.cliniquemanagement.models.*;
import com.cliniquemanagement.cliniquemanagement.services.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
public class PatientControllers {

    @Autowired
    private PatientServices patientServices;


    @Autowired
    private UsersServices usersServices;


    @Autowired
    private MedicationServices medicationServices;

    @Autowired
    private DosageService dosageService;

    @Autowired
    private DoctorServices doctorServices;

    @Autowired
    private ServServices servServices;


    @GetMapping("/reciption")
    public List<Map<String, Object>> showAllPatient() {
        List<Patient> allPatients = patientServices.showAll();
        List<Map<String, Object>> patientDataList = new ArrayList<>();

        for (Patient patient : allPatients) {
            Map<String, Object> patientMap = new HashMap<>();
            patientMap.put("patient", patient); // Add patient data

            // Add doctor ID if present
            DoctorModel doctor = patient.getDoctor();
            if (doctor != null && doctor.getId() != null) {
                patientMap.put("doctor_id", doctor.getId());
            }

            // Add services data if present
            List<Services> services = patient.getAllServices();
            if (!services.isEmpty()) {
                patientMap.put("services_data", services);
            }

            patientDataList.add(patientMap);
        }

        return patientDataList;
    }

    @GetMapping("/onePatient/{id}")
    public Map<String , Object> onePatient(@PathVariable("id")Long id){
        Patient onePatient = patientServices.showOnePatient(id);

        List<Dosage> oneDosage = dosageService.findall();
        List<Map<String , Object>> allDosageWhithSameId = new ArrayList<>();
        for(Dosage dosage : oneDosage){
            Map<String , Object> oneDosageWhithId = new HashMap<>();
            if(dosage != null && dosage.getPatient_med() == id){
                oneDosageWhithId.put("medicament_id",dosage.getCustom_medication());
                oneDosageWhithId.put("patient_id" , dosage.getPatient_med());
                oneDosageWhithId.put("usesDosage" , dosage.getUses());
                allDosageWhithSameId.add(oneDosageWhithId);
            }
        }
        Map<String , Object> patientData = new HashMap<>();
        patientData.put("patient_Dosage" , allDosageWhithSameId);
        if(onePatient != null){
            patientData.put("patient_data" , onePatient);
            patientData.put("patient_Medic" , onePatient);

        }
        List<Services> services = onePatient.getAllServices();
        if (!services.isEmpty()) {
            patientData.put("services_data", services);
        }
        return patientData;
    }




    @PutMapping("/reception/{medicId}/{patientId}/medic")
    public ResponseEntity<String> addMedic(@PathVariable("patientId") Long patientId, @PathVariable("medicId") Long medicationId) {
        System.out.println("The Medication Id : =>>>>>>>>>" + medicationId);
        System.out.println("The Patient Id : =>>>>>>>>>" + patientId);
        Patient patient = patientServices.showOnePatient(patientId);
        Medication medication = medicationServices.showOneMedication(medicationId);
//        System.out.println("The Patient Whith One : =>>>=<<=<=<=<<=<=<" + patient.getFirstName());
//        System.out.println("The Medication Object : =>=<=<=<=<<=<=" + medication.getName());
        if (patient == null || medication == null) {
            return ResponseEntity.badRequest().body("Patient or medication not found");
        }else{

            patient.getMedic().add(medication);
//            System.out.println(patient.getMedic().get(patient.getMedic().size()-1).getName());
            Patient newPatient = patientServices.editOnePatient(patient);
            System.out.println("The Patient After The Update : " + newPatient);
            medication.getPatientMedic().add(patient);
//            Medication newMedication = medicationServices.updateMedication(medication);
//            System.out.println("The Medication After The Update : " + newMedication);

            return ResponseEntity.ok().body("Medication added to patient successfully");
        }

    }

    @PostMapping(value = "/add/reciption",
            consumes = "application/json;charset=UTF-8")
    public ResponseEntity<String> newPatient(@Valid @RequestBody Patient patient , @RequestParam("doctor_id")Long id , HttpSession session) throws JsonProcessingException {
        patient.setDate(new Date());
        System.out.println(" This Patient Date After Modification :! "+patient.getDate());
//        System.out.println("The Doctor ID From The Model : " + patient.getDoctor().getId());
        DoctorModel oneMedication = doctorServices.showOne(id);
        if(oneMedication == null){
            return ResponseEntity.badRequest().body("The Doctor Id Not Found ");
        }
        patient.setDoctor(oneMedication);
        Patient newpatient = patientServices.createNewPatient(patient);
        return ResponseEntity.ok("PatientCreated Successfully : " +newpatient.getId());
    }

    protected long conv(Date element){
       return element.getTime();
    }


    @PostMapping("/add/reciptionRv")
    public ResponseEntity<String> newRDV(@Valid @RequestBody Patient patient , HttpSession session){
        if(patient.getDate().equals(null)){
            return ResponseEntity.badRequest().body("The Date Must Be provided");
        }

        if (conv(patient.getDate()) < conv(new Date())) {
            return ResponseEntity.badRequest().body("Patient date cannot be in the past");
        }
        List<Patient> allPatient = patientServices.showAll();
        for(Patient onePatient : allPatient){
            if(conv(onePatient.getDate()) == conv(patient.getDate())){
                return ResponseEntity.badRequest().body("Sry This Time Already Taken");
            }
        }
        Patient newpatient = patientServices.createNewPatient(patient);
        return ResponseEntity.ok("PatientCreated Successfully : " +newpatient.getId());
    }





    @PutMapping("/editPatient/{id}")
    public ResponseEntity<String> editPatientMotif(@PathVariable("id") Long id , @RequestBody Patient motif){
        Patient findOnePatient = patientServices.showOnePatient(id);
        System.out.println("dqsdgqs dgqsd qsdghqsdu "+motif.getMotif());
        findOnePatient.setMotif(motif.getMotif());
        patientServices.editOnePatient(findOnePatient);
        return ResponseEntity.ok("the Motif Value Has Changed");
    }


    @PutMapping("/editReciptionRv/{patientId}")
    public ResponseEntity<String> editPatientRv(@Valid @PathVariable("patientId") Long patientId ,  @RequestParam("doctor_id") Long doctor_id, @RequestBody Patient updatedPatient) throws JsonProcessingException {
        Patient onePatient = patientServices.showOnePatient(patientId);
        DoctorModel oneDoctor = doctorServices.showOne(doctor_id);
        onePatient.setDoctor(oneDoctor);
        // Update other fields with the data from updatedPatient
        onePatient.setFirstName(updatedPatient.getFirstName());
        onePatient.setLastName(updatedPatient.getLastName());
        onePatient.setIdentityType(updatedPatient.getIdentityType());
        onePatient.setIdentityNumber(updatedPatient.getIdentityNumber());
        onePatient.setPatientNationality(updatedPatient.getPatientNationality());
        onePatient.setGender(updatedPatient.getGender());
        onePatient.setAge(updatedPatient.getAge());
        onePatient.setMotif(updatedPatient.getMotif());
        if(conv(updatedPatient.getDate()) < conv(new Date())){
            return ResponseEntity.badRequest().body("Patient date cannot be in the past");
        }else{
            onePatient.setDate(updatedPatient.getDate());
        }
        // Set other fields accordingly

        patientServices.editOnePatient(onePatient); // Save updated patient
        return ResponseEntity.ok().body("The Patient Have Updated : " + onePatient.getId());
    }

    @PutMapping("/updateRapport/{id}")
    public ResponseEntity<String> updateRapport(@PathVariable("id")Long id ,@RequestBody Patient patient){
        Patient onePatient = patientServices.showOnePatient(id);
        onePatient.setRapport(patient.getRapport());
        patientServices.editOnePatient(onePatient);
        return ResponseEntity.ok().body("The Patient Rapport Been Updated  : " + onePatient.getRapport());
    }



    @PutMapping("/editReciption/{patientId}")
    public ResponseEntity<String> editPatient(@Valid @PathVariable("patientId") Long patientId ,  @RequestParam("doctor_id") Long doctor_id, @RequestBody Patient updatedPatient) throws JsonProcessingException {
        Patient onePatient = patientServices.showOnePatient(patientId);
        DoctorModel oneDoctor = doctorServices.showOne(doctor_id);
        onePatient.setDoctor(oneDoctor);
        // Update other fields with the data from updatedPatient
        onePatient.setFirstName(updatedPatient.getFirstName());
        onePatient.setLastName(updatedPatient.getLastName());
        onePatient.setIdentityType(updatedPatient.getIdentityType());
        onePatient.setIdentityNumber(updatedPatient.getIdentityNumber());
        onePatient.setPatientNationality(updatedPatient.getPatientNationality());
        onePatient.setGender(updatedPatient.getGender());
        onePatient.setAge(updatedPatient.getAge());
        onePatient.setMotif(updatedPatient.getMotif());
        onePatient.setDate(new Date());
        // Set other fields accordingly

        patientServices.editOnePatient(onePatient); // Save updated patient
        return ResponseEntity.ok().body("The Patient Have Updated : " + onePatient.getId());
    }





}
