/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.cefetmg.radar.services;

import br.cefetmg.radar.entity.User;
import br.cefetmg.radar.dao.UserDAO;
import br.cefetmg.radar.message.Result;
import br.cefetmg.radar.util.typeadapter.HibernateProxyTypeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Ismael
 */
@WebServlet(name = "GetUser", urlPatterns = {"/getuser"})
public class GetUser extends HttpServlet {

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
        response.setContentType("text/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");
        
        GsonBuilder b = new GsonBuilder();
        
        b.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);
        
        Gson gson = b.create();
        
        int iduser = Integer.parseInt(request.getParameter("id"));
        
        try (PrintWriter out = response.getWriter()) {
            try {
                UserDAO userDAO = new UserDAO();
                User user = userDAO.getById(iduser);
                
                if(user != null){
                    user.setIncidents(null);
                    
                    if(user.getColor() != null){
                        user.getColor().setUsers(null);
                    }

                    if(user.getGender() != null){
                        user.getGender().setUsers(null);
                    }
                    
                    if(user.getLocations() != null){
                        user.setLocations(null);
                    }
                    
                    out.println(gson.toJson(user));
                }else{
                    out.println(gson.toJson(new Result(Result.USER_NOT_FOUND)));
                }
            } catch (Exception ex) {
                StringBuilder error = new StringBuilder();
        
                for (StackTraceElement element : ex.getStackTrace()) {
                    error.append(element.toString());
                    error.append("\n");    
                }
                out.println(gson.toJson(new Result(Result.ERRO, error.toString())));
                response.setStatus(500);
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
