package com.cliniquemanagement.cliniquemanagement.repository;

import com.cliniquemanagement.cliniquemanagement.models.Dosage;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DosageRepository extends CrudRepository<Dosage , Long> {

    List<Dosage> findAll();
    @Query("SELECT d FROM Dosage d WHERE d.custom_medication = :medicationId")
    List<Dosage> findByCustomMedication(@Param("medicationId") Long medicationId);
}
