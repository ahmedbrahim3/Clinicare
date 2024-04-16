package com.cliniquemanagement.cliniquemanagement.services;


import com.cliniquemanagement.cliniquemanagement.models.Dosage;
import com.cliniquemanagement.cliniquemanagement.models.Medication;
import com.cliniquemanagement.cliniquemanagement.models.Patient;
import com.cliniquemanagement.cliniquemanagement.repository.DosageRepository;
import com.cliniquemanagement.cliniquemanagement.repository.MedicationRepository;
import com.cliniquemanagement.cliniquemanagement.repository.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.webjars.NotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class MedicationServices {
    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DosageRepository dosageRepository;
    public List<Medication> findAllMedication(){return medicationRepository.findAll();}

    public Medication createMedication (Medication M){return medicationRepository.save(M);}


//    public List<Medication> findMedication(Medication M) {
//        return medicationRepository.findByType(M.getName());
//    }

    public Medication showOneMedication(Long id){
        Optional<Medication> oneMedication = medicationRepository.findById(id);
        return oneMedication.orElse(null);
    }

    public Medication updateMedication(Medication m ){
        System.out.println("Im From The Medication : =============" + m);
        return medicationRepository.save(m);
    }

    @Transactional
    public void deleteMedicationAndCascade(Long medicationId) {
        // Find the medication
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new NotFoundException("Medication not found"));

        // Remove the medication from all related patients
        List<Patient> patients = medication.getPatientMedic();
        for (Patient patient : patients) {
            patient.getMedic().remove(medication);
            patientRepository.save(patient);
        }

        // Finally, delete the medication itself
        medicationRepository.delete(medication);
    }


}
