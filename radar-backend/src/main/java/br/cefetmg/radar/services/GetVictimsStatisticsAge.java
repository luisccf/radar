package br.cefetmg.radar.services;

import br.cefetmg.radar.dao.IncidentDAO;
import br.cefetmg.radar.entity.Statistic;
import br.cefetmg.radar.message.Result;
import br.cefetmg.radar.util.typeadapter.HibernateProxyTypeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "GetVictimsStatisticsAge", urlPatterns = {"/statistics/victims/age"})
public class GetVictimsStatisticsAge extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        GsonBuilder b = new GsonBuilder();
        
        b.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);
        
        Gson gson = b.create();

        response.setContentType("text/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        try {
            
            IncidentDAO incidentDAO = new IncidentDAO();
            
            ArrayList<Statistic> stats = new ArrayList<Statistic>();
            
            Statistic stat1 = new Statistic();
            Statistic stat2 = new Statistic();
            Statistic stat3 = new Statistic();
            Statistic stat4 = new Statistic();
            Statistic stat5 = new Statistic();
            Statistic stat6 = new Statistic();
            
            stat1.setId(1);
            stat1.setName("13 a 24");
            stat1.setValue((int)incidentDAO.CountIncidentsByAge(13, 24));
            stats.add(stat1);
            
            stat2.setId(2);
            stat2.setName("25 a 36");
            stat2.setValue((int)incidentDAO.CountIncidentsByAge(25, 36));
            stats.add(stat2);
            
            stat3.setId(3);
            stat3.setName("37 a 48");
            stat3.setValue((int)incidentDAO.CountIncidentsByAge(37, 48));
            stats.add(stat3);
            
            stat4.setId(4);
            stat4.setName("49 a 60");
            stat4.setValue((int)incidentDAO.CountIncidentsByAge(49, 60));
            stats.add(stat4);
            
            stat5.setId(5);
            stat5.setName("61 a 72");
            stat5.setValue((int)incidentDAO.CountIncidentsByAge(61, 72));
            stats.add(stat5);
            
            stat6.setId(6);
            stat6.setName("maior que 72");
            stat6.setValue((int)incidentDAO.CountIncidentsByAge(72, 1000));
            stats.add(stat6);
            
            out.println(gson.toJson(stats));
            
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
