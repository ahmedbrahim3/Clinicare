package com.cliniquemanagement.cliniquemanagement.services;

import com.cliniquemanagement.cliniquemanagement.models.DoctorModel;
import com.cliniquemanagement.cliniquemanagement.repository.DoctortRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServices {

    @Autowired
    private DoctortRepository doctortRepository;


    public List<DoctorModel> findAllDoctor(){
        return doctortRepository.findAll();
    }


    public DoctorModel createDoctor(DoctorModel d){
        return doctortRepository.save(d);
    }

    public List<DoctorModel> findDocotrBySpecialite(DoctorModel d){
        List<DoctorModel> oneDoctor = doctortRepository.findByType(d.getType());
        return oneDoctor;
    }

    public DoctorModel showOne(Long id){
        Optional<DoctorModel> oneDoctor = doctortRepository.findById(id);
        return oneDoctor.orElse(null);
    }
    public DoctorModel updateDoctor(DoctorModel d ){
        return doctortRepository.save(d);
    }

}
