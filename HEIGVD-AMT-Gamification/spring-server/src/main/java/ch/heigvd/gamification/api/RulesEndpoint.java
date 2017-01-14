/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : RuleEndPoint.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a REST API on a Rule
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.LocationRule;
import ch.heigvd.gamification.api.dto.RuleInputDTO;
import ch.heigvd.gamification.api.dto.RuleOutputDTO;
import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.Badge;
import ch.heigvd.gamification.model.PointScale;
import ch.heigvd.gamification.model.Rule;
import ch.heigvd.gamification.services.ApplicationRepository;
import ch.heigvd.gamification.services.BadgeRepository;
import ch.heigvd.gamification.services.PointScaleRepository;
import ch.heigvd.gamification.services.RuleRepository;
import ch.heigvd.gamification.services.TokenKeyTools;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
@RequestMapping("/rules")
public class RulesEndpoint implements RulesApi {

   BadgeRepository badgeRepository;
   PointScaleRepository pointScaleRepository;
   RuleRepository ruleRepository;
   ApplicationRepository applicationRepository;
   private final HttpServletRequest request;

   @Autowired
   RulesEndpoint(RuleRepository ruleRepository, ApplicationRepository applicationRepository,
           BadgeRepository badgesRepository, PointScaleRepository pointScaleRepository,
           HttpServletRequest request) {
      this.ruleRepository = ruleRepository;
      this.applicationRepository = applicationRepository;
      this.badgeRepository = badgesRepository;
      this.pointScaleRepository = pointScaleRepository;
      this.request = request;
   }

   @Override
   public ResponseEntity<List<RuleOutputDTO>> rulesGet(@RequestHeader("Authorization") String authenticationToken) {

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
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      
      // Get the application badges
      List<Rule> rules = application.getRules();

      // Return the BadgeOutputDTO
      List<RuleOutputDTO> rulesDTO = new ArrayList<>();
      for (int i = 0; i < rules.size(); i++) {
         rulesDTO.add(i, toDTO(rules.get(i)));
      }
      return new ResponseEntity<>(rulesDTO, HttpStatus.OK);
   }

   @Override
   @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> rulesIdDelete(@PathParam("id") Long id, @RequestHeader("Authorization") String authenticationToken) {

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
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Remove the rule whose id is provided
        Rule currentRule = application.getRule(id);
        if (currentRule == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        application.deleteRule(id);
        ruleRepository.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

   @Override
   @RequestMapping(method = RequestMethod.GET, value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
   public ResponseEntity<RuleOutputDTO> rulesIdGet(@PathParam("id") Long id, @RequestHeader("Authorization") String authenticationToken) {
      
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
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      
      // Check if the desired badge exists
      Rule rule = application.getRule(id);
      if (rule == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      // Return the badge DTO
      RuleOutputDTO ruleDTO = toDTO(rule);
      return new ResponseEntity<>(ruleDTO, HttpStatus.OK);

   }

   @Override
   @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
   public ResponseEntity<Void> rulesIdPut(@PathParam("id") Long id, @RequestBody RuleInputDTO rule, @RequestHeader("Authorization") String authenticationToken) {

      // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }
      
      final String name = rule.getRuleName();
      final String description = rule.getDescription();
      final String eventType = rule.getEventType();

      // Test if the request isn't valid (http error 422 unprocessable entity)
      boolean httpErrorUnprocessableEntity = false;
      
      // Check if name, description or event type is null
      if (name == null || description == null || eventType == null
              || rule.getPointScaleId() == null || rule.getBadgeId() == null) {
         httpErrorUnprocessableEntity = true;
      } // Check if name, description or eventType is empty
      else if (name.trim().isEmpty() || description.trim().isEmpty() || eventType.trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      } // Check if name length > 80 OR if description or imageURL length > 255
      else if (name.length() > 80 || description.length() > 255 || eventType.length() > 255) {
         httpErrorUnprocessableEntity = true;
      }
      
      // Get the application id from the JWT
      long applicationId = TokenKeyTools.parseJWT(authenticationToken);

      // Get the existing application
      Application application = applicationRepository.findOne(applicationId);

      // If application was deleted but the authentication token wasn't removed
      if (application == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      
      // Get the desired rule
      Rule currentRule = application.getRule(id);
      if (currentRule == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      // Check if the application name has changed
      if (!currentRule.getRuleName().equals(name)) {
         // Check if the new application name provided already exist
         Rule ruleSaved = application.getRule(name);
         if (ruleSaved != null) {
            httpErrorUnprocessableEntity = true;
         }
      }
      
      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }
      
      currentRule.setRuleName(rule.getRuleName());
      currentRule.setRuleDescription(rule.getDescription());
      currentRule.setPoints(rule.getPoints());
      application.putRule(currentRule);

      ruleRepository.save(currentRule);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
   }

   @Override
   @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<LocationRule> rulesPost(@RequestBody RuleInputDTO rule, @RequestHeader("Authorization") String authenticationToken) {

        // Let's find the target application the badge and the pointscale
        Badge targetBadge = badgeRepository.findOne(rule.getBadgeId());
        PointScale targetPointScale = pointScaleRepository.findOne(rule.getPointScaleId());

        // Check if the JWT isn't valid
        if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        final String name = rule.getRuleName();
        final String description = rule.getDescription();
        final String eventType = rule.getEventType();

        // Test if the request isn't valid (http error 422 unprocessable entity)
        boolean httpErrorUnprocessableEntity = false;

        // Check if name, description or event type is null
        if (name == null || description == null || eventType == null
                || rule.getPointScaleId() == null || rule.getBadgeId() == null) {
            httpErrorUnprocessableEntity = true;
        } // Check if name, description or eventType is empty
        else if (name.trim().isEmpty() || description.trim().isEmpty() || eventType.trim().isEmpty()) {
            httpErrorUnprocessableEntity = true;
        } // Check if name length > 80 OR if description or imageURL length > 255
        else if (name.length() > 80 || description.length() > 255 || eventType.length() > 255) {
            httpErrorUnprocessableEntity = true;
        }

        // Get the application id from the JWT
        long applicationId = TokenKeyTools.parseJWT(authenticationToken);

        // Get the existing application
        Application application = applicationRepository.findOne(applicationId);

        // If application was deleted but the authentication token wasn't removed
        if (application == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Check if application name already exists
        Rule currentRule = application.getRule(name);
        if (currentRule != null) {
            httpErrorUnprocessableEntity = true;
        }
        if (httpErrorUnprocessableEntity) {
            return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (targetBadge != null || targetPointScale != null) {

            Rule newRule = new Rule(rule.getRuleName(), application, targetBadge, targetPointScale);
            newRule.setRuleDescription(rule.getDescription());
            newRule.setPoints(rule.getPoints());
            newRule.setEventType(rule.getEventType());
            ruleRepository.save(newRule);

            Long newId = newRule.getId();

            StringBuffer location = request.getRequestURL();
            if (!location.toString().endsWith("/")) {
                location.append("/");
            }
            location.append(newId.toString());
            HttpHeaders headers = new HttpHeaders();
            headers.add("Location", location.toString());
            return new ResponseEntity<>(headers, HttpStatus.CREATED);
        }

        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);

    }

   public RuleOutputDTO toDTO(Rule rule) {
      RuleOutputDTO dto = new RuleOutputDTO();
      dto.setRuleId(String.valueOf(rule.getId()));
      dto.setName(rule.getRuleName());
      dto.setDescription(rule.getRuleDescription());
      dto.setPoints(rule.getPoints());
      return dto;
   }

   public Rule fromDTO(RuleInputDTO ruleInputDTO) {
      Rule newRule = new Rule();
      newRule.setRuleName(ruleInputDTO.getRuleName());
      newRule.setRuleDescription(ruleInputDTO.getDescription());
      newRule.setPoints(ruleInputDTO.getPoints());

      // /!\ NOT SURE IF IT'S NEEDED !!!
      newRule.setBadge(badgeRepository.findOne(ruleInputDTO.getBadgeId()));
      newRule.setPointScale(pointScaleRepository.findOne(ruleInputDTO.getPointScaleId()));
      return newRule;
   }

}
