/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.Color;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

/**
 *
 * @author rafae_000
 */
public class ColorDAO {
    private EntityManager entityManager = null;
    
    public ColorDAO() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public List GetColors(){
        
        Query query = entityManager.createQuery("FROM Color c");
        List<Color> colors = query.getResultList();  
        
        return colors;
    }
}
