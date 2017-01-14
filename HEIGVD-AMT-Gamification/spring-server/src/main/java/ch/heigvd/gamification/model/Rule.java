/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : Rule.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a rule and what its
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
public class Rule implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne
    private PointScale pointScale;
    
    @ManyToOne
    private Badge badge;
    
    @ManyToOne
    private Application application;
    
    private int points;
    
    private String ruleDescription;
    
    private String ruleName;
    
    private String eventType;

        
    
    
    public Rule(){}
    
    public Rule(String ruleName, Application application, Badge badge, PointScale pointScale){
        this.ruleName = ruleName;
        this.application = application;
        this.badge = badge;
        this.pointScale = pointScale;
        this.points = 0;
    }
    

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public PointScale getPointScale() {
        return pointScale;
    }

    public void setPointScale(PointScale pointScale) {
        this.pointScale = pointScale;
    }
    
    public void setPoints(int points){
        this.points = points;
    }
    
    public int getPoints(){
        return points;
    }
    
    public void setRuleName(String ruleName){
        this.ruleName = ruleName;
    }
    
    public String getRuleName(){
        return ruleName;
    }

    public Badge getBadge() {
        return badge;
    }

    public void setBadge(Badge badge) {
        this.badge = badge;
    }
    
    public void setRuleDescription(String ruleDescription){
        this.ruleDescription = ruleDescription;
    }
    
    public String getRuleDescription(){
        return ruleDescription;
    }
    
    public String getEvenType(){
        return eventType;
    }
    
    public void setEventType(String eventType){
        this.eventType = eventType;
    }
    
}
