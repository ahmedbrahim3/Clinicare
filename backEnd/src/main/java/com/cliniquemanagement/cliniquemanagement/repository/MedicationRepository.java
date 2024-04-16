package com.cliniquemanagement.cliniquemanagement.repository;

import com.cliniquemanagement.cliniquemanagement.models.Medication;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends CrudRepository<Medication, Long> {
    List<Medication> findAll();

//    List<Medication> findByType(String type);
}
