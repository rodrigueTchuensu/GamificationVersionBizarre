/*
 -----------------------------------------------------------------------------------
 Project 	 : Projet AMT
 File     	 : EventProcessor.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien 
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this file is to allow us to perform a process of an
                   event for a typical application and update all the relatives objects
                   involved.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.services;

import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.Event;
import ch.heigvd.gamification.model.User;
import java.util.List;
import java.util.Objects;
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
public class EventProcessor {
    
    private final UserRepository userRepository;
    
    public EventProcessor(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    
  @Async
  @Transactional
public User processEvent(Application targetApplication, Event event) {
        Long idToMatch = null;
        User userInDb = null;
        List<User> listUsers = targetApplication.getListUsers();
       
        for (User user : listUsers) {
            idToMatch = user.getUserIdApp();//user.getId()
            if(Objects.equals(idToMatch, event.getUserAppid())){
                userInDb = user;
                break;
            }
        }
        // if the user is not in the database we add him
        if (userInDb == null) {
            // Create and save the user in the database
            userInDb = new User(targetApplication);
            userInDb.setUserIdApp(event.getUserAppid()); //idToMatch
            userInDb.setNumberOfEvents(1); // Because it's a new user
            userRepository.save(userInDb);
        }
        else{
            userInDb.setNumberOfEvents(userInDb.getNumberOfEvents()+1);
        }
        return userInDb;

    }

}
