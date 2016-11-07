package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.Location;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class LocationDAO {
    private EntityManager entityManager = null;
    
    public LocationDAO() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public void openEntityManager(){
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public void createStreet(Location location) {
        try {
            entityManager.getTransaction().begin(); //inicia uma transação
            //associa o objeto ao entityManager fazendo com que ele passe a ser gerenciado
            entityManager.persist(location);
            //confirma a transação e persiste o objeto no banco
            entityManager.getTransaction().commit();
        } catch (Exception ex) {
            entityManager.getTransaction().rollback();
            throw ex;
        } finally {
            entityManager.close();  //fecha o entityManager
        }
    }
    
    public List <Location> getByLocation(String location){
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Location> criteria = cb.createQuery( Location.class );
        Root<Location> userRoot = criteria.from( Location.class );
        criteria.select( userRoot );
        criteria.where( cb.equal( userRoot.get( "name" ), location ) );
        List<Location> locations = entityManager.createQuery( criteria ).getResultList();
        
        return locations;
        
    }
}
