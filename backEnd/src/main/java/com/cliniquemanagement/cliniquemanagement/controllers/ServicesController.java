package com.cliniquemanagement.cliniquemanagement.controllers;

import com.cliniquemanagement.cliniquemanagement.models.Patient;
import com.cliniquemanagement.cliniquemanagement.models.Services;
import com.cliniquemanagement.cliniquemanagement.services.PatientServices;
import com.cliniquemanagement.cliniquemanagement.services.ServServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ServicesController {

    @Autowired
    private ServServices servServices;

    @Autowired
    private PatientServices patientServices;
    // Endpoint to get all services
    @GetMapping("/services")
    public List<Services> getAllServices() {
        return servServices.findAllServices();
    }

    // Endpoint to create a new service
    @PostMapping("/services/add")
    public ResponseEntity<String> createService(@Valid @RequestBody Services service,
                                              BindingResult result) {
        System.out.println("This Is The Service That From The Body : "+service);
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Error Occured During Adding :" + result.toString());
        }
        servServices.createService(service);
        return ResponseEntity.ok().body("Succesfully Added The Services");
    }
//    @PostMapping("/service/add")
//    public ResponseEntity<String> createService(@RequestBody Services services,BindingResult result){
//        return ResponseEntity.ok().body("The Service Created Succesfully ");
//    }

    // Endpoint to update an existing service
    @PutMapping("/services/edit/{id}")
    public ResponseEntity<Void> updateService(@Valid @RequestBody Services service,
                                              @PathVariable("id") Long id) {
        // Check if the service exists
        Services existingService = servServices.showOneService(id);
        if (existingService == null) {
            return ResponseEntity.notFound().build();
        }
        servServices.updateService(service);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/services/addService/{id}/{serviceId}")
    public ResponseEntity<String> updateServiceForPatient(@PathVariable("id") Long id,
                                                          @PathVariable("serviceId") Long serviceId) {
        try {
            // Fetch the service and patient entities
            Services oneService = servServices.showOneService(serviceId);
            Patient onePatient = patientServices.showOnePatient(id);

            // Check if the service and patient exist
            if (oneService == null) {
                return ResponseEntity.notFound().build();
            }
            if (onePatient == null) {
                return ResponseEntity.notFound().build();
            }

            // Add the service to the patient
            onePatient.getAllServices().add(oneService);
            // Update the patient
            patientServices.editOnePatient(onePatient);

            // Log and return success response
            System.out.println("The Service Has Been Added: " + onePatient.getAllServices());
            return ResponseEntity.ok("The Service Has Been Added To The Patient Successfully");
        } catch (Exception e) {
            // Handle any exceptions and return error response
            System.err.println("Error adding service to patient: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add service to patient");
        }
    }

    // Endpoint to get a specific service by ID
    @GetMapping("/services/{id}")
    public Services getServiceById(@PathVariable Long id) {
        return servServices.showOneService(id);
    }

    // Endpoint to delete a service by ID
    @DeleteMapping("/services/delete/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        // Check if the service exists
        Services existingService = servServices.showOneService(id);
        if (existingService == null) {
            return ResponseEntity.notFound().build();
        }
        // Delete the service
        servServices.deleteOneService(id);
        return ResponseEntity.ok().build();
    }
}
