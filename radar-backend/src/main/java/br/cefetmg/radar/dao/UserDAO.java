/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetmg.radar.dao;

import br.cefetmg.radar.entity.User;
import br.cefetmg.radar.exception.ConfigurationException;
import br.cefetmg.radar.util.cryptography.MD5;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class UserDAO { 
    private EntityManager entityManager = null;
    
    public UserDAO() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public void openEntityManager(){
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("hibernate");
        entityManager = entityManagerFactory.createEntityManager();
    }
    
    public void createUser(User user) {
        try {
            entityManager.getTransaction().begin(); //inicia uma transação
            //associa o objeto ao entityManager fazendo com que ele passe a ser gerenciado
            entityManager.persist(user);
            //confirma a transação e persiste o objeto no banco
            entityManager.getTransaction().commit();
        } catch (Exception ex) {
            entityManager.getTransaction().rollback();
            throw ex;
        } finally {
            entityManager.close();  //fecha o entityManager
        }
    }

    public User getById(int idCliente) {
        User user = null;
        
        try {
            entityManager.getTransaction().begin(); //inicia uma transação
            //associa o objeto ao entityManager fazendo com que ele passe a ser gerenciado
            user = entityManager.find(User.class, idCliente);
            
        } catch (Exception ex) {
            entityManager.getTransaction().rollback();
            throw ex;
        } finally {
            entityManager.close();  //fecha o entityManager
        }
        
        return user;
    }
    
    
    public User getByUsername(String username){
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> criteria = cb.createQuery( User.class );
        Root<User> userRoot = criteria.from( User.class );
        criteria.select( userRoot );
        criteria.where( cb.equal( userRoot.get( "username" ), username ) );
        List<User> users = entityManager.createQuery( criteria ).getResultList();
        
        if(users.size() > 0) {
            return users.get(0);
        } else {
            return null;
        }
        
    }
    
    public User getByEmail(String email) throws ConfigurationException{
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> criteria = cb.createQuery( User.class );
        Root<User> userRoot = criteria.from( User.class );
        criteria.select( userRoot );
        criteria.where( cb.equal( userRoot.get( "email" ), email ) );
        List<User> users = entityManager.createQuery( criteria ).getResultList();
        
        if(users.size() == 1) {
            return users.get(0);
        } else if(users.size() == 0) {
            return null;
        } else {
            throw new ConfigurationException(String.format("There are more then one user with the e-mail '{0}'.", email));
        }
        
    }
    
    public void updateUser(User newUser) {
        try {
            entityManager.getTransaction().begin();
            User userPersisted = entityManager.find(User.class, newUser.getId());
            if (userPersisted != null) {
                userPersisted.setUsername(newUser.getUsername());
                userPersisted.setPassword(MD5.crypt(newUser.getPassword()));
                userPersisted.setEmail(newUser.getEmail());
                userPersisted.setBirth(newUser.getBirth());
                userPersisted.setActive(newUser.getActive());
                userPersisted.setColor(newUser.getColor());
                userPersisted.setTries(newUser.getTries());

                if(newUser.getHeight() == 0){
                    userPersisted.setHeight(-1);
                } else {
                    userPersisted.setHeight(newUser.getHeight());
                }
                
            } else {
                System.out.println("Não foi possível encontrar o dependente com o username '" + newUser.getUsername() + "'");
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
