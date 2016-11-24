package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.Statistic;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class StatisticDAO {
    
    private EntityManager entityManager = null;
    
    public StatisticDAO() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public void openEntityManager(){
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public Statistic getByName(String name){
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Statistic> criteria = cb.createQuery( Statistic.class );
        Root<Statistic> statisticRoot = criteria.from( Statistic.class );
        criteria.select( statisticRoot );
        criteria.where( cb.equal( statisticRoot.get( "name" ), name ) );
        List<Statistic> statistics = entityManager.createQuery( criteria ).getResultList();
        
        if(statistics.size() > 0) {
            return statistics.get(0);
        } else {
            return null;
        }
        
    }
    
    public void createStatistic(Statistic newStatistic) {
        try {
            entityManager.getTransaction().begin(); //inicia uma transação
            //associa o objeto ao entityManager fazendo com que ele passe a ser gerenciado
            entityManager.persist(newStatistic);
            //confirma a transação e persiste o objeto no banco
            entityManager.getTransaction().commit();
        } catch (Exception ex) {
            entityManager.getTransaction().rollback();
            throw ex;
        } finally {
            entityManager.close();  //fecha o entityManager
        }
    }
    
    public void updatestatistic(Statistic newStatistic) {
        try {
            entityManager.getTransaction().begin();
            Statistic statisticPersisted = entityManager.find(Statistic.class, newStatistic.getId());
            if (statisticPersisted != null) {
                statisticPersisted.setValue(statisticPersisted.getValue()+1);
            } else {
                System.out.println("Não foi possível encontrar o objeto com o nome '" + newStatistic.getName() + "'");
            }
            entityManager.getTransaction().commit();
        } catch (Exception ex) {
            entityManager.getTransaction().rollback();
            throw ex;
        } finally {
            entityManager.close();
        }
    }
}
