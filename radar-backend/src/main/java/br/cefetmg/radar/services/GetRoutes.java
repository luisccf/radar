package br.cefetmg.radar.services;

import br.cefetmg.radar.dao.IncidentDAO;
import br.cefetmg.radar.dao.LocationDAO;
import br.cefetmg.radar.entity.Location;
import br.cefetmg.radar.message.Result;
import br.cefetmg.radar.message.ResultRoute;
import br.cefetmg.radar.util.typeadapter.HibernateProxyTypeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "GetRoutes", urlPatterns = {"/getroutes"})
public class GetRoutes extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        GsonBuilder b = new GsonBuilder();
        
        b.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);
        
        Gson gson = b.create();

        response.setContentType("text/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        try {
            
            ArrayList <ResultRoute> result = new ArrayList<ResultRoute>();
            
            int userid = 1;
            
            LocationDAO locationDAO = new LocationDAO();
            
            IncidentDAO incidentDAO = new IncidentDAO();
            
            int num_routes = locationDAO.maxRouteId(userid);
            
            for(int i = 1; i <= num_routes; i++){
                ResultRoute resultroute = new ResultRoute();
                int incidentcounter = 0;
                locationDAO.openEntityManager();
                List <Location> route = locationDAO.GetRoutesById(i, userid);
                
                for(int j = 0; j < route.size(); j++){
                    route.get(j).setUser(null);
                    long incidents = incidentDAO.CountIncidentsByLocation(route.get(j).getName());
                    incidentcounter += incidents;
                    incidentDAO.openEntityManager();
                }
                
                resultroute.setRoute(route);
                resultroute.setNumincidents(incidentcounter);
                result.add(resultroute);
            }

            out.println(gson.toJson(result));
            
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
