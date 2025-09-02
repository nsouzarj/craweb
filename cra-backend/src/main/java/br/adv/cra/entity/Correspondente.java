package br.adv.cra.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "correspondente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Correspondente implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idcorrespondente")
    private Long id;
    
    private String nome;
    
    private String responsavel;
    
    private String cpfcnpj;
    
    private String oab;
    
    @JsonProperty("tipo")
    private String tipocorrepondente;
    
    private String telefoneprimario;
    
    private String telefonesecundario;
    
    private String telefonecelularprimario;
    
    private String telefonecelularsecundario;
    
    private String emailprimario;
    
    private String emailsecundario;
    
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime datacadastro;
    
    private boolean ativo;
    
    @JsonProperty("observacoes")
    private String observacao;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "enderecos_id")
    @JsonProperty("endereco")
    private Endereco enderecos;
    
    private boolean aplicaregra1;
    
    private boolean aplicaregra2;
    
    // Adding the inverse relationship with Solicitacao
    @OneToMany(mappedBy = "correspondente", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("correspondente")
    private List<Solicitacao> solicitacoes;
}