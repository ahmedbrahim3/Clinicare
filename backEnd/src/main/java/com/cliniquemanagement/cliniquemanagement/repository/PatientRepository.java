package com.cliniquemanagement.cliniquemanagement.repository;


import com.cliniquemanagement.cliniquemanagement.models.Patient;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository  extends CrudRepository<Patient , Long> {
    List<Patient> findAll();
}
