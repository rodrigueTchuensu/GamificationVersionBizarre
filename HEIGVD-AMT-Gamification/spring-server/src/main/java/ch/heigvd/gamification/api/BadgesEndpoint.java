/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : BadgesEndPoint.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a REST API on a badge
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.BadgeInputDTO;
import ch.heigvd.gamification.api.dto.BadgeOutputDTO;
import ch.heigvd.gamification.api.dto.LocationBadge;
import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.Badge;
import ch.heigvd.gamification.services.ApplicationRepository;
import ch.heigvd.gamification.services.BadgeRepository;
import ch.heigvd.gamification.services.TokenKeyTools;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
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
@RequestMapping("/badges")
public class BadgesEndpoint implements BadgesApi {

   private final HttpServletRequest request;
   private final BadgeRepository badgeRepository;
   private final ApplicationRepository applicationRepository;

   @Autowired
   BadgesEndpoint(HttpServletRequest request, BadgeRepository badgeRepository, ApplicationRepository applicationRepository) {
      this.request = request;
      this.badgeRepository = badgeRepository;
      this.applicationRepository = applicationRepository;
   }

   @Override
   @RequestMapping(method = RequestMethod.GET)
   public ResponseEntity<List<BadgeOutputDTO>> badgesGet(@RequestHeader("Authorization") String authenticationToken) {

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

      // Get the application badges
      List<Badge> badges = application.getBadges();

      // Return the BadgeOutputDTO
      List<BadgeOutputDTO> badgesDTO = new ArrayList<>();
      for (int i = 0; i < badges.size(); i++) {
         badgesDTO.add(i, toDTO(badges.get(i)));
      }
      return new ResponseEntity<>(badgesDTO, HttpStatus.OK);
   }

   @Override
   @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
   public ResponseEntity<Void> badgesIdDelete(@PathVariable("id") Long id, @RequestHeader("Authorization") String authenticationToken) {

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

      // Remove the badge whose id is provided
      Badge currentBadge = application.getBadge(id);
      if (currentBadge == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      application.deleteBadge(id);
      badgeRepository.delete(id);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
   }

   @Override
   @RequestMapping(method = RequestMethod.GET, value = "/{id}")
   public ResponseEntity<BadgeOutputDTO> badgesIdGet(@PathVariable("id") Long id, @RequestHeader("Authorization") String authenticationToken) {

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

      // Check if the desired badge exists
      Badge badge = application.getBadge(id);
      if (badge == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      // Return the badge DTO
      BadgeOutputDTO badgeDTO = toDTO(badge);
      return new ResponseEntity<>(badgeDTO, HttpStatus.OK);
   }

   @Override
   @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
   public ResponseEntity<Void> badgesIdPut(@PathVariable("id") Long id, @RequestBody BadgeInputDTO badge, @RequestHeader("Authorization") String authenticationToken) {

      // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      final String name = badge.getName();
      final String description = badge.getDescription();
      final String imageURL = badge.getImageURL();

      // Test if the request isn't valid (http error 422 unprocessable entity)
      boolean httpErrorUnprocessableEntity = false;

      // Check if name, description or imageURL is null
      if (name == null || description == null || imageURL == null) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name, description or imageURL is empty
      else if (name.trim().isEmpty() || description.trim().isEmpty() || imageURL.trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name length > 80 OR if description or imageURL length > 255
      else if (name.length() > 80 || description.length() > 255 || imageURL.length() > 255) {
         httpErrorUnprocessableEntity = true;
      }

      // Get the application id from the JWT
      long applicationId = TokenKeyTools.parseJWT(authenticationToken);

      // Get the existing application
      Application application = applicationRepository.findOne(applicationId);

      // If application was deleted but the authentication token wasn't removed
      if (application == null) {
         return new ResponseEntity<>(HttpStatus.GONE);
      }

      // Get the desired badge
      Badge currentBadge = application.getBadge(id);
      if (currentBadge == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      // Check if the application name has changed
      if (!currentBadge.getName().equals(name)) {
         // Check if the new application name provided already exist
         Badge badgeSaved = application.getBadge(name);
         if (badgeSaved != null) {
            httpErrorUnprocessableEntity = true;
         }
      }

      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      currentBadge.setName(name);
      currentBadge.setDescription(description);
      currentBadge.setImage(imageURL);
      
      badgeRepository.save(currentBadge);
      application.putBadge(currentBadge);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
   }

   @Override
   @RequestMapping(method = RequestMethod.POST)
   public ResponseEntity<LocationBadge> badgesPost(@RequestBody BadgeInputDTO badge, @RequestHeader("Authorization") String authenticationToken) {

      // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      final String name = badge.getName();
      final String description = badge.getDescription();
      final String imageURL = badge.getImageURL();

      // Test if the request isn't valid (http error 422 unprocessable entity)
      boolean httpErrorUnprocessableEntity = false;

      // Check if name, description or imageURL is null
      if (name == null || description == null || imageURL == null) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name, description or imageURL is empty
      else if (name.trim().isEmpty() || description.trim().isEmpty() || imageURL.trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name length > 80 OR if description or imageURL length > 255
      else if (name.length() > 80 || description.length() > 255 || imageURL.length() > 255) {
         httpErrorUnprocessableEntity = true;
      }

      // Get the application id from the JWT
      long applicationId = TokenKeyTools.parseJWT(authenticationToken);

      // Get the existing application
      Application application = applicationRepository.findOne(applicationId);

      // If application was deleted but the authentication token wasn't removed
      if (application == null) {
         return new ResponseEntity<>(HttpStatus.GONE);
      }

      // Check if application name already exists
      Badge currentBadge = application.getBadge(name);
      if (currentBadge != null) {
         httpErrorUnprocessableEntity = true;
      }

      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      Badge newBadge = fromDTO(badge);
      newBadge.setApplication(application);
      newBadge = badgeRepository.save(newBadge);
      application.addBadges(newBadge);
      Long newId = newBadge.getId();

      StringBuffer location = request.getRequestURL();
      if (!location.toString().endsWith("/")) {
         location.append("/");
      }
      location.append(newId.toString());
      HttpHeaders headers = new HttpHeaders();
      headers.add("Location", location.toString());
      return new ResponseEntity<>(headers, HttpStatus.CREATED);

   }

   public BadgeOutputDTO toDTO(Badge badge) {
      BadgeOutputDTO dto = new BadgeOutputDTO();
      dto.setBadgeId(badge.getId());
      dto.setName(badge.getName());
      dto.setDescription(badge.getDescription());
      dto.setImageURL(badge.getImage());
      return dto;
   }

   public Badge fromDTO(BadgeInputDTO badgeInputDTO) {
      return new Badge(badgeInputDTO.getName(), badgeInputDTO.getImageURL(), badgeInputDTO.getDescription());
   }

}
