package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.Service;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

/**
 *
 * @author rafae_000
 */
public class ServiceDAO {
    private EntityManager entityManager = null;
    
    public ServiceDAO() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public Service getById(int stateId) {
        Service service = null;
        
        try {
            entityManager.getTransaction().begin(); //inicia uma transação
            //associa o objeto ao entityManager fazendo com que ele passe a ser gerenciado
            service = entityManager.find(Service.class, stateId);
            
        } catch (Exception ex) {
            entityManager.getTransaction().rollback();
            throw ex;
        } finally {
            entityManager.close();  //fecha o entityManager
        }
        
        return service;
    }
}
