/*
 -----------------------------------------------------------------------------------
 Project 	 : Projet AMT
 File     	 : RuleProcessor.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien 
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this file is to allow us to perform a process of an
                   event for a typical rule and update all the relatives objects
                   involved.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.services;

import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.Badge;
import ch.heigvd.gamification.model.BadgeAward;
import ch.heigvd.gamification.model.Event;
import ch.heigvd.gamification.model.PointScale;
import ch.heigvd.gamification.model.PointsAward;
import ch.heigvd.gamification.model.Rule;
import java.util.Date;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * 
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */
@Service
public class RuleProcessor {
    
    ApplicationRepository applicationRepository;
    PointScaleRepository pointScaleRepository;
    BadgeRepository badgeRepository;
    AwardRepository awardRepository;
    RuleRepository ruleRepository;

    
    public RuleProcessor(ApplicationRepository applicationRepository, PointScaleRepository pointScaleRepository,
                         BadgeRepository badgeRepository, AwardRepository awardRepository,
                         RuleRepository ruleRepository){
        this.applicationRepository = applicationRepository;
        this.pointScaleRepository = pointScaleRepository;
        this.badgeRepository = badgeRepository;
        this.awardRepository = awardRepository;
        this.ruleRepository = ruleRepository;
        
    }
    
    
    @Async
    @Transactional
    public void processRule(Event event) {
        
        Application targetApplication = event.getApplication();
        String eventType= event.getName();
        Long userId = event.getUserAppid();
        
        //List<Rule> rules = targetApplication.getListRules();
        List<Rule> rules = ruleRepository.findByEventTypeAndApplicationId(eventType, event.getApplication().getId());
        PointScale pointScale;
        Badge badge;
        
        // We check if we have at least some rule or not
        if(rules.size() > 0){
            for (Rule rule : rules) {
                pointScale = rule.getPointScale();
                badge = rule.getBadge();
                
                // If it's some points to be given to a user
                if(pointScale != null){
                    PointsAward userPointAward = awardRepository.findByUserAndPointScale(event.getUser(), pointScale);
                    if(userPointAward != null){
                        userPointAward.setScore(userPointAward.getScore() + rule.getPoints());
                    }
                    else{
                        userPointAward = new PointsAward(rule.getPointScale(), "Got some points", new Date(), event.getUser());
                        userPointAward.setScore(rule.getPoints());
                    }
                    awardRepository.save(userPointAward);
                }
                
                // If it's a badge to be given to a user
                if(badge != null){
                    BadgeAward userBadgeAward = awardRepository.findByUserAndBadge(event.getUser(), badge);
                    
                    // If the user hasn't got any badge yet, he gets one, if he has he gets nothing
                    if(userBadgeAward == null){
                        userBadgeAward = new BadgeAward(rule.getBadge(), "Got a badge", new Date(), event.getUser());
                        awardRepository.save(userBadgeAward);
                    }
                }
            }
                        
        }
        // In case we have no rule for atarget application
        else{
            throw new UnsupportedOperationException("No rules available for this: Create some rules before.");
        }
        
    }

}
