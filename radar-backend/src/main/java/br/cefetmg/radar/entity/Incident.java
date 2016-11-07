/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetmg.radar.entity;

import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
import org.hibernate.annotations.GenericGenerator;

/**
 *
 * @author rafae_000
 */
@Entity  
@Table(name = "incident") 
@XmlRootElement
public class Incident {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private int id;
    private Date date;
    private int num_criminals;
    private boolean violence;
    private int num_victims;
    private String police_report;
    private int armed;
    private double latitude;
    private double longitude;
    private String location;
    private String description;
    private String objects_taken;
    private int reliability;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "victims_transport_id", nullable = false)
    private Transport victims_transport;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criminals_transport_id", nullable = false)
    private Transport criminals_transport;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getNum_criminals() {
        return num_criminals;
    }

    public void setNum_criminals(int num_criminals) {
        this.num_criminals = num_criminals;
    }

    public boolean isViolence() {
        return violence;
    }

    public void setViolence(boolean violence) {
        this.violence = violence;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public int getNum_victims() {
        return num_victims;
    }

    public void setNum_victims(int num_victims) {
        this.num_victims = num_victims;
    }

    public String getPolice_report() {
        return police_report;
    }

    public void setPolice_report(String police_report) {
        this.police_report = police_report;
    }

    public int getArmed() {
        return armed;
    }

    public void setArmed(int armed) {
        this.armed = armed;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjects_taken() {
        return objects_taken;
    }

    public void setObjects_taken(String objects_taken) {
        this.objects_taken = objects_taken;
    }

    public Transport getVictims_transport() {
        return victims_transport;
    }

    public void setVictims_transport(Transport victims_transport) {
        this.victims_transport = victims_transport;
    }

    public Transport getCriminals_transport() {
        return criminals_transport;
    }

    public void setCriminals_transport(Transport criminals_transport) {
        this.criminals_transport = criminals_transport;
    }

    public int getReliability() {
        return reliability;
    }

    public void setReliability(int reliability) {
        this.reliability = reliability;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
    
}
