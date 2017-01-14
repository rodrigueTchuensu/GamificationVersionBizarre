/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : PointAwards.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a pointScale and what its
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
@DiscriminatorValue(value = "pointAward")
public class PointsAward extends Award implements Serializable {
    
    private long score;
        
    
    @ManyToOne
    private PointScale pointScale;
    
    public PointsAward() {}
    
    public PointsAward(PointScale pointScale, String reason, Date timestamp, User appUser){
         super(reason, timestamp, appUser);
         this.pointScale = pointScale;
     }

     
     public PointScale getPointScale() {
        return pointScale;
    }
     
    public void setPointScale(PointScale pointScale) {
        this.pointScale = pointScale;
    }
    
    public void setScore(long score){
        this.score = score;
    }
    
    public long getScore(){
        return score;
    }

}
