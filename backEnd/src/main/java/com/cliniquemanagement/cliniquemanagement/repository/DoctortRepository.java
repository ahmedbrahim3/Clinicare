package com.cliniquemanagement.cliniquemanagement.repository;

import com.cliniquemanagement.cliniquemanagement.models.DoctorModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctortRepository  extends CrudRepository<DoctorModel , Long> {
    List<DoctorModel> findAll();

    List<DoctorModel> findByType(String type);

}
