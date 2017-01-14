/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : Badge.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a Badge and what its
                   caracteristics are.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.model;

import java.io.Serializable;
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
public class Badge implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


    private String name;
    private String image;
    private String description;
    
    @OneToMany(mappedBy = "badge", cascade = CascadeType.ALL)
    private List<Rule> listRules;
    
    @ManyToOne
    private Application application;


    public Badge(){}

    public Badge(String name, String image, String description) {
        this.name = name;
        this.image = image;
        this.description = description;
    }

    public Long getId() {
        return id;
    }
   
    
    public String getName() {
        return name;
    }

    public String getImage() {
        return image;
    }

    public String getDescription() {
        return description;
    }
    
    public Application getApplication(){
        return application;
    }
    

    public void setName(String name) {
        this.name = name;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setApplication(Application application){
        this.application = application;
    }
    

}
