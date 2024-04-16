package com.cliniquemanagement.cliniquemanagement.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Dosage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Long patient_med;

    private Long custom_medication;

    private Long uses;





    public Dosage(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getPatient_med() {
        return patient_med;
    }

    public void setPatient_med(Long patient_med) {
        this.patient_med = patient_med;
    }

    public Long getCustom_medication() {
        return custom_medication;
    }

    public void setCustom_medication(Long custom_medication) {
        this.custom_medication = custom_medication;
    }

    public Long getUses() {
        return uses;
    }

    public void setUses(Long uses) {
        this.uses = uses;
    }
}
