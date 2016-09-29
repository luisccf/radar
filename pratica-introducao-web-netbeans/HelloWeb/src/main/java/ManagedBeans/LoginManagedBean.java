/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ManagedBeans;

import DAO.UsuarioDAO;
import entity.Usuario;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.context.FacesContext;
   
  @ManagedBean(name = "LoginMB")
  @ViewScoped
  public class LoginManagedBean {
   
        private UsuarioDAO usuarioDAO = new UsuarioDAO();
        private Usuario usuario = new Usuario();
        
        public String envia() {
              
              usuario = usuarioDAO.getUsuario(usuario.getNomeUsuario(), usuario.getSenha());
              if (usuario == null) {
                    usuario = new Usuario();
                    FacesContext.getCurrentInstance().addMessage(
                               null,
                               new FacesMessage(FacesMessage.SEVERITY_ERROR, "Usuário não encontrado!",
                                           "Erro no Login!"));
                    return null;
              } else {
                    return "/main";
              }
              
              
        }
   
        public Usuario getUsuario() {
              return usuario;
        }
   
        public void setUsuario(Usuario usuario) {
              this.usuario = usuario;
        }
  }
