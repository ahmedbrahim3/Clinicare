package com.cliniquemanagement.cliniquemanagement.services;


import com.cliniquemanagement.cliniquemanagement.models.Dosage;
import com.cliniquemanagement.cliniquemanagement.repository.DosageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DosageService {

    @Autowired
    private DosageRepository service;



    public List<Dosage> findall(){
        return service.findAll();
    }

    public Dosage createDosage(Dosage d){
        return service.save(d);
    }


    public Dosage oneDosage(Long id){
        Optional<Dosage> oneDosage = service.findById(id);
        return oneDosage.orElse(null);
    }
    public Dosage update(Dosage d){
        return service.save(d);
    }


}
