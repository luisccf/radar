/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.Incident;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

/**
 *
 * @author rafae_000
 */
public class IncidentDAO {
    private EntityManager entityManager = null;
    
    public IncidentDAO() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public void createIncident(Incident incident) {
        try {
            entityManager.getTransaction().begin(); //inicia uma transação
            //associa o objeto ao entityManager fazendo com que ele passe a ser gerenciado
            entityManager.persist(incident);
            //confirma a transação e persiste o objeto no banco
            entityManager.getTransaction().commit();
        } catch (Exception ex) {
            entityManager.getTransaction().rollback();
            throw ex;
        } finally {
            entityManager.close();  //fecha o entityManager
        }
    }
    
    public List GetIncidents(){
        
        Query query = entityManager.createQuery("FROM Incident i");
        List<Incident> incidents = query.getResultList();  
        
        return incidents;
    }
    
    public List filterIncidents(String armed, String gender, String violence, String period_init, String period_end){
        
        Query query = entityManager.createQuery("FROM Incident i WHERE i.armed LIKE '" + armed + "'"
                + " and (i.violence = " + violence + ")"
                + " and i.user.gender.id LIKE '" + gender + "'"
                + " and TIME(i.date) < '" + period_end + "'" + "and TIME(i.date) > '" + period_init + "'");
        List<Incident> incidents = query.getResultList();  
        
        return incidents;
    }
    
}
