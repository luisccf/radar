/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.Transport;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

/**
 *
 * @author rafae_000
 */
public class TransportDAO {
    private EntityManager entityManager = null;
    
    public TransportDAO() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public List GetTransports(){
        
        Query query = entityManager.createQuery("FROM Transport t");
        List<Transport> transports = query.getResultList();  
        
        return transports;
    }
}
