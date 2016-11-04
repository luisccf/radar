package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.Street;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;


public class StreetDAO {
    private EntityManager entityManager = null;
    
    public StreetDAO() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public void openEntityManager(){
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public void createStreet(Street street) {
        try {
            entityManager.getTransaction().begin(); //inicia uma transação
            //associa o objeto ao entityManager fazendo com que ele passe a ser gerenciado
            entityManager.persist(street);
            //confirma a transação e persiste o objeto no banco
            entityManager.getTransaction().commit();
        } catch (Exception ex) {
            entityManager.getTransaction().rollback();
            throw ex;
        } finally {
            entityManager.close();  //fecha o entityManager
        }
    }
}
