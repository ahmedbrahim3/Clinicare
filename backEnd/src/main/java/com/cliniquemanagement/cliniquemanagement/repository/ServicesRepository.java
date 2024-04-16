package com.cliniquemanagement.cliniquemanagement.repository;

import com.cliniquemanagement.cliniquemanagement.models.Services;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicesRepository extends CrudRepository<Services, Long> {
    List<Services> findAll();
//    List<Services> findByType(String type);
}
