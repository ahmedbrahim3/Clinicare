package com.cliniquemanagement.cliniquemanagement.services;


import com.cliniquemanagement.cliniquemanagement.models.Patient;
import com.cliniquemanagement.cliniquemanagement.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PatientServices {

    @Autowired
    private UsersServices usersServices;

    @Autowired
    private PatientRepository patientRepository;


    public List<Patient> showAll(){
        return patientRepository.findAll();
    }

    public Patient createNewPatient(Patient p){
        return patientRepository.save(p);
    }

    public Patient showOnePatient(Long id){
        Optional<Patient> maybePatient = patientRepository.findById(id);

        return maybePatient.orElse(null);
    }


    public Patient editOnePatient(Patient p){
        System.out.println("Im From Patient Service : =================" + p);
        return patientRepository.save(p);
    }

    public void deleteOnePatient(Long id){
        patientRepository.deleteById(id);
    }




}
