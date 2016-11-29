/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetmg.radar.services;

import br.cefetmg.radar.entity.User;
import br.cefetmg.radar.dao.UserDAO;
import br.cefetmg.radar.message.Result;
import br.cefetmg.radar.util.cryptography.MD5;
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


@WebServlet(urlPatterns = {"/createuser"})
public class CreateUser extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();

        response.setContentType("text/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");

        StringBuilder sb = new StringBuilder();
        BufferedReader br = request.getReader();
        String str;
        while ((str = br.readLine()) != null) {
            sb.append(str);
        }

        PrintWriter out = response.getWriter();
        try {

            UserDAO userDAO = new UserDAO();

            User newUser = gson.fromJson(sb.toString(), User.class);

            Date currentDate = new Date();
            
            if (newUser.getUsername() == null){
                if (userDAO.getByEmail(newUser.getEmail()) == null){
                    newUser.setActive(true);
                    newUser.setTries(0);

                    if(newUser.getHeight()== 0){
                        newUser.setHeight(-1);
                    }

                    userDAO.createUser(newUser);

                    out.println(gson.toJson(new Result(Result.OK)));
                } else {
                    out.println(gson.toJson(new Result(Result.EMAIL_EXISTS)));
                    response.setStatus(490);
                }
            } else {
                long yearsdiff = Math.round((currentDate.getTime() - newUser.getBirth().getTime()) / (1000l*60*60*24*365));
                if (userDAO.getByUsername(newUser.getUsername()) == null) {
                    if (userDAO.getByEmail(newUser.getEmail()) == null){
                        if (yearsdiff > 13){
                            newUser.setPassword(MD5.crypt(newUser.getPassword()));
                            newUser.setActive(true);
                            newUser.setTries(0);

                            if(newUser.getHeight()== 0){
                                newUser.setHeight(-1);
                            }

                            userDAO.createUser(newUser);

                            out.println(gson.toJson(new Result(Result.OK)));
                        } else {
                            out.println(gson.toJson(new Result(Result.TOO_YOUNG)));
                            response.setStatus(489);
                        }
                    } else {
                        out.println(gson.toJson(new Result(Result.EMAIL_EXISTS)));
                        response.setStatus(490);
                    }                       
                } else {
                    out.println(gson.toJson(new Result(Result.USERNAME_EXISTS)));
                    response.setStatus(491);
                }
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

        out.close();
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
    /*
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.processRequest(request, response);
    }
    */

    /*
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    }
    */

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
        this.processRequest(request, response);
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
