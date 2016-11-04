
package br.cefetmg.radar.services;

import br.cefetmg.radar.dao.IncidentDAO;
import br.cefetmg.radar.entity.Incident;
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


@WebServlet(name = "CreateIncident", urlPatterns = {"/createincident"})
public class CreateIncident extends HttpServlet {

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

            IncidentDAO incidentDAO = new IncidentDAO();

            Incident newIncident = gson.fromJson(sb.toString(), Incident.class);
            
            if(newIncident.getArmed() > 0) newIncident.setReliability(newIncident.getReliability()+1);
            if(newIncident.getCriminals_transport() != null) newIncident.setReliability(newIncident.getReliability()+1);
            if(newIncident.getDescription() != null) newIncident.setReliability(newIncident.getReliability()+1);
            if(newIncident.getNum_criminals() > 0) newIncident.setReliability(newIncident.getReliability()+1);
            if(newIncident.getNum_victims() > 0) newIncident.setReliability(newIncident.getReliability()+1);
            if(newIncident.getObjects_taken() != null) newIncident.setReliability(newIncident.getReliability()+1);
            if(newIncident.getPolice_report()!= null) newIncident.setReliability(newIncident.getReliability()+1);

            Date currentDate = new Date();
            
            long secondsdiff = Math.round((currentDate.getTime() - newIncident.getDate().getTime()) / (1000l));    
            
            if(secondsdiff >= 0){ //se a data inserida for válida, adiciona a ocorrência no banco
                newIncident.getDate().setHours(newIncident.getDate().getHours()+3);
                incidentDAO.createIncident(newIncident);
                out.println(gson.toJson(new Result(Result.OK)));
            } else {
                out.println(gson.toJson(new Result(Result.INVALID_DATE)));
                response.setStatus(400);
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
