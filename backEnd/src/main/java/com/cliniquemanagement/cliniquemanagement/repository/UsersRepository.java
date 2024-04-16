package com.cliniquemanagement.cliniquemanagement.repository;

import com.cliniquemanagement.cliniquemanagement.models.Users;
import org.jose4j.jwk.Use;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends CrudRepository<Users , Long> {

    List<Users> findAll();
    Optional<Users> findByUserName(String userName);


}
