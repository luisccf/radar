package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.Incident;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

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
                + " and (i.user.gender.id LIKE '" + gender + ")"
                + " and TIME(i.date) < '" + period_end + "'" + "and TIME(i.date) > '" + period_init + "'");
        List<Incident> incidents = query.getResultList();  
        
        return incidents;
    }
    
    public long CountIncidentsByGenderId(int id){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.user.gender.id=:idgender");
        query.setParameter("idgender", id);
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByColorId(int id){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.user.color.id=:idcolor");
        query.setParameter("idcolor", id);
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByAge(int age1, int age2){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE floor(datediff(curdate(), i.user.birth) / 365) >=" + age1
                + " and floor(datediff(curdate(), i.user.birth) / 365) <=" + age2);
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByHeight(int height){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.user.height=:height");
        query.setParameter("height", height);
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByAloneVictims(){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.num_victims=1");
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByNotAloneVictims(){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.num_victims>1");
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByAloneCriminals(){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.num_criminals=1");
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByNotAloneCriminals(){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.num_criminals>1");
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByArmedCriminals(int guntype){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.armed=:guntype");
        query.setParameter("guntype", guntype);
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByHavingPoliceReport(){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.police_report!=''");
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByNotHavingPoliceReport(){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.police_report=''");
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByCriminalsTransportId(int id){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.criminals_transport.id=:idtransport");
        query.setParameter("idtransport", id);
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByVictimsTransportId(int id){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE i.victims_transport.id=:idtransport");
        query.setParameter("idtransport", id);
        
        return (long) query.getSingleResult();
    }
    
    public long CountIncidentsByPeriod(String period_init, String period_end){
        
        Query query = entityManager.createQuery("SELECT count(*) FROM Incident as i WHERE TIME(i.date) < '" + period_end + "'" + "and TIME(i.date) > '" + period_init + "'");
        
        return (long) query.getSingleResult();
    }
    
}
