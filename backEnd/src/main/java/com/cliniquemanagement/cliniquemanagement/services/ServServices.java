package com.cliniquemanagement.cliniquemanagement.services;

import com.cliniquemanagement.cliniquemanagement.models.Services;
import com.cliniquemanagement.cliniquemanagement.repository.ServicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServServices {
    @Autowired
    private ServicesRepository servicesRepository;

    public List<Services> findAllServices() {
        return servicesRepository.findAll();
    }

    public Services createService(Services s) {
        return servicesRepository.save(s);
    }

//    public List<Services> findServices(Services S) {
//        return servicesRepository.findByType(S.getName());
//    }

    public Services showOneService(Long id) {
        Optional<Services> oneService = servicesRepository.findById(id);
        return oneService.orElse(null);
    }

    public Services updateService(Services S){return servicesRepository.save(S);}

    public void deleteOneService(Long id){servicesRepository.deleteById(id);}
}

