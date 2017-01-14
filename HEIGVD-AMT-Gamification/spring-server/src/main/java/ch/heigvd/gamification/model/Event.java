/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : Event.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define an event and what its
                   caracteristics are.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.model;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * 
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */
@Entity
public class Event implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String name;
    private String description;
    //private Long appId;
    private Long userAppId;
    
    @ManyToOne
    private Application application;
    
    @ManyToOne
    private User user;
    
    
    
    public Event(){}
    
    public Event(User user, Application application, String name, Long userAppId){
        this.user = user;
        this.application = application;
        this.name = name;
        this.userAppId = userAppId;
    }
    
    public String getName()
    {
        return name;
    }
    
    public void setName(String name)
    {
        this.name = name;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
}
    
//    public Long getApplicationId(){
//        return appId;
//    }
//    
//    public void setApplicationId(Long applicationId){
//        this.appId = applicationId;
//    }
//    
//    public Long getUserId(){
//        return userId;
//    }
//    
    public void setUserAppId(Long userAppId){
        this.userAppId = userAppId;
    }
    
    public Long getUserAppid(){
        return userAppId;
    }
    
    public void setApplication(Application application){
        this.application = application;
    }
    
    public Application getApplication(){
        return application;
    }
}
