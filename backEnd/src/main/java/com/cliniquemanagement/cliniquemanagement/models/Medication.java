package com.cliniquemanagement.cliniquemanagement.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

@Entity
@Table(name = "Medication")
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty(message = "The Name Must Be Non Empty")
    private String name;
    @NotEmpty(message = "The Dosage Must Be Provided")
    private String dosage;
    @NotNull(message = "the Quantity Must Be Provided")
    private int quantity;
    @NotNull(message = "The Price Must Be Provided")
    private double price;



    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "medic", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Patient> patientMedic;





//    @OneToMany(mappedBy = "custom_medication")
//    @JsonManagedReference
//    private List<Dosage> dosages;


//    public List<Dosage> getDosages() {
//        return dosages;
//    }
//
//    public void setDosages(List<Dosage> dosages) {
//        this.dosages = dosages;
//    }


    public List<Patient> getPatientMedic() {
        return patientMedic;
    }

    public void setPatientMedic(List<Patient> patientMedic) {
        this.patientMedic = patientMedic;
    }

    public Medication(){
    }


//    @JsonIgnore
//    public List<Patient> getPatientMedic() {
//        return patientMedic;
//    }
//
//    public void setPatientMedic(List<Patient> patientMedic) {
//        this.patientMedic = patientMedic;
//    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
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

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }


}
