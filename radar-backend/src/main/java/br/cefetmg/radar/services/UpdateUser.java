/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetmg.radar.services;

import br.cefetmg.radar.dao.UserDAO;
import br.cefetmg.radar.entity.User;
import br.cefetmg.radar.message.Result;
import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author rafae_000
 */
@WebServlet(name = "UpdateUser", urlPatterns = {"/updateuser"})
public class UpdateUser extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("text/html;charset=UTF-8");
        
        Gson gson = new Gson();
        
        UserDAO userDAO = new UserDAO();

        StringBuilder sb = new StringBuilder();
        BufferedReader br = request.getReader();
        String str;
        while( (str = br.readLine()) != null ){
            sb.append(str);
        }
        
        User newUser = gson.fromJson(sb.toString(), User.class);
        
        try (PrintWriter out = response.getWriter()) {
           try {
               
               Date currentDate = new Date();
               
               long diff = Math.round((currentDate.getTime() - newUser.getBirth().getTime()) / (1000l*60*60*24*365));
               
               User userGotByUsername = userDAO.getByUsername(newUser.getUsername());
               User userGotByEmail = userDAO.getByEmail(newUser.getEmail());
               User userGotById = userDAO.getById(newUser.getId());
            
                if(userGotById != null){
                    if (newUser.getPassword().length() >= 4) {
                        if (newUser.getUsername().length() >= 4) {
                            if (userGotByUsername == null || userGotById.getUsername().equals(newUser.getUsername())){
                                if(userGotByEmail == null || userGotById.getEmail().equals(newUser.getEmail())){
                                    if(diff > 13){
                                        newUser.setActive(true);
                                        userDAO.openEntityManager();
                                        userDAO.updateUser(newUser);    //atualiza no banco de dados
                                        out.println(gson.toJson(new Result(Result.OK)));
                                    } else {
                                        out.println(gson.toJson(new Result(Result.TOO_YOUNG)));
                                    }
                                } else {
                                    out.println(gson.toJson(new Result(Result.EMAIL_EXISTS)));
                                }                       
                            } else {
                                out.println(gson.toJson(new Result(Result.USERNAME_EXISTS)));
                            }
                        } else {
                            out.println(gson.toJson(new Result(Result.SHORT_USERNAME)));
                        }
                    } else {
                        out.println(gson.toJson(new Result(Result.SHORT_PASSWORD)));
                    }      
                } else {
                    out.println(gson.toJson(new Result(Result.USER_DOESNT_EXISTS)));
                }
                
            } catch (Exception ex) {
                out.println(gson.toJson(new Result(Result.ERRO, ex.getMessage())));
                ex.printStackTrace();
            }
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}