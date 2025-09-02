package br.adv.cra.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Solicitacao implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idsolicitacao")
    private Long id;
    
    private Integer referenciasolicitacao;
    
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime datasolictacao;
    
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime dataconclusao;
    
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime dataprazo;
    
    @Column(length = 600, columnDefinition = "Text")
    private String observacao;
    
    @Column(length = 600, columnDefinition = "Text")
    private String instrucoes;
    
    @Column(length = 600, columnDefinition = "Text")
    private String complemento;
    
    @Column(length = 600, columnDefinition = "Text")
    private String justificativa;
    
    @Column(length = 600, columnDefinition = "Text")
    private String tratposaudiencia; //Tratamento pos audiencia
    
    @Column(length = 30)
    private String numcontrole;
    
    private boolean tempreposto;
    
    private boolean convolada;
    
    @Column(nullable = true, length = 10)
    private String horaudiencia;
    
    @Column(nullable = true, length = 20)
    private String statusexterno; // CONFIRMAR - REJEITAR

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idprocesso")
    private Processo processo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idrenumeracao")
    private Renumeracao renumeracao;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idstatus")
    private StatusSolicitacao statusSolicitacao;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idcomarca")
    private Comarca comarca;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idformulario")
    private FormularioAudiencia formularioAudiencia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idbanca")
    private BancaProcesso bancaProcesso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idenviosolicitacao")
    private Enviosolicitacao enviosolicitacao;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idrecibo")
    private ReciboPagamento reciboPagamento;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idusuario")
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idaudiinterna")
    private AuditoriaInterna auditoriaInterna;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idtiposolicitacao")
    private TipoSolicitacao tipoSolicitacao;
    
    // Adding the relationship with Correspondente
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idcorrespondente")
    @JsonIgnoreProperties("solicitacoes")
    private Correspondente correspondente;
    
    private float valor;
    
    private float valordaalcada;
    
    private String emailenvio;
    
    private String pago;
    
    private Integer grupo;
    
    @Column(nullable = true)
    private boolean propostaacordo;
    
    @Column(nullable = true)
    private boolean audinterna;
    
    @Column(length = 1)
    private String lide;
    
    private Integer avaliacaonota;
    
    private String textoavaliacao;
}