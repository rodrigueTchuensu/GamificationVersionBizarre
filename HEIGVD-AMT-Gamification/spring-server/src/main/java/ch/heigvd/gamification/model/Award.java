/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : Award.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define an award and what its
                   caracteristics are.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */


package ch.heigvd.gamification.model;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "award_type")
public abstract class Award implements Serializable {
    
     @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
     
    private String reason;
    
    //@Basic(optional = false)
    //@Column(name = "LastTouched", insertable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp; 
    
    @ManyToOne
    private User user;

    public Award() {
    }

    public Award(String reason, Date timestamp, User appUser) {
        this.reason = reason;
        this.timestamp = timestamp;
        this.user = appUser;
    }
    
    public String getReason() {
        return reason;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public User getUser() {
        return user;
    }
    

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public void setUser(User user) {
        this.user = user;
    }
    
    
     
}
