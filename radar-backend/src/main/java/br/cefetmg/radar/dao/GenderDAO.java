package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.Gender;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

/**
 *
 * @author rafae_000
 */
public class GenderDAO {
    private EntityManager entityManager = null;
    
    public GenderDAO() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public List GetGenders(){
        
        Query query = entityManager.createQuery("FROM Gender g");
        List<Gender> genders = query.getResultList();  
        
        return genders;
    }
}
