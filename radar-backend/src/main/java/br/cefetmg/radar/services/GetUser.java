/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package br.cefetmg.radar.services;

import br.cefetmg.radar.entity.User;
import br.cefetmg.radar.dao.UserDAO;
import br.cefetmg.radar.message.Result;
import com.google.gson.Gson;
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
        
        Gson gson = new Gson();

        StringBuilder sb = new StringBuilder();
        BufferedReader br = request.getReader();
        String str;
        while( (str = br.readLine()) != null ){
            sb.append(str);
        }
        
        User newUser = gson.fromJson(sb.toString(), User.class);
        
        try (PrintWriter out = response.getWriter()) {
            try {
                UserDAO userDAO = new UserDAO();
                User user = userDAO.getByUsername(newUser.getUsername());
                
                if(user != null){
                    out.println(gson.toJson(new Result(Result.USERNAME_EXISTS)));
                }else{
                    out.println(gson.toJson(new Result(Result.USERNAME_DONT_EXISTS)));
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
