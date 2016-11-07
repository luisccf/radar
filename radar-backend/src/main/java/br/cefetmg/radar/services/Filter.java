/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.cefetmg.radar.services;

import br.cefetmg.radar.dao.IncidentDAO;
import br.cefetmg.radar.entity.Incident;
import br.cefetmg.radar.message.Result;
import br.cefetmg.radar.util.typeadapter.HibernateProxyTypeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author rafae_000
 */
@WebServlet(name = "Filter", urlPatterns = {"/filterincidents"})
public class Filter extends HttpServlet {

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
        
        GsonBuilder b = new GsonBuilder();
        
        b.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);
        
        Gson gson = b.create();

        response.setContentType("text/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        
        try{
            IncidentDAO incidentDAO = new IncidentDAO();
            
            int aux1 = Integer.parseInt(request.getParameter("armed"));
            String armed = "";
            switch(aux1){
                case -1: armed += "%"; break;
                case 1: armed += "1"; break;
                case 2: armed += "2"; break;
                case 3: armed += "3"; break;
            }
            
            int gender_id = Integer.parseInt(request.getParameter("gender"));
            String gender = "";
            switch(gender_id){
                case 0: gender += "%"; break;
                default: gender += Integer.toString(gender_id);
            }
            
            String violence = request.getParameter("violence");
            if(violence.equals("-1")){
                violence = "false or i.violence = true";
            } else if (violence.equalsIgnoreCase("false")){
                violence = "false";
            } else if (violence.equalsIgnoreCase("true")){
                violence = "true";
            }
            int period = Integer.parseInt(request.getParameter("period"));
            String period_init = "";
            String period_end = "";
            
            switch(period){
                case 0:
                    period_init += "00:00";
                    period_end += "23:59";
                    break;
                case 1:
                    period_init += "00:01";
                    period_end += "06:00";
                    break;
                case 2:
                    period_init += "06:01";
                    period_end += "12:00";
                    break;
                case 3:
                    period_init += "12:01";
                    period_end += "18:00";
                    break;
                case 4:
                    period_init += "18:01";
                    period_end += "00:00";
                    break;
            }
            
            List <Incident> list = incidentDAO.filterIncidents(armed, gender, violence, period_init, period_end);
            
            for(int i = 0; i < list.size(); i++){
                if(list.get(i).getUser() != null){
                    list.get(i).getUser().setIncidents(null);
                    
                    if(list.get(i).getUser().getColor() != null){
                        list.get(i).getUser().getColor().setUsers(null);
                    }

                    if(list.get(i).getUser().getGender() != null){
                        list.get(i).getUser().getGender().setUsers(null);
                    }
                    
                    if(list.get(i).getUser().getLocations() != null){
                        list.get(i).getUser().setLocations(null);
                    }
                }
            }
            
            out.println(gson.toJson(list));
            
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
