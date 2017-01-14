/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : BadgeAward.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a badge award and what its
                   caracteristics are.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */
package ch.heigvd.gamification.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 *
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */

@Entity
@DiscriminatorValue(value = "badgeAward")
public class BadgeAward extends Award implements Serializable{

    
    @ManyToOne
    private Badge badge;
    
    
     public BadgeAward() {
    }
   
     public BadgeAward(Badge badge, String reason, Date timestamp, User appUser){
         super(reason, timestamp, appUser);
         this.badge = badge;
     }

     
     public Badge getBadge() {
        return badge;
    }
     
    public void setBadge(Badge badge) {
        this.badge = badge;
    }
    
}