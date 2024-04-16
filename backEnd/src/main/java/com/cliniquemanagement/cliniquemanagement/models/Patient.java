package com.cliniquemanagement.cliniquemanagement.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotEmpty
    @Size(min = 1 , max = 125 , message = "The Name Must be between 1 and 125 ")
    private String firstName;

    @NotEmpty
    @Size(min = 1 , max = 125 , message = "The Name Must be between 1 and 125 ")
    private String lastName;


    @NotEmpty
    @Size(min = 8 , message = "The Identity Number Must Be Provided")
    private String identityNumber;

    @NotNull
    private String identityType;

    @NotNull
    private String patientNationality;

    @NotNull
    private String gender;

    @NotNull
    private Integer age;

    @NotEmpty
    private String motif;


    private String rapport ;

    public String getRapport() {
        return rapport;
    }

    public void setRapport(String rapport) {
        this.rapport = rapport;
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "patient_services",
            joinColumns = @JoinColumn(name = "patient_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    @JsonIgnore
    private List<Services> allServices;


    public List<Services> getAllServices() {
        return allServices;
    }

    public void setAllServices(List<Services> allServices) {
        this.allServices = allServices;
    }

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private DoctorModel doctor;







    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "patient_medic",
            joinColumns = @JoinColumn(name = "patient_id"),
            inverseJoinColumns = @JoinColumn(name = "medic_id")
    )
    private List<Medication> medic;

//    @JsonBackReference
//    @JsonIgnore
//    @OneToMany(mappedBy = "patient_med",fetch = FetchType.LAZY)
//    private List<Dosage> medsTaken;

    public List<Medication> getMedic() {
        return medic;
    }

    public void setMedic(List<Medication> medic) {
        this.medic = medic;
    }




//    @ManyToOne(fetch = FetchType.LAZY)
//    @JsonIgnore
//    @JsonBackReference
//    private Medication patientDosage;

//    public Medication getPatientDosage() {
//        return patientDosage;
//    }
//
//    public void setPatientDosage(Medication patientDosage) {
//        this.patientDosage = patientDosage;
//    }

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date date;

    @Column(updatable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date createdAt;



    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date updatedAt;


    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Patient(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getIdentityNumber() {
        return identityNumber;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public String getIdentityType() {
        return identityType;
    }

    public void setIdentityType(String identityType) {
        this.identityType = identityType;
    }

    public String getPatientNationality() {
        return patientNationality;
    }

    public void setPatientNationality(String patientNationality) {
        this.patientNationality = patientNationality;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }


//    public List<Dosage> getMedsTaken() {
//        return medsTaken;
//    }
//
//    public void setMedsTaken(List<Dosage> medsTaken) {
//        this.medsTaken = medsTaken;
//    }

    public DoctorModel getDoctor() {
        return doctor;
    }

    public void setDoctor(DoctorModel doctor) {
        this.doctor = doctor;
    }
}
