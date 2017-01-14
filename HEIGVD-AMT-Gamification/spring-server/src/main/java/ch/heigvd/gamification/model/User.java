/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : User.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a user and what its
                   caracteristics are.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

/**
 * 
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */
@Entity
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private Long userIdApp;
    private Long appId;
    private int numberOfEvents;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Award> listAwards; 
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Event> listEvents;
    
    @ManyToOne
    private Application application;
    
    
    public User(){}
    
    public User(Application application){
        this.numberOfEvents = 0;
        this.application = application;
        listAwards = new ArrayList<>();
        listEvents = new ArrayList<>();
    }
    
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserIdApp(){
        return userIdApp;
    }
    
    public void setUserIdApp(Long userIdApp){
        this.userIdApp = userIdApp;
    }
    
    public Long getAppId(){
        return appId;
    }
    
    public int getNumberOfEvents(){
        return numberOfEvents;
    }
    
    public void setNumberOfEvents(int number){
        this.numberOfEvents = number;
    }
    
    public void setApplication(Application application){
        this.application = application;
    }
    
    public Application getApplication(){
        return application;
    }
    

}
