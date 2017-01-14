/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : Application.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define an application and what its
                   caracteristics are.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 *
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini
 * Fabien
 * @version 1.0
 * @since 2016-11-14
 */
@Entity
public class Application implements Serializable {

   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
   private Long id;

   private String name;
   private String description;
   private String password;

   @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
   private List<Badge> listBadges;

   @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
   private List<PointScale> listPointScales;

   @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
   private List<Event> listEvents;

   @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
   private List<User> listUsers;

   @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
   private List<Rule> listRules;

   public Application() {
   }

   public Application(String name, String description, String password) {
      this.name = name;
      this.description = description;
      this.password = password;
      listBadges = new ArrayList<>();
      listEvents = new ArrayList<>();
      listUsers = new ArrayList<>();
   }

   public List<Badge> getBadges() {
      return listBadges;
   }
   
   public List<PointScale>getPointScales(){
       return listPointScales;
   }
   
   public List<Rule> getRules(){
       return listRules;
   }

   public Badge getBadge(Long id) {
      for (Badge b : listBadges) {
         if (Objects.equals(b.getId(), id)) {
            return b;
         }
      }
      return null;
   }
   
   public PointScale getPointScale(Long id){
       for (PointScale p : listPointScales){
           if(Objects.equals(p.getId(), id)){
               return p;
           }
       }
       return null;
   }
   
   public Rule getRule (Long id){
       for (Rule r : listRules){
           if(Objects.equals(r.getId(), id)){
               return r;
           }
       }
       return null;
   }

   public Badge getBadge(String name) {
      for (Badge b : listBadges) {
         if (Objects.equals(b.getName(), name)) {
            return b;
         }
      }
      return null;
   }
   
   public PointScale getPointScale(String name){
       for (PointScale p : listPointScales){
           if(Objects.equals(p.getName(), name)){
               return p;
           }
       }
       return null;
   }
   
   public Rule getRule (String name){
       for (Rule r : listRules){
           if(Objects.equals(r.getRuleName(), name)){
               return r;
           }
       }
       return null;
   }
   

   public void putBadge(Badge badge) {
      for (int i = 0; i < listBadges.size(); ++i) {
         if (Objects.equals(listBadges.get(i).getId(), badge.getId())) {
            Badge b = listBadges.get(i);
            b.setName(badge.getName());
            b.setDescription(badge.getDescription());
            b.setImage(badge.getImage());
            return;
         }
      }
   }
   
   
   public void putPointScale(PointScale pointScale) {
      for (int i = 0; i < listBadges.size(); ++i) {
         if (Objects.equals(listPointScales.get(i).getId(), pointScale.getId())) {
            PointScale p = listPointScales.get(i);
            p.setName(pointScale.getName());
            p.setDescription(pointScale.getDescription());
            p.setCoefficient(pointScale.getCoefficient());
            return;
         }
      }
   }
   
   public void putRule(Rule rule) {
      for (int i = 0; i < listRules.size(); ++i) {
         if (Objects.equals(listRules.get(i).getId(), rule.getId())) {
            Rule r = listRules.get(i);
            r.setRuleName(rule.getRuleName());
            r.setRuleDescription(rule.getRuleDescription());
            r.setBadge(rule.getBadge());
            r.setEventType(rule.getEvenType());
            r.setPointScale(rule.getPointScale());
            r.setPoints(rule.getPoints());
            return;
         }
      }
   }

   public List<Event> getEvents() {
      return listEvents;
   }

   public Long getId() {
      return id;
   }

   public String getName() {
      return name;
   }

   public String getDescription() {
      return description;
   }

   public String getPassword() {
      return password;
   }

   public void setName(String name) {
      this.name = name;
   }

   public void setDescription(String description) {
      this.description = description;
   }

   public void setPassword(String password) {
      this.password = password;
   }

   public void addEvent(Event newEvent) {
      this.listEvents.add(newEvent);
   }

   public void addBadges(Badge badge) {
      this.listBadges.add(badge);
   }
   
   public void addPointScales(PointScale pointScale){
       this.listPointScales.add(pointScale);
   }

   public void addUsers(User user) {
      this.listUsers.add(user);
   }

   public List<User> getListUsers() {
      return listUsers;
   }

   public List<Rule> getListRules() {
      return listRules;
   }

   public void deleteBadge(Long id) {
      for (int i = 0; i < listBadges.size(); ++i) {
         if (Objects.equals(listBadges.get(i).getId(), id)) {
            listBadges.remove(i);
            return;
         }
      }
   }
   
   public void deletePointScale(Long id) {
      for (int i = 0; i < listPointScales.size(); ++i) {
         if (Objects.equals(listPointScales.get(i).getId(), id)) {
            listPointScales.remove(i);
            return;
         }
      }
   }
   
   public void deleteRule(Long id) {
      for (int i = 0; i < listRules.size(); ++i) {
         if (Objects.equals(listRules.get(i).getId(), id)) {
            listRules.remove(i);
            return;
         }
      }
   }
}
