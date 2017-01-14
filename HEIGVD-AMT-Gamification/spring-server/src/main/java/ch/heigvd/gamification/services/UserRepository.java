/*
 -----------------------------------------------------------------------------------
 Project 	 : Projet AMT
 File     	 : UserRepository.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien 
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this file is to allow us to perform various operations, 
                   define a custom of some queries involving User objects
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */
package ch.heigvd.gamification.services;

import ch.heigvd.gamification.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */
public interface UserRepository extends JpaRepository<User, Long>{
    
}
