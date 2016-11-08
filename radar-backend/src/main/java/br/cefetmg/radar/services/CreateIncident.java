
package br.cefetmg.radar.services;

import br.cefetmg.radar.dao.IncidentDAO;
import br.cefetmg.radar.dao.LocationDAO;
import br.cefetmg.radar.dao.TransportDAO;
import br.cefetmg.radar.entity.Incident;
import br.cefetmg.radar.entity.Location;
import br.cefetmg.radar.message.Result;
import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
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
            
            LocationDAO locationDAO = new LocationDAO();
            
            TransportDAO transportDAO = new TransportDAO();

            Incident newIncident = gson.fromJson(sb.toString(), Incident.class);
            
            if(newIncident.getArmed() > 0) newIncident.setReliability(newIncident.getReliability()+1);
            if(newIncident.getCriminals_transport() != null) newIncident.setReliability(newIncident.getReliability()+1);
            if(!newIncident.getDescription().equals("")) newIncident.setReliability(newIncident.getReliability()+1);
            if(!newIncident.getObjects_taken().equals("")) newIncident.setReliability(newIncident.getReliability()+1);
            if(!newIncident.getPolice_report().equals("")) newIncident.setReliability(newIncident.getReliability()+1);

            Date currentDate = new Date();
            
            long secondsdiff = Math.round((currentDate.getTime() - newIncident.getDate().getTime()) / (1000l));    
            
            if(secondsdiff >= 0){ //se a data inserida for válida, adiciona a ocorrência no banco
                newIncident.getDate().setHours(newIncident.getDate().getHours()+3);
                incidentDAO.createIncident(newIncident);
                out.println(gson.toJson(new Result(Result.OK)));
                
                List <Location> locations = locationDAO.getByLocation(newIncident.getLocation());
            
                if(locations.size() > 0){
                    SimpleDateFormat sdf = new SimpleDateFormat("dd/M/yyyy hh:mm");

                    String dateInString = sdf.format(newIncident.getDate());

                    String msg = "Data: " + dateInString + ".\n";

                    msg += "Local: " + newIncident.getLocation() + ".\n";

                    if(newIncident.getDescription() != null) msg += "Descrição: \"" + newIncident.getDescription() + "\"\n";

                    if(newIncident.getObjects_taken() != null) msg += "Objetos roubados: \"" + newIncident.getObjects_taken() + "\".\n";

                    msg += "Número de assaltantes: " + newIncident.getNum_criminals() + ".\n";

                    if(newIncident.isViolence()){
                        msg += "Houve violência.\n";
                    } else {
                        msg += "Não houve violência.\n";
                    }

                    msg += "Número de vítimas: " + newIncident.getNum_victims() + ".\n";

                    if(newIncident.getPolice_report()!= null) msg += "Código boletim de ocorrência: " + newIncident.getPolice_report() + ".\n";

                    switch(newIncident.getArmed()){
                        case 1: msg += "Os criminosos não estavam armados.\n"; break;
                        case 2: msg += "Os criminosos estavam armados com armas brancas.\n"; break;
                        case 3: msg += "Os criminosos estavam armados com armas de fogo.\n"; break;
                    }

                    if(newIncident.getCriminals_transport() != null){ 
                        msg += "Transporte dos criminosos: " + transportDAO.getById(newIncident.getCriminals_transport().getId()).getName() + ".\n";
                        transportDAO.openEntityManager();
                    }
                    msg += "Transporte da vítima: " + transportDAO.getById(newIncident.getVictims_transport().getId()).getName() + ".\n";

                    // Sender's email ID needs to be mentioned
                    String from = "testsplaycode@gmail.com";

                    String host = "smtp.gmail.com";

                    String password = "playcodetestes";

                    // Get system properties
                    Properties properties = System.getProperties();
                    properties.put("mail.smtp.starttls.enable", "true");
                    properties.put("mail.smtp.host", host);
                    properties.put("mail.smtp.user", from);
                    properties.put("mail.smtp.password", password);  //13/07/1996
                    properties.put("mail.smtp.port", 587);
                    properties.put("mail.smtp.auth", "true");

                    // Get the default Session object.
                    Session session = Session.getDefaultInstance(properties);

                    for(int i = 0; i < locations.size(); i++){
                        // Recipient's email ID needs to be mentioned.
                        String to = locations.get(i).getUser().getEmail();

                        try {
                            // Create a default MimeMessage object.
                            MimeMessage message = new MimeMessage(session);
                            // Set From: header field of the header.
                            message.setFrom(new InternetAddress(from));
                            // Set To: header field of the header.
                            message.addRecipient(Message.RecipientType.TO,
                                    new InternetAddress(to));
                            // Set Subject: header field
                            message.setSubject("Radar - Aviso de ocorrência.");
                            // Now set the actual message
                            message.setText("Foi registrada uma ocorrência em sua rota: \n\n\n\n" + msg);
                            // Send message
                            Transport transport = session.getTransport("smtp");
                            transport.connect(host, from, password);
                            transport.sendMessage(message, message.getAllRecipients());
                            transport.close();
                            //out.println(gson.toJson(new Result(Result.OK)));

                        } catch (MessagingException mex) {
                            StringBuilder error = new StringBuilder();

                            for (StackTraceElement element : mex.getStackTrace()) {
                                error.append(element.toString());
                                error.append("\n");    
                            }
                            out.println(gson.toJson(new Result(Result.ERRO, mex.getMessage() + "-" +  error.toString())));
                            response.setStatus(500);
                        }
                    }
                }
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
