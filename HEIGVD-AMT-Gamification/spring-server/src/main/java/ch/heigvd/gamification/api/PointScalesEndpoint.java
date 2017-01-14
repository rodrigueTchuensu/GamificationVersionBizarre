/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : PointScalesEndPoint.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a REST API on a pointScale
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.LocationPointScale;
import ch.heigvd.gamification.api.dto.PointScaleInputDTO;
import ch.heigvd.gamification.api.dto.PointScaleOutputDTO;
import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.PointScale;
import ch.heigvd.gamification.services.ApplicationRepository;
import ch.heigvd.gamification.services.PointScaleRepository;
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
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */

@RestController
@RequestMapping("/pointScales")
public class PointScalesEndpoint implements PointScalesApi{
    private final HttpServletRequest request;
    private final PointScaleRepository pointScaleRepository;
    private final ApplicationRepository applicationRepository;
    
    @Autowired
    PointScalesEndpoint(HttpServletRequest request, PointScaleRepository pointScaleRepository, 
                        ApplicationRepository applicationRepository){
        this.pointScaleRepository = pointScaleRepository;
        this.request = request;
        this.applicationRepository = applicationRepository;
    }
    

    @Override
    public ResponseEntity<List<PointScaleOutputDTO>> pointScalesGet(@RequestHeader("Authorization") String authenticationToken) {
       
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
      List<PointScale> pointScales = application.getPointScales();
       

        List<PointScaleOutputDTO> pointScalesDTO = new ArrayList<>();
        for (int i=0; i<pointScales.size(); i++){
            pointScalesDTO.add(i, toDTO(pointScales.get(i)));
        }
        return new ResponseEntity<>(pointScalesDTO, HttpStatus.OK); 
       
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> pointScalesIdDelete(@PathVariable("id") Long id, @RequestHeader("Authorization") String authenticationToken) {

        //PointScale currentPointScale = pointScaleRepository.findOne(Long.valueOf(id));
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

        // Remove the badge whose id is provided
        PointScale currentPointScale = application.getPointScale(id);

        if (currentPointScale == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        pointScaleRepository.delete(id);
        application.deletePointScale(applicationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

    @Override
    @RequestMapping(method = RequestMethod.GET, value = "/{id}")
    public ResponseEntity<PointScaleOutputDTO> pointScalesIdGet(@PathVariable("id") Long id, @RequestHeader("Authorization") String authenticationToken) {
        
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
      PointScale pointScale = application.getPointScale(id);
        
        if(pointScale== null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // Return the pointScale DTO
        PointScaleOutputDTO pointScaleDTO = toDTO(pointScale);
        return new ResponseEntity<>(pointScaleDTO, HttpStatus.OK);
        }

    @Override
    @RequestMapping(value = "/{id}",method = RequestMethod.PUT)
    public ResponseEntity<Void> pointScalesIdPut(@PathVariable("id") Long id , @RequestBody PointScaleInputDTO pointScale, @RequestHeader("Authorization") String authenticationToken) {
        
      // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }
      
      final String name = pointScale.getName();
      final String description = pointScale.getDescription();
      final int coefficient = pointScale.getCoefficient();

      // Test if the request isn't valid (http error 422 unprocessable entity)
      boolean httpErrorUnprocessableEntity = false;

      // TODO: Check if the pointScale name is already in this application   
      // Check if name, description or coefficient is null
      if (name == null || description == null || pointScale.getCoefficient() == null) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name or description is empty
      else if (name.trim().isEmpty() || description.trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name length > 80 OR if description length > 255 OR if coefficient > 1000 OR if coefficient < 1
      else if (name.length() > 80 || description.length() > 255 || coefficient > 1000 || coefficient < 1) {
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
      
      // Get the desired badge
      PointScale currentPointScale = application.getPointScale(id);
      
       // Check if the application name has changed
      if (!currentPointScale.getName().equals(name)) {
         // Check if the new application name provided already exist
         PointScale pointScaleSaved = application.getPointScale(name);
         if (pointScaleSaved != null) {
            httpErrorUnprocessableEntity = true;
         }
      }

      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }
      
      currentPointScale.setName(pointScale.getName());
      currentPointScale.setDescription(pointScale.getDescription());
      currentPointScale.setCoefficient(pointScale.getCoefficient());

      application.putPointScale(currentPointScale);
      //pointScaleRepository.save(currentPointScale);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<LocationPointScale> pointScalesPost(@RequestBody PointScaleInputDTO pointScale, @RequestHeader("Authorization") String authenticationToken) {
        
        // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      final String name = pointScale.getName();
      final String description = pointScale.getDescription();
      final int coefficient = pointScale.getCoefficient();

      // Test if the request isn't valid (http error 422 unprocessable entity)
      boolean httpErrorUnprocessableEntity = false;

      // Check if name, description or coefficient is null
      if (name == null || description == null || pointScale.getCoefficient() == null) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name, description or imageURL is empty
      else if (name.trim().isEmpty() || description.trim().isEmpty() || Integer.toString(coefficient).trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name length > 80 OR if description or coefficient length > 255
      else if (name.length() > 80 || description.length() > 255 || Integer.toString(coefficient).length() > 255) {
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
      PointScale currentPointScale = application.getPointScale(name);
      if (currentPointScale != null) {
         httpErrorUnprocessableEntity = true;
      }

      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      PointScale newPointScale = fromDTO(pointScale);
      newPointScale.setApplication(application);
      newPointScale = pointScaleRepository.save(newPointScale);
      application.addPointScales(newPointScale);
      Long newId = newPointScale.getId();

      StringBuffer location = request.getRequestURL();
      if (!location.toString().endsWith("/")) {
         location.append("/");
      }
      location.append(newId.toString());
      HttpHeaders headers = new HttpHeaders();
      headers.add("Location", location.toString());
      return new ResponseEntity<>(headers, HttpStatus.CREATED);
        
    }

   public PointScaleOutputDTO toDTO(PointScale pointScale){
        PointScaleOutputDTO pointScaleDTO = new PointScaleOutputDTO();
        pointScaleDTO.setPointScaleId(String.valueOf(pointScale.getId()));
        pointScaleDTO.setName(pointScale.getName());
        pointScaleDTO.setCoefficient(pointScale.getCoefficient());
        pointScaleDTO.setDescription(pointScale.getDescription());        
        return pointScaleDTO;
    }
   
   public PointScale fromDTO(PointScaleInputDTO badgeInputDTO){
        return new PointScale(badgeInputDTO.getName(), badgeInputDTO.getCoefficient(), badgeInputDTO.getDescription());
    } 
    
}
