package com.cliniquemanagement.cliniquemanagement.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
@Table(name = "service")
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @NotEmpty
    private String name;

    @NotNull
    private double price;

    @NotNull
    private int quantity;

    @ManyToMany(mappedBy = "allServices", fetch = FetchType.LAZY , cascade = CascadeType.ALL)
    private List<Patient> patients;


    public List<Patient> getPatient() {
        return patients;
    }

    public void setPatient(List<Patient> patient) {
        this.patients = patient;
    }

    public Services(){
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
