/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : ApplicationEndPoint.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a REST API on an application
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.ApplicationInputDTO;
import ch.heigvd.gamification.api.dto.ApplicationOutputDTO;
import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.services.ApplicationRepository;
import ch.heigvd.gamification.services.TokenKeyTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini
 * Fabien
 * @version 1.0
 * @since 2016-11-14
 */
@RestController
@RequestMapping("/applications")
public class ApplicationsEndpoint implements ApplicationsApi {

   private final ApplicationRepository applicationRepository;

   @Autowired
   ApplicationsEndpoint(ApplicationRepository applicationRepository) {
      this.applicationRepository = applicationRepository;
   }

   @Override
   @RequestMapping(method = RequestMethod.GET)
   public ResponseEntity<ApplicationOutputDTO> applicationsGet(@RequestHeader("Authorization") String authenticationToken) {

      // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      // Get the application id from the JWT
      long applicationId = TokenKeyTools.parseJWT(authenticationToken);

      // Get the existing application
      Application application = applicationRepository.findOne(applicationId);

      // If application was deleted but the authentication token wasn't removed
      if (application == null) {
         return new ResponseEntity<>(HttpStatus.GONE);
      }

      // Return the application
      ApplicationOutputDTO applicationDTO = toDTO(application);
      return new ResponseEntity<>(applicationDTO, HttpStatus.OK);
   }

   @Override
   @RequestMapping(method = RequestMethod.DELETE)
   public ResponseEntity<Void> applicationsDelete(@RequestHeader("Authorization") String authenticationToken) {

      // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      // Get the application id from the JWT
      long applicationId = TokenKeyTools.parseJWT(authenticationToken);

      // Get the existing application
      Application application = applicationRepository.findOne(applicationId);

      // If application was deleted but the authentication token wasn't removed
      if (application == null) {
         return new ResponseEntity<>(HttpStatus.GONE);
      }

      // Remove the application
      applicationRepository.delete(applicationId);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
   }

   @Override
   @RequestMapping(method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
   public ResponseEntity<Void> applicationsPut(@RequestBody ApplicationInputDTO application, @RequestHeader("Authorization") String authenticationToken) {

      // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      // Get the application id from the JWT
      long applicationId = TokenKeyTools.parseJWT(authenticationToken);

      // If application was deleted but the authentication token wasn't removed
      Application currentApplication = applicationRepository.findOne(applicationId);
      if (currentApplication == null) {
         return new ResponseEntity<>(HttpStatus.GONE);
      }

      final String name = application.getName();
      final String description = application.getDescription();
      final String password = application.getPassword();

      // Check if the request is processable
      boolean requestIsProcessable = requestIsProcessable(name, description, password);

      // Check if the application name has changed
      if (!currentApplication.getName().equals(name)) {
         // Check if the application name provided already exist
         Application applicationSaved = applicationRepository.findByName(name);
         if (applicationSaved != null) {
            requestIsProcessable = false;
         }
      }

      if (!requestIsProcessable) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      // Update the application
      currentApplication.setName(name);
      currentApplication.setDescription(description);
      currentApplication.setPassword(password);
      applicationRepository.save(currentApplication);

      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
   }

   @Override
   @RequestMapping(method = RequestMethod.POST)
   public ResponseEntity<Void> applicationsPost(@RequestBody ApplicationInputDTO application) {

      final String name = application.getName();
      final String description = application.getDescription();
      final String password = application.getPassword();

      // Check if the request is processable
      boolean requestIsProcessable = requestIsProcessable(name, description, password);

      // Check if the application name provided already exist
      Application applicationSaved = applicationRepository.findByName(name);
      if (applicationSaved != null) {
         requestIsProcessable = false;
      }

      if (!requestIsProcessable) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      // Save the new application
      Application newApplication = fromDTO(application);
      applicationRepository.save(newApplication);

      return new ResponseEntity<>(HttpStatus.CREATED);

   }

   public ApplicationOutputDTO toDTO(Application application) {
      ApplicationOutputDTO dto = new ApplicationOutputDTO();
      dto.setApplicationId(application.getId());
      dto.setName(application.getName());
      dto.setDescription(application.getDescription());
      return dto;
   }

   public Application fromDTO(ApplicationInputDTO applicationInputDTO) {
      return new Application(applicationInputDTO.getName(), applicationInputDTO.getDescription(), applicationInputDTO.getPassword());
   }

// Check if the payload json is processable
   public Boolean requestIsProcessable(String name, String description, String password) {

      // Test if the request is processable
      boolean requestIsProcessable = true;

      // Check if name, description or password is null
      if (name == null || description == null || password == null) {
         requestIsProcessable = false;
      }

      // Check if name, description or password is empty
      else if (name.trim().isEmpty() || description.trim().isEmpty() || password.trim().isEmpty()) {
         requestIsProcessable = false;
      }

      // Check if name or password length > 80 OR if description length > 255
      else if (name.length() > 80 || password.length() > 80 || description.length() > 255) {
         requestIsProcessable = false;
      }

      // Check if password contains at least 7 characters
      else if (password.length() < 7) {
         requestIsProcessable = false;
      }

      return requestIsProcessable;
   }

}
