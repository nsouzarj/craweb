package br.adv.cra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idusuario")
    private Long id;
    
    private String login;
    
    private String senha;
    
    private String nomecompleto;
    
    private String emailprincipal;
    
    private String emailsecundario;
    
    private String emailresponsavel;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idcorrespondente")
    private Correspondente correspondente;
    
    private Integer tipo; // 1-Adm, 2-Advgodado, 3-Correspondente
    
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime dataentrada;
    
    private boolean ativo;
}