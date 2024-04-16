package com.cliniquemanagement.cliniquemanagement.controllers;

import com.cliniquemanagement.cliniquemanagement.models.Dosage;
import com.cliniquemanagement.cliniquemanagement.models.Medication;
import com.cliniquemanagement.cliniquemanagement.models.Patient;
import com.cliniquemanagement.cliniquemanagement.services.DosageService;
import com.cliniquemanagement.cliniquemanagement.services.MedicationServices;
import com.cliniquemanagement.cliniquemanagement.services.PatientServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class MedicamentsController {

    @Autowired
    private MedicationServices medicationServices;

    @Autowired
    private PatientServices patientServices;

    @Autowired
    private DosageService dosageService;

    @PutMapping("/insertDosage/{patient_id}/{patient_med}/{dosage}")
    public ResponseEntity<String> insertDosage(@PathVariable("patient_id") Long patient_id
            , @PathVariable("patient_med")Long patient_med
            , @PathVariable("dosage")Long dosage)
    {
        Patient onePatient = patientServices.showOnePatient(patient_id);
        Medication oneMedic = medicationServices.showOneMedication(patient_med);
        System.out.println("This For Medic "+oneMedic);
        System.out.println("This For Patient" + onePatient);
        List<Dosage> allDosage = dosageService.findall();
        System.out.println("The Dosage Quantity =>>>>>>>>=<=<=<=<==<=<=<=" + dosage);
        if(onePatient != null && oneMedic != null){
            for(Dosage oneDosage : allDosage){
                if(Objects.equals(oneDosage.getPatient_med(), patient_id) && Objects.equals(oneDosage.getCustom_medication(), patient_med)){
                    System.out.println("The Patient Med for The Update " + patient_id + "The Dosage Id Patient : " + oneDosage.getPatient_med());
                    System.out.println("The Med Id for The Update " + patient_med + " The Dosage Id Medic : " + oneDosage.getCustom_medication());
                    oneDosage.setUses(dosage);
                    dosageService.update(oneDosage);
                    return ResponseEntity.ok().body("The Dosage Been Updated !===");
                }
            }
            Dosage newDosage = new Dosage();
            newDosage.setPatient_med(onePatient.getId());
            newDosage.setCustom_medication(oneMedic.getId());
            newDosage.setUses(dosage);
            dosageService.createDosage(newDosage);
            return  ResponseEntity.ok().body("The Dosage Been Created !:=");
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The Patient or The Medic Not Found");
        }


    }

    @GetMapping("/allDosage")
    public List<Map<String, Object>> allDosage(){
        List<Dosage> allDosage = dosageService.findall();
        List<Map<String , Object>> dosageData = new ArrayList<>();

        for(Dosage dosage:allDosage){
            Map<String , Object> dosageMap = new HashMap<>();
            if(dosage != null){
                if(dosage.getCustom_medication()!=null && dosage.getPatient_med() !=null){
                    dosageMap.put("patient_id" , dosage.getPatient_med());
                    dosageMap.put("medic_id" , dosage.getCustom_medication());
                    dosageMap.put("uses" , dosage.getUses());
                }else{
                    dosageMap.put("patient_id" , null);
                    dosageMap.put("medic_id" , null);
                    dosageMap.put("uses" , null);
                }
            }

            dosageData.add(dosageMap);

        }
        return dosageData;
    }

    @GetMapping("/medications")
    public List<Map<String, Object>> getAllMedications() {
        List<Medication> allMedic = medicationServices.findAllMedication();
        List<Map<String, Object>> medicData = new ArrayList<>();

        for (Medication medic : allMedic) {
            Map<String, Object> medicMap = new HashMap<>();
            medicMap.put("Medic", medic);

            List<Long> patientIds = new ArrayList<>();
            for (Patient patient : medic.getPatientMedic()) {
                patientIds.add(patient.getId());
            }
            medicMap.put("patient_ids", patientIds);

            medicData.add(medicMap);
        }
        return medicData;
    }

//     Endpoint to create a new medication
    @PostMapping("/medications/new")
    public ResponseEntity<String> createMedication(@Valid @RequestBody Medication medication,
                                                 BindingResult result) {
        System.out.println("====>" + medication);
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.toString());
        }
        medicationServices.createMedication(medication);
        return ResponseEntity.ok().body("The Medication Created With Succes");
    }
    // Endpoint to update an existing medication
    @PutMapping("/medications/edit/{id}")
    public ResponseEntity<String> updateMedication(@Valid @RequestBody Medication medication,
                                                 @PathVariable("id") Long id) {
        // Check if the medication exists
        Medication existingMedication = medicationServices.showOneMedication(id);
        if (existingMedication == null) {
            return ResponseEntity.notFound().build();
        }
        // Set the ID of the medication and update it
        medication.setId(id);
        medicationServices.updateMedication(medication);
        return ResponseEntity.ok().body("The Medication Whith Id : " + medication.getId()+ ", Updated With Success");
    }

    // Endpoint to get a specific medication by ID
    @GetMapping("/medications/{id}")
    public Medication getMedicationById(@PathVariable Long id) {
        return medicationServices.showOneMedication(id);
    }

    // Endpoint to delete a medication by ID
    @DeleteMapping("/medications/delete/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id) {
        // Check if the medication exists
        Medication existingMedication = medicationServices.showOneMedication(id);
        if (existingMedication == null) {
            return ResponseEntity.notFound().build();
        }
        // Delete the medication
        medicationServices.deleteMedicationAndCascade(id);
        return ResponseEntity.ok().build();
    }
}
