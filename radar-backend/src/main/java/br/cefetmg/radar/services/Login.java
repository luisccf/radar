/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetmg.radar.services;

import br.cefetmg.radar.dao.UserDAO;
import br.cefetmg.radar.entity.User;
import br.cefetmg.radar.message.Result;
import br.cefetmg.radar.util.cryptography.MD5;
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
 * @author Rafael
 */
@WebServlet(name = "Login", urlPatterns = {"/login"})
public class Login extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        Gson gson = new Gson();

        response.setContentType("text/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");

        StringBuilder sb = new StringBuilder();
        BufferedReader br = request.getReader();
        String str;
        while( (str = br.readLine()) != null ){
            sb.append(str);
        }
        
        try (PrintWriter out = response.getWriter()) {
            try {
                
                UserDAO userDAO = new UserDAO();
                User user = gson.fromJson(sb.toString(), User.class);
                
                if(userDAO.getByEmail(user.getEmail()) != null){
                    user.setPassword(MD5.crypt(user.getPassword()));
                    if (user.getPassword().equals(userDAO.getByEmail(user.getEmail()).getPassword())){                                                          
                        out.println(gson.toJson(new Result(Result.OK)));
                    } else {
                        out.println(gson.toJson(new Result(Result.EMAIL_OR_PASSWORD_WRONG)));
                    }
                } else {
                    out.println(gson.toJson(new Result(Result.EMAIL_OR_PASSWORD_WRONG)));
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